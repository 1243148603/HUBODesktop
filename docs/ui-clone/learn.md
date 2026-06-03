# `src/cost-tracker.ts` 代码详解

> 讲解人只有 JavaScript 基础，本文会顺带解释涉及的 TypeScript 语法。

---

## 一、TypeScript vs JavaScript

TS = JS + 类型标注。TS 代码编译后变成纯 JS 运行，类型信息在运行时完全消失，只在开发阶段检查错误。

| 概念 | JS | TS |
|------|-----|-----|
| 类型检查 | 运行时才发现 | 编译时就能发现 |
| 定义对象形状 | 靠注释或脑补 | `type` / `interface` |
| 函数参数约束 | 不检查 | 限制类型和数量 |
| `import` | ES6 模块 | 同 JS，但多了 `import type` |

---

## 二、文件概述

`cost-tracker.ts` 是 HUBO 的**成本追踪模块**，负责记录每次 API 调用的：
- 花了多少钱（USD）
- 用了多少 token（输入/输出/缓存读/缓存写）
- API 耗时（含重试 vs 不含重试）
- 改了多少行代码（新增/删除）
- 网络搜索次数

核心数据流：

```
每次 API 调用
    │
    ▼
addToTotalSessionCost(cost, usage, model)  ← 入口
    │
    ├── addToTotalModelUsage()      → 按模型累加 token/费用
    ├── addToTotalCostState()       → 写入全局运行时状态
    ├── CostCounter / TokenCounter  → 实时指标计数器
    ├── getAdvisorUsage()           → 提取子模型调用
    │       └── 递归 addToTotalSessionCost()  → 重复上述
    │
    ▼
运行时状态（内存）
    │
    ├── saveCurrentSessionCosts()   → 持久化到 config 文件
    ├── restoreCostStateForSession() → 从 config 文件恢复
    ├── getSessionUsageSnapshot()   → 导出快照对象
    │
    └── formatTotalCost()           → 格式化为终端显示字符串
            ├── formatCost()
            └── formatModelUsage()
```

---

## 三、逐段代码分析

### 3.1 导入（第 1-48 行）

```typescript
import type { BetaUsage as Usage } from '@anthropic-ai/sdk/...'
```

- `import type`：只导入类型定义，编译后整行消失，不产生 JS 代码。
- `as Usage`：给 `BetaUsage` 起个别名 `Usage`，方便内部使用。

```typescript
import chalk from 'chalk'
```

- `chalk` 给终端文字加颜色。`chalk.dim('灰色文字')` 输出灰色字。

```typescript
import {
  addToTotalCostState,
  getCostCounter,
  // ...
} from './bootstrap/state.js'
```

- **具名导入**：从 `state.js` 导入具体的函数，都是用来读写全局状态。

```typescript
import type { ModelUsage } from './entrypoints/agentSdkTypes.js'
```

- 导入一个**类型**，描述"某个模型用了多少资源"的数据形状。

```typescript
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  logEvent,
} from './services/analytics/index.js'
```

- 混合导入：`AnalyticsMetadata_...` 是类型（带 `type` 前缀），`logEvent` 是实际函数。
- 那个很长且奇怪的类型名是**刻意命名的**，避免被误解为代码或文件路径。

---

### 3.2 重新导出（第 49-69 行）

```typescript
export {
  getTotalCostUSD as getTotalCost,
  getTotalDuration,
  // ...
  formatCost,
  // ...
}
```

- 这些函数原本定义在别的文件里，这里把它们**重新导出**（re-export）。
- 好处：外部只需从 `cost-tracker.ts` 一个地方导入，不用知道底层分布在哪个文件。
- `getTotalCostUSD as getTotalCost`：导出的同时改名，外部用 `getTotalCost` 这个名字调用。

---

### 3.3 类型定义（第 71-108 行）

#### `SessionUsageSnapshot` (第 71-97 行)

```typescript
export type SessionUsageSnapshot = {
  totalCostUSD: number           // 总花费(美元)
  costDisplay: string            // 格式化后的显示字符串，如 "$1.23"
  hasUnknownModelCost: boolean   // 是否有未知模型（费用可能不准）
  totalAPIDuration: number       // API 总耗时(ms)
  totalDuration: number          // 墙上时钟总耗时(ms)
  totalLinesAdded: number        // 新增代码行数
  totalLinesRemoved: number      // 删除代码行数
  totalInputTokens: number       // 总输入 token
  totalOutputTokens: number      // 总输出 token
  totalCacheReadInputTokens: number      // 缓存读取 token
  totalCacheCreationInputTokens: number  // 缓存写入 token
  totalWebSearchRequests: number         // 网络搜索次数
  models: Array<{                 // 按模型分组的详情
    model: string
    displayName: string
    inputTokens: number
    outputTokens: number
    cacheReadInputTokens: number
    cacheCreationInputTokens: number
    webSearchRequests: number
    costUSD: number
    costDisplay: string
    contextWindow: number        // 上下文窗口大小
    maxOutputTokens: number      // 最大输出 token 数
  }>
}
```

> **`type X = {...}`** 定义了一个"对象形状"。任何被标注为 `SessionUsageSnapshot` 类型的变量，必须是一个包含这些字段、字段类型正确的对象。
>
> **`Array<{...}>`** 是泛型写法，等价的 JS 写法是 `{...}[]`。
>
> **`number` / `string` / `boolean`** 是 TS 的基本类型。

#### `StoredCostState` (第 99-108 行)

```typescript
type StoredCostState = {
  totalCostUSD: number
  totalAPIDuration: number
  totalAPIDurationWithoutRetries: number  // 不含重试
  totalToolDuration: number               // 工具调用耗时
  totalLinesAdded: number
  totalLinesRemoved: number
  lastDuration: number | undefined        // 联合类型
  modelUsage: { [modelName: string]: ModelUsage } | undefined
}
```

新出现的 TS 概念：

| 语法 | 含义 | JS 等效 |
|------|------|---------|
| `number \| undefined` | **联合类型**：可以是数字或 undefined | 没类型约束，靠自觉 |
| `{ [modelName: string]: ModelUsage }` | **索引签名**：键是字符串，值是 ModelUsage | 普通对象 |

索引签名的实际样子：
```js
// 运行时数据长这样：
{
  "claude-sonnet-4-6": { inputTokens: 1000, outputTokens: 500, ... },
  "claude-opus-4-7":   { inputTokens: 2000, outputTokens: 300, ... },
}
```

---

### 3.4 `getStoredSessionCosts()` —— 从配置文件读取历史费用（第 115-151 行）

```typescript
export function getStoredSessionCosts(
  sessionId: string,
): StoredCostState | undefined {
```

- `(sessionId: string)` — 参数必须是字符串
- `): StoredCostState | undefined` — 返回值可能是 `StoredCostState` 或 `undefined`

```typescript
  const projectConfig = getCurrentProjectConfig()

  // 安全检查：只返回当前会话的数据
  if (projectConfig.lastSessionId !== sessionId) {
    return undefined
  }
```

如果一个会话 ID 对不上，直接返回 `undefined`，避免读到别人的数据。

```typescript
  let modelUsage: { [modelName: string]: ModelUsage } | undefined
  if (projectConfig.lastModelUsage) {
    modelUsage = Object.fromEntries(
      Object.entries(projectConfig.lastModelUsage).map(([model, usage]) => [
        model,
        {
          ...usage,           // 展开运算符：复制 usage 的所有字段
          // 这两个是模型属性，不存盘，每次都实时查询
          contextWindow: getContextWindowForModel(model, getSdkBetas()),
          maxOutputTokens: getModelMaxOutputTokens(model).default,
        },
      ]),
    )
  }
```

处理管线：
1. `Object.entries(obj)` → 把对象变成 `[键, 值]` 数组
2. `.map(([model, usage]) => ...)` → 遍历，给每个模型加上 contextWindow 和 maxOutputTokens
3. `...usage` → 把旧数据展开
4. `Object.fromEntries(...)` → 把数组重新组装成对象

```typescript
  return {
    totalCostUSD: projectConfig.lastCost ?? 0,
    // ...
  }
```

> **`??`** 是**空值合并运算符**：左边是 `null` 或 `undefined` 时才用右边的默认值。
> 比 `||` 更精确——`||` 会把 `0`、`''`、`false` 都当 falsy，但 `0` 在这里是合法值（花了 0 元）。

---

### 3.5 `restoreCostStateForSession()` —— 恢复历史费用（第 158-165 行）

```typescript
export function restoreCostStateForSession(sessionId: string): boolean {
  const data = getStoredSessionCosts(sessionId)
  if (!data) {
    return false
  }
  setCostStateForRestore(data)
  return true
}
```

- 用上面的函数读配置，读到了就恢复到内存，返回 `true`；读不到返回 `false`。
- 使用场景：关闭 Claude Code 后重新打开，从配置文件恢复之前的费用继续累加。

---

### 3.6 `saveCurrentSessionCosts()` —— 保存当前费用（第 171-203 行）

```typescript
export function saveCurrentSessionCosts(fpsMetrics?: FpsMetrics): void {
```

- `fpsMetrics?` 的 `?` 表示**可选参数**，可以传也可以不传。
- `: void` 表示没有返回值。

```typescript
  saveCurrentProjectConfig(current => ({
    ...current,    // 保留所有旧配置字段
    // 覆盖/新增以下字段：
    lastCost: getTotalCostUSD(),
    lastAPIDuration: getTotalAPIDuration(),
    // ... 一系列字段 ...
    lastSessionId: getSessionId(),
  }))
```

- **函数式更新**模式：传入一个回调，接收当前配置，返回新配置。不会丢失未明确列出的字段。
- `...current` 是对象展开，保留旧字段，然后逐项覆盖。

---

### 3.7 `formatCost()` —— 格式化金额（第 205-207 行）

```typescript
function formatCost(cost: number, maxDecimalPlaces: number = 4): string {
  return `$${cost > 0.5 ? round(cost, 100).toFixed(2) : cost.toFixed(maxDecimalPlaces)}`
}
```

- 没有 `export`，所以是**模块私有**的，外部文件用不了。
- `maxDecimalPlaces: number = 4` 是**参数默认值**。
- 逻辑：大于 0.5 美元 → 保留 2 位小数（精确到分）；小金额 → 用默认的 4 位小数。
- `` `$...` `` 是模板字符串，和 JS 一样。

---

### 3.8 `formatModelUsage()` —— 格式化各模型用量（第 209-254 行）

```typescript
function formatModelUsage(): string {
  const modelUsageMap = getModelUsage()
  if (Object.keys(modelUsageMap).length === 0) {
    return 'Usage: 0 input, 0 output, 0 cache read, 0 cache write'
  }
```

先获取全部用量。没有就返回简单提示。

```typescript
  // 合并同名模型（不同版本号合并统计）
  const usageByShortName: { [shortName: string]: ModelUsage } = {}
  for (const [model, usage] of Object.entries(modelUsageMap)) {
    const shortName = getCanonicalName(model)
    if (!usageByShortName[shortName]) {
      // 第一次遇到这个短名，初始化一个全 0 记录
      usageByShortName[shortName] = {
        inputTokens: 0, outputTokens: 0, cacheReadInputTokens: 0,
        cacheCreationInputTokens: 0, webSearchRequests: 0,
        costUSD: 0, contextWindow: 0, maxOutputTokens: 0,
      }
    }
    // 累加
    usageByShortName[shortName].inputTokens += usage.inputTokens
    usageByShortName[shortName].outputTokens += usage.outputTokens
    // ...
  }
```

**合并逻辑**：`claude-sonnet-4-6-20250514` 和 `claude-sonnet-4-6-20250601` 统一成 `claude-sonnet-4-6`，然后汇总用量。

```typescript
  let result = 'Usage by model:'
  for (const [shortName, usage] of Object.entries(usageByShortName)) {
    const usageString =
      `  ${formatNumber(usage.inputTokens)} input, ` +
      `${formatNumber(usage.outputTokens)} output, ` +
      // ...
    result += `\n` + `${shortName}:`.padStart(21) + usageString
  }
  return result
```

- `formatNumber(1500)` 可能返回 `"1.5k"` 这样的缩写。
- `.padStart(21)` 让模型名**右对齐**，总宽度 21 字符。

最终效果：
```
Usage by model:
   claude-sonnet-4-6:  1.5k input, 800 output, 200 cache read, 100 cache write ($0.05)
     claude-opus-4-7:  2.3k input, 1.2k output, 0 cache read, 0 cache write ($0.12)
```

---

### 3.9 `formatTotalCost()` —— 总花费展示（第 256-272 行）

```typescript
export function formatTotalCost(): string {
  const costDisplay =
    formatCost(getTotalCostUSD()) +
    (hasUnknownModelCost()
      ? ' (costs may be inaccurate due to usage of unknown models)'
      : '')
```

- **三元表达式**：有未知模型时追加警告。
- 结果示例：`"$2.50 (costs may be inaccurate due to usage of unknown models)"`

```typescript
  return chalk.dim(
    `Total cost:            ${costDisplay}\n` +
    `Total duration (API):  ${formatDuration(getTotalAPIDuration())}\n` +
    `Total duration (wall): ${formatDuration(getTotalDuration())}\n` +
    `Total code changes:    ${getTotalLinesAdded()} ` +
      `${getTotalLinesAdded() === 1 ? 'line' : 'lines'} added, ` +
      `${getTotalLinesRemoved()} ` +
      `${getTotalLinesRemoved() === 1 ? 'line' : 'lines'} removed\n` +
    `${modelUsageDisplay}`,
  )
}
```

- `chalk.dim()` 让整段输出**灰色**，在终端中低调显示。
- **API duration**：实际等 API 响应的时间；**wall duration**：墙上时钟总时间（含网络、本地处理）。
- 英文单复数处理：1 行用 `line`，其余用 `lines`。

---

### 3.10 `getSessionUsageSnapshot()` —— 导出快照（第 274-302 行）

```typescript
export function getSessionUsageSnapshot(): SessionUsageSnapshot {
  return {
    totalCostUSD: getTotalCostUSD(),
    costDisplay: formatCost(getTotalCostUSD()),
    // ...
    models: Object.entries(getModelUsage()).map(([model, usage]) => ({
      model,
      displayName: getCanonicalName(model),
      inputTokens: usage.inputTokens,
      // ...
    })),
  }
}
```

- 把所有全局状态汇总成一个 `SessionUsageSnapshot` 对象。
- `.map(([model, usage]) => ({...}))` 注意箭头函数用了 **`()` 包裹对象**——因为 `{}` 会被解析为函数体，加上 `()` 告诉引擎"这是对象字面量"。
- `{ model }` 是**属性简写**，等价于 `{ model: model }`。

---

### 3.11 `round()` —— 精确舍入（第 304-306 行）

```typescript
function round(number: number, precision: number): number {
  return Math.round(number * precision) / precision
}
```

- 乘除大法避免浮点精度问题：`round(1.2345, 100)` → `Math.round(123.45) / 100` → `1.23`

---

### 3.12 `addToTotalModelUsage()` —— 按模型累加用量（第 308-334 行）

```typescript
function addToTotalModelUsage(
  cost: number,
  usage: Usage,
  model: string,
): ModelUsage {
  const modelUsage = getUsageForModel(model) ?? {
    inputTokens: 0, outputTokens: 0, cacheReadInputTokens: 0,
    cacheCreationInputTokens: 0, webSearchRequests: 0,
    costUSD: 0, contextWindow: 0, maxOutputTokens: 0,
  }
```

- `getUsageForModel(model) ?? { ... }`：尝试拿已有数据，没拿到就用全 0 初始值。

```typescript
  modelUsage.inputTokens += usage.input_tokens
  modelUsage.outputTokens += usage.output_tokens
  modelUsage.cacheReadInputTokens += usage.cache_read_input_tokens ?? 0
  modelUsage.cacheCreationInputTokens += usage.cache_creation_input_tokens ?? 0
  modelUsage.webSearchRequests +=
    usage.server_tool_use?.web_search_requests ?? 0
  modelUsage.costUSD += cost
```

> **`?.`** 是**可选链操作符**：左边是 `null`/`undefined` 时，整条表达式直接返回 `undefined` 而不报错。
>
> `usage.server_tool_use?.web_search_requests ?? 0`：
> 1. `server_tool_use` 存在 → 取 `web_search_requests`
> 2. `server_tool_use` 不存在 → 返回 `undefined` → `?? 0` 变成 `0`

```typescript
  modelUsage.contextWindow = getContextWindowForModel(model, getSdkBetas())
  modelUsage.maxOutputTokens = getModelMaxOutputTokens(model).default
  return modelUsage
}
```

- `contextWindow` 和 `maxOutputTokens` 是模型固定属性，每次重新查询（不累加）。

---

### 3.13 `addToTotalSessionCost()` —— 核心：记录一次 API 调用（第 336-381 行）

这是一个**递归函数**，是整文件最核心的逻辑。

```typescript
export function addToTotalSessionCost(
  cost: number,
  usage: Usage,
  model: string,
): number {
  const modelUsage = addToTotalModelUsage(cost, usage, model)
  addToTotalCostState(cost, modelUsage, model)
```

先把本次调用计入状态。

```typescript
  const attrs =
    isFastModeEnabled() && usage.speed === 'fast'
      ? { model, speed: 'fast' }
      : { model }
```

**Fast Mode** 是 Claude Code 的一个功能，用 Opus 模型但有更快输出。这里给指标打上 `speed: 'fast'` 标签。

```typescript
  getCostCounter()?.add(cost, attrs)
  getTokenCounter()?.add(usage.input_tokens, { ...attrs, type: 'input' })
  getTokenCounter()?.add(usage.output_tokens, { ...attrs, type: 'output' })
  getTokenCounter()?.add(usage.cache_read_input_tokens ?? 0, {
    ...attrs, type: 'cacheRead'
  })
  getTokenCounter()?.add(usage.cache_creation_input_tokens ?? 0, {
    ...attrs, type: 'cacheCreation'
  })
```

- `getCostCounter()?.add(...)` — Counter 可能没初始化，`?.` 保证了不报错。
- `{ ...attrs, type: 'input' }` — 在 attrs 基础上追加 `type` 字段。
- 分别记录：费用、输入 token、输出 token、缓存读 token、缓存写 token。

```typescript
  let totalCost = cost
  for (const advisorUsage of getAdvisorUsage(usage)) {
    const advisorCost = calculateUSDCost(advisorUsage.model, advisorUsage)
    logEvent('tengu_advisor_tool_token_usage', {
      advisor_model: advisorUsage.model as AnalyticsMetadata_...,
      input_tokens: advisorUsage.input_tokens,
      output_tokens: advisorUsage.output_tokens,
      cache_read_input_tokens: advisorUsage.cache_read_input_tokens ?? 0,
      cache_creation_input_tokens: advisorUsage.cache_creation_input_tokens ?? 0,
      cost_usd_micros: Math.round(advisorCost * 1_000_000),
    })
    totalCost += addToTotalSessionCost(
      advisorCost,
      advisorUsage,
      advisorUsage.model,
    )
  }
  return totalCost
```

- **Advisor**：Claude Code 内部会调用"顾问"子模型来辅助决策，也需要单独计费。
- `as AnalyticsMetadata_...` 是 **类型断言**，告诉编译器"我确定这个值符合那个类型"。
- `cost_usd_micros: Math.round(advisorCost * 1_000_000)` — 把美元转为**微美元**（micro-dollars），用整数避免浮点精度。
- 🔁 **递归**：`totalCost += addToTotalSessionCost(...)` — Advisor 可能也有自己的 Advisor，递归是最自然的处理方式。

---

## 四、设计模式总结

这个文件把三个职责清晰地分开了：

| 职责 | 函数 |
|------|------|
| **累加** | `addToTotalSessionCost()`, `addToTotalModelUsage()` |
| **持久化** | `saveCurrentSessionCosts()`, `restoreCostStateForSession()` |
| **展示** | `formatTotalCost()`, `formatModelUsage()`, `getSessionUsageSnapshot()` |

---

## 五、TypeScript 新概念速查表

| TS 语法 | 含义 | 本文示例 |
|---------|------|----------|
| `import type { X }` | 只导入类型，编译后消失 | `import type { Usage }` |
| `type X = { a: number }` | 定义对象形状 | `type SessionUsageSnapshot` |
| `number \| undefined` | 联合类型 | `StoredCostState.lastDuration` |
| `Array<X>` | 泛型数组 | `models: Array<{...}>` |
| `param?: Type` | 可选参数 | `fpsMetrics?: FpsMetrics` |
| `param = defaultValue` | 参数默认值 | `maxDecimalPlaces: number = 4` |
| `a ?? b` | 空值合并（只有 null/undefined 时用 b） | `projectConfig.lastCost ?? 0` |
| `obj?.prop` | 可选链（obj 为 null/undefined 时不报错） | `getCostCounter()?.add(...)` |
| `{ ...obj }` | 对象展开 | `{ ...current, newField: 1 }` |
| `(obj as Type)` | 类型断言（告诉编译器类型） | `model as AnalyticsMetadata_...` |
| `[key: string]: Value` | 索引签名 | `{ [modelName: string]: ModelUsage }` |

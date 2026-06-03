/**
 * 构建独立 CLI 可执行文件（双击可运行的命令行版本）
 *
 * 输出: desktop/build-artifacts/cli/hubo-cli.exe (Windows) 或 hubo-cli (macOS/Linux)
 */

import path from 'node:path'
import { mkdirSync } from 'node:fs'

const desktopRoot = path.resolve(import.meta.dir, '..')
const repoRoot = path.resolve(desktopRoot, '..')
const outDir = path.join(desktopRoot, 'build-artifacts', 'cli')
mkdirSync(outDir, { recursive: true })

// 检测目标平台
const platform = process.platform as 'win32' | 'darwin' | 'linux'
const bunTarget = {
  win32: 'bun-windows-x64',
  darwin: 'bun-darwin-arm64',
  linux: 'bun-linux-x64-baseline',
}[platform]!

const outfileName = platform === 'win32' ? 'hubo.exe' : 'hubo'
const outfile = path.join(outDir, outfileName)

console.log(`[build-cli-standalone] 平台: ${platform} → ${bunTarget}`)
console.log(`[build-cli-standalone] 入口: desktop/sidecars/cli-standalone.ts`)
console.log(`[build-cli-standalone] 输出: ${outfile}`)

const result = await Bun.build({
  entrypoints: [path.join(desktopRoot, 'sidecars/cli-standalone.ts')],
  minify: { whitespace: true, identifiers: true, syntax: true },
  sourcemap: 'none',
  target: 'bun',
  // 排除不需要的可选依赖，减小体积
  external: [
    '@opentelemetry/exporter-trace-otlp-grpc',
    '@opentelemetry/exporter-trace-otlp-http',
    '@opentelemetry/exporter-trace-otlp-proto',
    '@opentelemetry/exporter-logs-otlp-grpc',
    '@opentelemetry/exporter-logs-otlp-http',
    '@opentelemetry/exporter-logs-otlp-proto',
    '@opentelemetry/exporter-metrics-otlp-grpc',
    '@opentelemetry/exporter-metrics-otlp-http',
    '@opentelemetry/exporter-metrics-otlp-proto',
    '@opentelemetry/exporter-prometheus',
    '@aws-sdk/client-bedrock',
    '@aws-sdk/client-sts',
    '@anthropic-ai/bedrock-sdk',
    '@anthropic-ai/foundry-sdk',
    '@anthropic-ai/vertex-sdk',
    '@azure/identity',
    '@anthropic-ai/mcpb',
    'fflate',
    'sharp',
    'react-devtools-core',
  ],
  compile: {
    target: bunTarget,
    outfile,
    autoloadTsconfig: true,
    autoloadPackageJson: true,
    windows: {
      title: 'HUBO',
      icon: path.join(desktopRoot, 'src-tauri/icons/icon.ico'),
      // 不设 hideConsole —— 双击弹出命令行窗口
      publisher: 'HUBO',
      description: 'HUBO CLI',
    },
  },
})

if (!result.success) {
  const logs = result.logs.map((log) => log.message).join('\n')
  console.error(`[build-cli-standalone] 编译失败:\n${logs}`)
  process.exit(1)
}

const outputPath = result.outputs[0]?.path ?? outfile
console.log(`[build-cli-standalone] ✅ 编译成功 → ${outputPath}`)

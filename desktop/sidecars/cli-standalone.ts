/**
 * HUBO 独立 CLI 入口 — 双击可直接运行的命令行版本。
 *
 * 和 hubo-sidecar cli 模式功能完全相同，区别是：
 * 1. 不需要传 mode 参数，启动就是 CLI
 * 2. 不设 hideConsole，双击会弹出命令行窗口
 * 3. 不依赖 Tauri 壳，纯独立 exe
 */

// 设置工作目录（CLI 内部用这个值作为 "Primary working directory"）
process.env.CALLER_DIR ||= process.cwd()

// preload.ts 做模块路径别名、补丁等初始化，必须在导入任何内核代码前执行
await import('../../preload.ts')

// 启动 Claude Code 内核的 CLI 交互界面
await import('../../src/entrypoints/cli.tsx')

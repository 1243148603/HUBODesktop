<<<<<<< HEAD
import { invoke } from '@tauri-apps/api/core'
import { isTauriRuntime } from './desktopRuntime'
import type { WebviewBounds } from '../components/browser/computeWebviewBounds'

async function call(cmd: string, args?: Record<string, unknown>): Promise<void> {
  if (!isTauriRuntime()) return
  await invoke(cmd, args)
}

export const previewBridge = {
  open: (url: string, bounds: WebviewBounds) => call('preview_open', { url, bounds }),
  navigate: (url: string) => call('preview_navigate', { url }),
  setBounds: (bounds: WebviewBounds) => call('preview_set_bounds', { bounds }),
  setVisible: (visible: boolean) => call('preview_set_visible', { visible }),
  close: () => call('preview_close'),
  eval: (js: string) => call('preview_eval', { js }),
=======
import type { WebviewBounds } from '../components/browser/computeWebviewBounds'
import { getDesktopHost } from './desktopHost'
import type { PreviewHostMessage } from './desktopHost'

function getPreviewHost() {
  const host = getDesktopHost()
  return host.capabilities.previewWebview ? host.preview : null
}

export const previewBridge = {
  open: (url: string, bounds: WebviewBounds) => getPreviewHost()?.open(url, bounds) ?? Promise.resolve(),
  navigate: (url: string) => getPreviewHost()?.navigate(url) ?? Promise.resolve(),
  setBounds: (bounds: WebviewBounds) => getPreviewHost()?.setBounds(bounds) ?? Promise.resolve(),
  setVisible: (visible: boolean) => getPreviewHost()?.setVisible(visible) ?? Promise.resolve(),
  close: () => getPreviewHost()?.close() ?? Promise.resolve(),
  message: (payload: PreviewHostMessage) => getPreviewHost()?.message(payload) ?? Promise.resolve(),
>>>>>>> upstream/main
}

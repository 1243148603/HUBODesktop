<<<<<<< HEAD
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { WebviewBounds } from '../components/browser/computeWebviewBounds'

const invoke = vi.fn()
vi.mock('@tauri-apps/api/core', () => ({ invoke: (...a: unknown[]) => invoke(...a) }))
vi.mock('./desktopRuntime', () => ({ isTauriRuntime: () => true }))

afterEach(() => { invoke.mockReset() })

describe('previewBridge', () => {
  it('openPreview forwards url + bounds to preview_open', async () => {
    const { previewBridge } = await import('./previewBridge')
    const bounds: WebviewBounds = { x: 1, y: 2, width: 3, height: 4 }
    await previewBridge.open('http://localhost/a', bounds)
    expect(invoke).toHaveBeenCalledWith('preview_open', { url: 'http://localhost/a', bounds })
  })

  it('setBounds forwards to preview_set_bounds', async () => {
    const { previewBridge } = await import('./previewBridge')
    await previewBridge.setBounds({ x: 0, y: 0, width: 10, height: 10 })
    expect(invoke).toHaveBeenCalledWith('preview_set_bounds', { bounds: { x: 0, y: 0, width: 10, height: 10 } })
  })

  it('eval forwards js to preview_eval', async () => {
    const { previewBridge } = await import('./previewBridge')
    await previewBridge.eval('window.x=1')
    expect(invoke).toHaveBeenCalledWith('preview_eval', { js: 'window.x=1' })
  })

  it('is a no-op outside the Tauri runtime', async () => {
    vi.resetModules()
    vi.doMock('./desktopRuntime', () => ({ isTauriRuntime: () => false }))
=======
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WebviewBounds } from '../components/browser/computeWebviewBounds'
import { browserHost } from './desktopHost/browserHost'

const invoke = vi.fn()

function installElectronPreviewHost() {
  const open = vi.fn().mockResolvedValue(undefined)
  const setBounds = vi.fn().mockResolvedValue(undefined)
  const message = vi.fn().mockResolvedValue(undefined)

  window.desktopHost = {
    ...browserHost,
    kind: 'electron',
    isDesktop: true,
    capabilities: {
      ...browserHost.capabilities,
      previewWebview: true,
    },
    preview: {
      ...browserHost.preview,
      open,
      setBounds,
      message,
    },
  }

  return { open, setBounds, message }
}

beforeEach(() => {
  Reflect.deleteProperty(window, '__TAURI_INTERNALS__')
  Reflect.deleteProperty(window, '__TAURI__')
})

afterEach(() => {
  invoke.mockReset()
  Reflect.deleteProperty(window, 'desktopHost')
  Reflect.deleteProperty(window, '__TAURI_INTERNALS__')
  Reflect.deleteProperty(window, '__TAURI__')
})

describe('previewBridge', () => {
  it('openPreview forwards url + bounds to the Electron preview host', async () => {
    const { open } = installElectronPreviewHost()
    const { previewBridge } = await import('./previewBridge')
    const bounds: WebviewBounds = { x: 1, y: 2, width: 3, height: 4 }
    await previewBridge.open('http://localhost/a', bounds)
    expect(open).toHaveBeenCalledWith('http://localhost/a', bounds)
    expect(invoke).not.toHaveBeenCalled()
  })

  it('setBounds forwards to the Electron preview host', async () => {
    const { setBounds } = installElectronPreviewHost()
    const { previewBridge } = await import('./previewBridge')
    const bounds: WebviewBounds = { x: 0, y: 0, width: 10, height: 10 }
    await previewBridge.setBounds(bounds)
    expect(setBounds).toHaveBeenCalledWith(bounds)
    expect(invoke).not.toHaveBeenCalled()
  })

  it('message forwards structured host messages to the Electron preview host', async () => {
    const { message } = installElectronPreviewHost()
    const { previewBridge } = await import('./previewBridge')
    const payload = { v: 1, type: 'capture', kind: 'full' } as const
    await previewBridge.message(payload)
    expect(message).toHaveBeenCalledWith(payload)
    expect(invoke).not.toHaveBeenCalled()
  })

  it('is a no-op outside the desktop runtime', async () => {
    vi.resetModules()
    Reflect.deleteProperty(window, '__TAURI_INTERNALS__')
>>>>>>> upstream/main
    const { previewBridge } = await import('./previewBridge')
    await previewBridge.open('http://localhost/a', { x: 0, y: 0, width: 1, height: 1 })
    expect(invoke).not.toHaveBeenCalled()
  })
<<<<<<< HEAD
=======

  it('routes preview commands through an injected desktop host', async () => {
    vi.resetModules()
    Reflect.deleteProperty(window, '__TAURI_INTERNALS__')
    const open = vi.fn().mockResolvedValue(undefined)
    const setBounds = vi.fn().mockResolvedValue(undefined)
    const message = vi.fn().mockResolvedValue(undefined)

    window.desktopHost = {
      ...browserHost,
      kind: 'electron',
      isDesktop: true,
      capabilities: {
        ...browserHost.capabilities,
        previewWebview: true,
      },
      preview: {
        ...browserHost.preview,
        open,
        setBounds,
        message,
      },
    }

    const { previewBridge } = await import('./previewBridge')
    const bounds: WebviewBounds = { x: 1, y: 2, width: 3, height: 4 }

    await previewBridge.open('http://localhost/a', bounds)
    await previewBridge.setBounds(bounds)
    await previewBridge.message({ v: 1, type: 'enter-picker' })

    expect(open).toHaveBeenCalledWith('http://localhost/a', bounds)
    expect(setBounds).toHaveBeenCalledWith(bounds)
    expect(message).toHaveBeenCalledWith({ v: 1, type: 'enter-picker' })
    expect(invoke).not.toHaveBeenCalled()
  })
>>>>>>> upstream/main
})

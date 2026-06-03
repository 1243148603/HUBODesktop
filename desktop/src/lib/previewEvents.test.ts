import { beforeEach, describe, expect, it, vi } from 'vitest'
<<<<<<< HEAD

const listeners: Record<string, (e: { payload: string }) => void> = {}
vi.mock('@tauri-apps/api/event', () => ({
  listen: (name: string, cb: (e: { payload: string }) => void) => { listeners[name] = cb; return Promise.resolve(() => {}) },
}))
=======
import { browserHost } from './desktopHost/browserHost'

let previewHandler: ((payload: unknown) => void) | null = null
>>>>>>> upstream/main

const { prefill, sendMessage } = vi.hoisted(() => ({
  prefill: vi.fn(),
  sendMessage: vi.fn(),
}))
vi.mock('../stores/chatStore', () => ({
  useChatStore: {
    getState: () => ({
      queueComposerPrefill: prefill,
      sendMessage,
    }),
  },
}))

import { subscribePreviewEvents } from './previewEvents'
import { useBrowserPanelStore } from '../stores/browserPanelStore'

describe('subscribePreviewEvents', () => {
  beforeEach(() => {
<<<<<<< HEAD
    prefill.mockClear()
    sendMessage.mockClear()
=======
    previewHandler = null
    prefill.mockClear()
    sendMessage.mockClear()
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
        onEvent: async (handler) => {
          previewHandler = handler
          return () => {
            previewHandler = null
          }
        },
      },
    }
>>>>>>> upstream/main
  })

  it('routes navigated event to the store', async () => {
    useBrowserPanelStore.getState().open('s1', 'http://x/a')
    await subscribePreviewEvents('s1')
<<<<<<< HEAD
    listeners['preview://event']!({ payload: JSON.stringify({ v: 1, type: 'navigated', url: 'http://x/c', title: 'C' }) })
=======
    previewHandler!(JSON.stringify({ v: 1, type: 'navigated', url: 'http://x/c', title: 'C' }))
>>>>>>> upstream/main
    expect(useBrowserPanelStore.getState().bySession['s1']!.url).toBe('http://x/c')
  })

  it('screenshot event prefills composer with an image attachment', async () => {
    await subscribePreviewEvents('s1')
<<<<<<< HEAD
    listeners['preview://event']!({ payload: JSON.stringify({ v: 1, type: 'screenshot', dataUrl: 'data:image/png;base64,AAAA', kind: 'full' }) })
    expect(prefill).toHaveBeenCalledWith('s1', expect.objectContaining({
=======
    previewHandler!({ v: 1, type: 'screenshot', dataUrl: 'data:image/png;base64,AAAA', kind: 'full' })
    expect(prefill).toHaveBeenCalledWith('s1', expect.objectContaining({
      mode: 'append',
>>>>>>> upstream/main
      attachments: [expect.objectContaining({ type: 'image', data: 'data:image/png;base64,AAAA' })],
    }))
  })

  it('selection event sends a chat turn directly with hidden prompt text + annotated screenshot', async () => {
    await subscribePreviewEvents('s1')
    const payload = { pageUrl: 'http://x/', element: { selector: '#t', tag: 'h1', classes: [] }, change: { description: '改一下' }, screenshot: { dataUrl: 'data:image/png;base64,AAAA', kind: 'element' } }
<<<<<<< HEAD
    listeners['preview://event']!({ payload: JSON.stringify({ v: 1, type: 'selection', payload }) })
=======
    previewHandler!(JSON.stringify({ v: 1, type: 'selection', payload }))
>>>>>>> upstream/main
    expect(prefill).not.toHaveBeenCalled()
    expect(sendMessage).toHaveBeenCalledWith(
      's1',
      expect.stringContaining('改一下'),
      [expect.objectContaining({
        type: 'image',
        name: '<h1>',
        data: 'data:image/png;base64,AAAA',
        note: '改一下',
      })],
      expect.objectContaining({
        hideDisplayContent: true,
        displayAttachments: [expect.objectContaining({ name: '<h1>', note: '改一下' })],
      }),
    )
  })

  it('selection event resets pickerActive on the session', async () => {
    useBrowserPanelStore.getState().open('s1', 'http://x/a')
    useBrowserPanelStore.getState().setPicker('s1', true)
    await subscribePreviewEvents('s1')
<<<<<<< HEAD
    listeners['preview://event']!({ payload: JSON.stringify({ v: 1, type: 'selection', payload: { pageUrl: 'http://x/', element: { selector: '#t', tag: 'h1', classes: [] }, screenshot: { dataUrl: 'data:image/png;base64,AAAA', kind: 'element' } } }) })
=======
    previewHandler!(JSON.stringify({ v: 1, type: 'selection', payload: { pageUrl: 'http://x/', element: { selector: '#t', tag: 'h1', classes: [] }, screenshot: { dataUrl: 'data:image/png;base64,AAAA', kind: 'element' } } }))
>>>>>>> upstream/main
    expect(useBrowserPanelStore.getState().bySession['s1']!.pickerActive).toBe(false)
  })

  it('ignores a malformed selection payload without throwing but still resets picker', async () => {
    useBrowserPanelStore.getState().open('s1', 'http://x/a')
    useBrowserPanelStore.getState().setPicker('s1', true)
    await subscribePreviewEvents('s1')
<<<<<<< HEAD
    expect(() => listeners['preview://event']!({ payload: JSON.stringify({ v: 1, type: 'selection', payload: { pageUrl: 'http://x/' } }) })).not.toThrow()
=======
    expect(() => previewHandler!(JSON.stringify({ v: 1, type: 'selection', payload: { pageUrl: 'http://x/' } }))).not.toThrow()
>>>>>>> upstream/main
    expect(useBrowserPanelStore.getState().bySession['s1']!.pickerActive).toBe(false)
  })

  it('picker-exited event resets pickerActive', async () => {
    useBrowserPanelStore.getState().open('s1', 'http://x/a')
    useBrowserPanelStore.getState().setPicker('s1', true)
    await subscribePreviewEvents('s1')
<<<<<<< HEAD
    listeners['preview://event']!({ payload: JSON.stringify({ v: 1, type: 'picker-exited' }) })
=======
    previewHandler!(JSON.stringify({ v: 1, type: 'picker-exited' }))
>>>>>>> upstream/main
    expect(useBrowserPanelStore.getState().bySession['s1']!.pickerActive).toBe(false)
  })
})

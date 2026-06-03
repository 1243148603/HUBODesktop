import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const {
  copyTextToClipboardMock,
  logoutMock,
  shellOpenMock,
  startMock,
  statusMock,
} = vi.hoisted(() => ({
  copyTextToClipboardMock: vi.fn(),
  logoutMock: vi.fn(),
  shellOpenMock: vi.fn(),
  startMock: vi.fn(),
  statusMock: vi.fn(),
}))

vi.mock('@tauri-apps/plugin-shell', () => ({
  open: shellOpenMock,
}))

<<<<<<< HEAD
vi.mock('../../api/huboOpenAIOAuth', () => ({
  huboOpenAIOAuthApi: {
=======
vi.mock('../../api/hahaOpenAIOAuth', () => ({
  hahaOpenAIOAuthApi: {
>>>>>>> upstream/main
    start: startMock,
    status: statusMock,
    logout: logoutMock,
  },
}))

vi.mock('../chat/clipboard', () => ({
  copyTextToClipboard: copyTextToClipboardMock,
}))

import { ChatGPTOfficialLogin } from './ChatGPTOfficialLogin'
<<<<<<< HEAD
import { useHuboOpenAIOAuthStore } from '../../stores/huboOpenAIOAuthStore'
import { useSettingsStore } from '../../stores/settingsStore'

const initialOAuthState = useHuboOpenAIOAuthStore.getState()
=======
import { useHahaOpenAIOAuthStore } from '../../stores/hahaOpenAIOAuthStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { browserHost } from '../../lib/desktopHost/browserHost'

const initialOAuthState = useHahaOpenAIOAuthStore.getState()
>>>>>>> upstream/main

describe('ChatGPTOfficialLogin', () => {
  beforeEach(() => {
    vi.useRealTimers()
    startMock.mockReset()
    statusMock.mockReset()
    logoutMock.mockReset()
    shellOpenMock.mockReset()
    copyTextToClipboardMock.mockReset()
<<<<<<< HEAD
    useSettingsStore.setState({ locale: 'en' })
    useHuboOpenAIOAuthStore.setState({
=======
    Reflect.deleteProperty(window, 'desktopHost')
    useSettingsStore.setState({ locale: 'en' })
    useHahaOpenAIOAuthStore.setState({
>>>>>>> upstream/main
      ...initialOAuthState,
      status: null,
      isPolling: false,
      isLoading: false,
      error: null,
    })
  })

  afterEach(() => {
    act(() => {
<<<<<<< HEAD
      useHuboOpenAIOAuthStore.getState().stopPolling()
      useHuboOpenAIOAuthStore.setState(initialOAuthState)
=======
      useHahaOpenAIOAuthStore.getState().stopPolling()
      useHahaOpenAIOAuthStore.setState(initialOAuthState)
>>>>>>> upstream/main
    })
    vi.useRealTimers()
    cleanup()
    vi.restoreAllMocks()
  })

  it('keeps an actionable authorization link when shell open fails', async () => {
    const authorizeUrl = 'https://chatgpt.com/oauth/authorize?state=openai-state'
<<<<<<< HEAD
    statusMock.mockResolvedValue({ loggedIn: false })
    startMock.mockResolvedValue({ authorizeUrl, state: 'openai-state' })
    shellOpenMock.mockRejectedValue(new Error('shell unavailable'))
=======
    const hostOpen = vi.fn().mockRejectedValue(new Error('shell unavailable'))
    window.desktopHost = {
      ...browserHost,
      kind: 'electron',
      isDesktop: true,
      capabilities: {
        ...browserHost.capabilities,
        shell: true,
      },
      shell: {
        ...browserHost.shell,
        open: hostOpen,
      },
    }
    statusMock.mockResolvedValue({ loggedIn: false })
    startMock.mockResolvedValue({ authorizeUrl, state: 'openai-state' })
>>>>>>> upstream/main
    copyTextToClipboardMock.mockResolvedValue(true)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<ChatGPTOfficialLogin />)

    await screen.findByRole('button', { name: 'Sign in with ChatGPT' })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sign in with ChatGPT' }))
    })

<<<<<<< HEAD
    expect(shellOpenMock).toHaveBeenCalledWith(authorizeUrl)
=======
    expect(hostOpen).toHaveBeenCalledWith(authorizeUrl)
    expect(shellOpenMock).not.toHaveBeenCalled()
>>>>>>> upstream/main
    expect(consoleErrorSpy).toHaveBeenCalledWith('[ChatGPTOfficialLogin] shellOpen failed:', expect.any(Error))
    expect(screen.getByText(/Unable to open browser/)).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy authorization link' }))
    })

    expect(copyTextToClipboardMock).toHaveBeenCalledWith(authorizeUrl)
<<<<<<< HEAD
    expect(useHuboOpenAIOAuthStore.getState().error).toBeNull()
    expect(useHuboOpenAIOAuthStore.getState().isPolling).toBe(true)
=======
    expect(useHahaOpenAIOAuthStore.getState().error).toBeNull()
    expect(useHahaOpenAIOAuthStore.getState().isPolling).toBe(true)
>>>>>>> upstream/main
    expect(screen.queryByText(/Unable to open browser/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copy authorization link' })).not.toBeInTheDocument()
  })

  it('keeps the authorization link available when copy fails', async () => {
    const authorizeUrl = 'https://chatgpt.com/oauth/authorize?state=openai-state'
<<<<<<< HEAD
=======
    window.desktopHost = {
      ...browserHost,
      kind: 'electron',
      isDesktop: true,
      capabilities: {
        ...browserHost.capabilities,
        shell: true,
      },
      shell: {
        ...browserHost.shell,
        open: vi.fn().mockRejectedValue(new Error('shell unavailable')),
      },
    }
>>>>>>> upstream/main
    statusMock.mockResolvedValue({ loggedIn: false })
    startMock.mockResolvedValue({ authorizeUrl, state: 'openai-state' })
    shellOpenMock.mockRejectedValue(new Error('shell unavailable'))
    copyTextToClipboardMock.mockResolvedValue(false)
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<ChatGPTOfficialLogin />)

    await screen.findByRole('button', { name: 'Sign in with ChatGPT' })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sign in with ChatGPT' }))
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy authorization link' }))
    })

    expect(copyTextToClipboardMock).toHaveBeenCalledWith(authorizeUrl)
<<<<<<< HEAD
    expect(useHuboOpenAIOAuthStore.getState().isPolling).toBe(false)
=======
    expect(useHahaOpenAIOAuthStore.getState().isPolling).toBe(false)
>>>>>>> upstream/main
    expect(screen.getByText(/Unable to copy authorization link/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy authorization link' })).toBeInTheDocument()
  })
})

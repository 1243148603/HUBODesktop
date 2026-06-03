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

vi.mock('../../api/huboOpenAIOAuth', () => ({
  huboOpenAIOAuthApi: {
    start: startMock,
    status: statusMock,
    logout: logoutMock,
  },
}))

vi.mock('../chat/clipboard', () => ({
  copyTextToClipboard: copyTextToClipboardMock,
}))

import { ChatGPTOfficialLogin } from './ChatGPTOfficialLogin'
import { useHuboOpenAIOAuthStore } from '../../stores/huboOpenAIOAuthStore'
import { useSettingsStore } from '../../stores/settingsStore'

const initialOAuthState = useHuboOpenAIOAuthStore.getState()

describe('ChatGPTOfficialLogin', () => {
  beforeEach(() => {
    vi.useRealTimers()
    startMock.mockReset()
    statusMock.mockReset()
    logoutMock.mockReset()
    shellOpenMock.mockReset()
    copyTextToClipboardMock.mockReset()
    useSettingsStore.setState({ locale: 'en' })
    useHuboOpenAIOAuthStore.setState({
      ...initialOAuthState,
      status: null,
      isPolling: false,
      isLoading: false,
      error: null,
    })
  })

  afterEach(() => {
    act(() => {
      useHuboOpenAIOAuthStore.getState().stopPolling()
      useHuboOpenAIOAuthStore.setState(initialOAuthState)
    })
    vi.useRealTimers()
    cleanup()
    vi.restoreAllMocks()
  })

  it('keeps an actionable authorization link when shell open fails', async () => {
    const authorizeUrl = 'https://chatgpt.com/oauth/authorize?state=openai-state'
    statusMock.mockResolvedValue({ loggedIn: false })
    startMock.mockResolvedValue({ authorizeUrl, state: 'openai-state' })
    shellOpenMock.mockRejectedValue(new Error('shell unavailable'))
    copyTextToClipboardMock.mockResolvedValue(true)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<ChatGPTOfficialLogin />)

    await screen.findByRole('button', { name: 'Sign in with ChatGPT' })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sign in with ChatGPT' }))
    })

    expect(shellOpenMock).toHaveBeenCalledWith(authorizeUrl)
    expect(consoleErrorSpy).toHaveBeenCalledWith('[ChatGPTOfficialLogin] shellOpen failed:', expect.any(Error))
    expect(screen.getByText(/Unable to open browser/)).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy authorization link' }))
    })

    expect(copyTextToClipboardMock).toHaveBeenCalledWith(authorizeUrl)
    expect(useHuboOpenAIOAuthStore.getState().error).toBeNull()
    expect(useHuboOpenAIOAuthStore.getState().isPolling).toBe(true)
    expect(screen.queryByText(/Unable to open browser/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copy authorization link' })).not.toBeInTheDocument()
  })

  it('keeps the authorization link available when copy fails', async () => {
    const authorizeUrl = 'https://chatgpt.com/oauth/authorize?state=openai-state'
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
    expect(useHuboOpenAIOAuthStore.getState().isPolling).toBe(false)
    expect(screen.getByText(/Unable to copy authorization link/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy authorization link' })).toBeInTheDocument()
  })
})

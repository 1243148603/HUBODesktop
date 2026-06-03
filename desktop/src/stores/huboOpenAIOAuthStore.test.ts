import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { startMock, statusMock, logoutMock } = vi.hoisted(() => ({
  startMock: vi.fn(),
  statusMock: vi.fn(),
  logoutMock: vi.fn(),
}))

vi.mock('../api/huboOpenAIOAuth', () => ({
  huboOpenAIOAuthApi: {
    start: startMock,
    status: statusMock,
    logout: logoutMock,
  },
}))

import { useHuboOpenAIOAuthStore } from './huboOpenAIOAuthStore'

const initialState = useHuboOpenAIOAuthStore.getState()

describe('huboOpenAIOAuthStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    startMock.mockReset()
    statusMock.mockReset()
    logoutMock.mockReset()
    useHuboOpenAIOAuthStore.setState({
      ...initialState,
      status: null,
      isPolling: false,
      isLoading: false,
      error: null,
    })
  })

  afterEach(() => {
    useHuboOpenAIOAuthStore.getState().stopPolling()
    useHuboOpenAIOAuthStore.setState(initialState)
    vi.useRealTimers()
  })

  it('login returns authorizeUrl without starting polling', async () => {
    startMock.mockResolvedValue({
      authorizeUrl: 'http://localhost:3456/callback/openai?state=openai-state',
      state: 'openai-state',
    })

    const result = await useHuboOpenAIOAuthStore.getState().login()

    expect(result.authorizeUrl).toContain('/callback/openai')
    expect(useHuboOpenAIOAuthStore.getState().isPolling).toBe(false)
  })

  it('startPolling stops after OpenAI OAuth status becomes logged in', async () => {
    statusMock
      .mockResolvedValueOnce({ loggedIn: false })
      .mockResolvedValueOnce({
        loggedIn: true,
        expiresAt: Date.now() + 60_000,
        email: 'user@example.com',
        accountId: 'acct_123',
      })

    useHuboOpenAIOAuthStore.getState().startPolling()
    expect(useHuboOpenAIOAuthStore.getState().isPolling).toBe(true)

    await vi.advanceTimersByTimeAsync(2_000)
    expect(useHuboOpenAIOAuthStore.getState().isPolling).toBe(true)

    await vi.advanceTimersByTimeAsync(2_000)
    expect(useHuboOpenAIOAuthStore.getState().status).toMatchObject({
      loggedIn: true,
      email: 'user@example.com',
      accountId: 'acct_123',
    })
    expect(useHuboOpenAIOAuthStore.getState().isPolling).toBe(false)
  })

  it('logout clears status and stops polling', async () => {
    logoutMock.mockResolvedValue({ ok: true })
    useHuboOpenAIOAuthStore.setState({
      status: {
        loggedIn: true,
        expiresAt: Date.now() + 60_000,
        email: 'user@example.com',
        accountId: 'acct_123',
      },
    })
    useHuboOpenAIOAuthStore.getState().startPolling()

    await useHuboOpenAIOAuthStore.getState().logout()

    expect(logoutMock).toHaveBeenCalledTimes(1)
    expect(useHuboOpenAIOAuthStore.getState().status).toEqual({ loggedIn: false })
    expect(useHuboOpenAIOAuthStore.getState().isPolling).toBe(false)
  })
})

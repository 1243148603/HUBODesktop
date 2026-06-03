import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { startMock, statusMock, logoutMock } = vi.hoisted(() => ({
  startMock: vi.fn(),
  statusMock: vi.fn(),
  logoutMock: vi.fn(),
}))

vi.mock('../api/huboOAuth', () => ({
  huboOAuthApi: {
    start: startMock,
    status: statusMock,
    logout: logoutMock,
  },
}))

import { useHuboOAuthStore } from './huboOAuthStore'

const initialState = useHuboOAuthStore.getState()

describe('huboOAuthStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    startMock.mockReset()
    statusMock.mockReset()
    logoutMock.mockReset()
    useHuboOAuthStore.setState({
      ...initialState,
      status: null,
      isPolling: false,
      isLoading: false,
      error: null,
    })
  })

  afterEach(() => {
    useHuboOAuthStore.getState().stopPolling()
    useHuboOAuthStore.setState(initialState)
    vi.useRealTimers()
  })

  it('login does not start polling until the browser launch succeeds', async () => {
    startMock.mockResolvedValue({
      authorizeUrl: 'http://localhost:3456/api/hubo-oauth/callback',
      state: 'state-123',
    })

    const result = await useHuboOAuthStore.getState().login()

    expect(result.authorizeUrl).toContain('/api/hubo-oauth/callback')
    expect(useHuboOAuthStore.getState().isPolling).toBe(false)
  })

  it('startPolling stops after the status becomes logged in', async () => {
    statusMock
      .mockResolvedValueOnce({ loggedIn: false })
      .mockResolvedValueOnce({
        loggedIn: true,
        expiresAt: Date.now() + 60_000,
        scopes: ['user:inference'],
        subscriptionType: 'max',
      })

    useHuboOAuthStore.getState().startPolling()
    expect(useHuboOAuthStore.getState().isPolling).toBe(true)

    await vi.advanceTimersByTimeAsync(2_000)
    expect(useHuboOAuthStore.getState().isPolling).toBe(true)

    await vi.advanceTimersByTimeAsync(2_000)
    expect(useHuboOAuthStore.getState().status).toMatchObject({
      loggedIn: true,
      subscriptionType: 'max',
    })
    expect(useHuboOAuthStore.getState().isPolling).toBe(false)
  })
})

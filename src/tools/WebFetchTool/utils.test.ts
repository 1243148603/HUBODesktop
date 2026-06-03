import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { shouldSkipWebFetchPreflight } from './utils.js'

describe('shouldSkipWebFetchPreflight', () => {
<<<<<<< HEAD
  const originalDesktopServerUrl = process.env.HUBO_DESKTOP_SERVER_URL

  beforeEach(() => {
    delete process.env.HUBO_DESKTOP_SERVER_URL
=======
  const originalDesktopServerUrl = process.env.CC_HAHA_DESKTOP_SERVER_URL

  beforeEach(() => {
    delete process.env.CC_HAHA_DESKTOP_SERVER_URL
>>>>>>> upstream/main
  })

  afterEach(() => {
    if (originalDesktopServerUrl === undefined) {
<<<<<<< HEAD
      delete process.env.HUBO_DESKTOP_SERVER_URL
    } else {
      process.env.HUBO_DESKTOP_SERVER_URL = originalDesktopServerUrl
=======
      delete process.env.CC_HAHA_DESKTOP_SERVER_URL
    } else {
      process.env.CC_HAHA_DESKTOP_SERVER_URL = originalDesktopServerUrl
>>>>>>> upstream/main
    }
  })

  test('respects explicit true from settings', () => {
    expect(
      shouldSkipWebFetchPreflight({ skipWebFetchPreflight: true }),
    ).toBe(true)
  })

  test('respects explicit false from settings even on desktop', () => {
<<<<<<< HEAD
    process.env.HUBO_DESKTOP_SERVER_URL = 'http://127.0.0.1:3456'
=======
    process.env.CC_HAHA_DESKTOP_SERVER_URL = 'http://127.0.0.1:3456'
>>>>>>> upstream/main

    expect(
      shouldSkipWebFetchPreflight({ skipWebFetchPreflight: false }),
    ).toBe(false)
  })

  test('defaults to enabled for desktop sessions', () => {
<<<<<<< HEAD
    process.env.HUBO_DESKTOP_SERVER_URL = 'http://127.0.0.1:3456'
=======
    process.env.CC_HAHA_DESKTOP_SERVER_URL = 'http://127.0.0.1:3456'
>>>>>>> upstream/main

    expect(shouldSkipWebFetchPreflight({})).toBe(true)
  })

  test('defaults to disabled outside desktop sessions', () => {
    expect(shouldSkipWebFetchPreflight({})).toBe(false)
  })
})

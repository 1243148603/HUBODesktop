import { beforeEach, describe, expect, test } from 'vitest'
import {
  CURRENT_DESKTOP_PERSISTENCE_SCHEMA_VERSION,
  DESKTOP_PERSISTENCE_VERSION_KEY,
  runDesktopPersistenceMigrations,
} from './persistenceMigrations'

describe('desktop persistence migrations', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('migrates legacy open-tab arrays into the current tab persistence shape', () => {
<<<<<<< HEAD
    window.localStorage.setItem('hubo-open-tabs', JSON.stringify([
=======
    window.localStorage.setItem('cc-haha-open-tabs', JSON.stringify([
>>>>>>> upstream/main
      { sessionId: 'session-1', title: 'Old tab' },
      { sessionId: '__terminal__legacy', title: 'Terminal 1', type: 'terminal' },
      { sessionId: 123, title: 'bad' },
    ]))

    const report = runDesktopPersistenceMigrations()

<<<<<<< HEAD
    expect(report.migratedKeys).toContain('hubo-open-tabs')
    expect(JSON.parse(window.localStorage.getItem('hubo-open-tabs') || '{}')).toEqual({
=======
    expect(report.migratedKeys).toContain('cc-haha-open-tabs')
    expect(JSON.parse(window.localStorage.getItem('cc-haha-open-tabs') || '{}')).toEqual({
>>>>>>> upstream/main
      openTabs: [{ sessionId: 'session-1', title: 'Old tab', type: 'session' }],
      activeTabId: 'session-1',
    })
    expect(window.localStorage.getItem(DESKTOP_PERSISTENCE_VERSION_KEY)).toBe(String(CURRENT_DESKTOP_PERSISTENCE_SCHEMA_VERSION))
  })

  test('filters stale session runtime selections without clearing unrelated keys', () => {
    window.localStorage.setItem('unrelated-user-key', 'keep')
<<<<<<< HEAD
    window.localStorage.setItem('hubo-session-runtime', JSON.stringify({
=======
    window.localStorage.setItem('cc-haha-session-runtime', JSON.stringify({
>>>>>>> upstream/main
      good: { providerId: null, modelId: 'claude-sonnet' },
      alsoGood: { providerId: 'provider-1', modelId: 'gpt-5.4' },
      bad: { providerId: 'provider-2' },
    }))

    runDesktopPersistenceMigrations()

<<<<<<< HEAD
    expect(JSON.parse(window.localStorage.getItem('hubo-session-runtime') || '{}')).toEqual({
=======
    expect(JSON.parse(window.localStorage.getItem('cc-haha-session-runtime') || '{}')).toEqual({
>>>>>>> upstream/main
      alsoGood: { providerId: 'provider-1', modelId: 'gpt-5.4' },
      good: { providerId: null, modelId: 'claude-sonnet' },
    })
    expect(window.localStorage.getItem('unrelated-user-key')).toBe('keep')
  })

  test('removes malformed known keys without throwing during startup', () => {
<<<<<<< HEAD
    window.localStorage.setItem('hubo-open-tabs', '{"openTabs":')
    window.localStorage.setItem('hubo-theme', 'sepia')

    const report = runDesktopPersistenceMigrations()

    expect(report.migratedKeys).toContain('hubo-open-tabs')
    expect(report.migratedKeys).toContain('hubo-theme')
    expect(window.localStorage.getItem('hubo-open-tabs')).toBeNull()
    expect(window.localStorage.getItem('hubo-theme')).toBeNull()
  })

  test('preserves the pure white theme as a valid persisted theme', () => {
    window.localStorage.setItem('hubo-theme', 'white')

    const report = runDesktopPersistenceMigrations()

    expect(report.migratedKeys).not.toContain('hubo-theme')
    expect(window.localStorage.getItem('hubo-theme')).toBe('white')
  })

  test('preserves valid app zoom and removes invalid app zoom values', () => {
    window.localStorage.setItem('hubo-app-zoom', '1.2')

    const validReport = runDesktopPersistenceMigrations()

    expect(validReport.migratedKeys).not.toContain('hubo-app-zoom')
    expect(window.localStorage.getItem('hubo-app-zoom')).toBe('1.2')

    window.localStorage.setItem('hubo-app-zoom', '4')

    const invalidReport = runDesktopPersistenceMigrations()

    expect(invalidReport.migratedKeys).toContain('hubo-app-zoom')
    expect(window.localStorage.getItem('hubo-app-zoom')).toBeNull()
  })

  test('migrates the legacy UI zoom key into app zoom storage', () => {
    window.localStorage.setItem('hubo-ui-zoom', '1.25')
=======
    window.localStorage.setItem('cc-haha-open-tabs', '{"openTabs":')
    window.localStorage.setItem('cc-haha-theme', 'sepia')

    const report = runDesktopPersistenceMigrations()

    expect(report.migratedKeys).toContain('cc-haha-open-tabs')
    expect(report.migratedKeys).toContain('cc-haha-theme')
    expect(window.localStorage.getItem('cc-haha-open-tabs')).toBeNull()
    expect(window.localStorage.getItem('cc-haha-theme')).toBeNull()
  })

  test('preserves the pure white theme as a valid persisted theme', () => {
    window.localStorage.setItem('cc-haha-theme', 'white')

    const report = runDesktopPersistenceMigrations()

    expect(report.migratedKeys).not.toContain('cc-haha-theme')
    expect(window.localStorage.getItem('cc-haha-theme')).toBe('white')
  })

  test('preserves valid app zoom and removes invalid app zoom values', () => {
    window.localStorage.setItem('cc-haha-app-zoom', '1.2')

    const validReport = runDesktopPersistenceMigrations()

    expect(validReport.migratedKeys).not.toContain('cc-haha-app-zoom')
    expect(window.localStorage.getItem('cc-haha-app-zoom')).toBe('1.2')

    window.localStorage.setItem('cc-haha-app-zoom', '4')

    const invalidReport = runDesktopPersistenceMigrations()

    expect(invalidReport.migratedKeys).toContain('cc-haha-app-zoom')
    expect(window.localStorage.getItem('cc-haha-app-zoom')).toBeNull()
  })

  test('migrates the legacy UI zoom key into app zoom storage', () => {
    window.localStorage.setItem('cc-haha-ui-zoom', '1.25')
>>>>>>> upstream/main

    const report = runDesktopPersistenceMigrations()

    expect(report.migratedKeys).toEqual(expect.arrayContaining([
<<<<<<< HEAD
      'hubo-app-zoom',
      'hubo-ui-zoom',
    ]))
    expect(window.localStorage.getItem('hubo-app-zoom')).toBe('1.25')
    expect(window.localStorage.getItem('hubo-ui-zoom')).toBeNull()
=======
      'cc-haha-app-zoom',
      'cc-haha-ui-zoom',
    ]))
    expect(window.localStorage.getItem('cc-haha-app-zoom')).toBe('1.25')
    expect(window.localStorage.getItem('cc-haha-ui-zoom')).toBeNull()
>>>>>>> upstream/main
  })

  test('does not throw if schema version persistence is blocked', () => {
    const storage = {
      getItem: window.localStorage.getItem.bind(window.localStorage),
      removeItem: window.localStorage.removeItem.bind(window.localStorage),
      setItem: (key: string, value: string) => {
        if (key === DESKTOP_PERSISTENCE_VERSION_KEY) {
          throw new Error('storage blocked')
        }
        window.localStorage.setItem(key, value)
      },
    }

    expect(() => runDesktopPersistenceMigrations(storage)).not.toThrow()
    expect(runDesktopPersistenceMigrations(storage).migratedKeys).toContain(DESKTOP_PERSISTENCE_VERSION_KEY)
  })

  test('does not throw if storage reads and writes are blocked', () => {
    const storage = {
      getItem: () => {
        throw new Error('storage unavailable')
      },
      removeItem: () => {
        throw new Error('storage unavailable')
      },
      setItem: () => {
        throw new Error('storage unavailable')
      },
    }

    const report = runDesktopPersistenceMigrations(storage)

    expect(report.migratedKeys).toEqual(expect.arrayContaining([
<<<<<<< HEAD
      'hubo-open-tabs',
      'hubo-session-runtime',
      'hubo-theme',
      'hubo-locale',
      'hubo-app-zoom',
=======
      'cc-haha-open-tabs',
      'cc-haha-session-runtime',
      'cc-haha-theme',
      'cc-haha-locale',
      'cc-haha-app-zoom',
>>>>>>> upstream/main
      DESKTOP_PERSISTENCE_VERSION_KEY,
    ]))
  })
})

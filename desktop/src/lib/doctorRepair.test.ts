import { beforeEach, describe, expect, it, vi } from 'vitest'

const doctorApiMock = vi.hoisted(() => ({
  reportAndRepair: vi.fn(),
}))

vi.mock('../api/doctor', () => ({
  doctorApi: doctorApiMock,
}))

import { SAFE_DOCTOR_STORAGE_KEYS, runLocalDoctorRepair, runDoctorRepair } from './doctorRepair'

describe('doctorRepair', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('clears only the safe desktop UI storage keys', () => {
    window.localStorage.clear()
    for (const key of SAFE_DOCTOR_STORAGE_KEYS) {
      window.localStorage.setItem(key, `${key}-value`)
    }
<<<<<<< HEAD
    window.localStorage.setItem('hubo-chat-history', 'preserve')
    window.localStorage.setItem('hubo-provider-config', 'preserve')
=======
    window.localStorage.setItem('cc-haha-chat-history', 'preserve')
    window.localStorage.setItem('cc-haha-provider-config', 'preserve')
>>>>>>> upstream/main

    const result = runLocalDoctorRepair(window.localStorage)

    expect(result.removedKeys).toEqual(expect.arrayContaining([...SAFE_DOCTOR_STORAGE_KEYS]))
    expect(result.failedKeys).toEqual([])
    for (const key of SAFE_DOCTOR_STORAGE_KEYS) {
      expect(window.localStorage.getItem(key)).toBeNull()
    }
<<<<<<< HEAD
    expect(window.localStorage.getItem('hubo-chat-history')).toBe('preserve')
    expect(window.localStorage.getItem('hubo-provider-config')).toBe('preserve')
=======
    expect(window.localStorage.getItem('cc-haha-chat-history')).toBe('preserve')
    expect(window.localStorage.getItem('cc-haha-provider-config')).toBe('preserve')
>>>>>>> upstream/main
  })

  it('keeps local repair non-throwing when storage access is blocked', () => {
    const storage = {
      getItem: () => {
        throw new Error('storage unavailable')
      },
      removeItem: () => {
        throw new Error('storage unavailable')
      },
    }

    const result = runLocalDoctorRepair(storage)

    expect(result.removedKeys).toEqual([])
    expect(result.failedKeys).toEqual(expect.arrayContaining([...SAFE_DOCTOR_STORAGE_KEYS]))
  })

  it('keeps local repair successful when the server doctor endpoint is unavailable', async () => {
    window.localStorage.clear()
<<<<<<< HEAD
    window.localStorage.setItem('hubo-theme', 'dark')
=======
    window.localStorage.setItem('cc-haha-theme', 'dark')
>>>>>>> upstream/main
    doctorApiMock.reportAndRepair.mockRejectedValueOnce(new Error('Failed to fetch'))

    const result = await runDoctorRepair({ storage: window.localStorage })

    expect(doctorApiMock.reportAndRepair).toHaveBeenCalled()
<<<<<<< HEAD
    expect(result.local.removedKeys).toContain('hubo-theme')
=======
    expect(result.local.removedKeys).toContain('cc-haha-theme')
>>>>>>> upstream/main
    expect(result.server).toBeNull()
    expect(result.serverError).toBe('Failed to fetch')
  })
})

import { afterEach, describe, expect, test } from 'bun:test'
import { rm, writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { isUsableBuiltinRipgrepPath } from '../ripgrep.js'

const tempFiles: string[] = []

afterEach(async () => {
  await Promise.all(tempFiles.splice(0).map(path => rm(path, { force: true })))
})

describe('isUsableBuiltinRipgrepPath', () => {
  test('rejects Bun virtual filesystem paths', () => {
    expect(
      isUsableBuiltinRipgrepPath('B:\\~BUN\\root\\vendor\\ripgrep\\x64-win32\\rg.exe'),
    ).toBe(false)
    expect(
      isUsableBuiltinRipgrepPath('/$bunfs/root/vendor/ripgrep/arm64-darwin/rg'),
    ).toBe(false)
  })

  test('rejects missing paths', () => {
    expect(
<<<<<<< HEAD
      isUsableBuiltinRipgrepPath(join(tmpdir(), 'missing-hubo-rg')),
=======
      isUsableBuiltinRipgrepPath(join(tmpdir(), 'missing-cc-haha-rg')),
>>>>>>> upstream/main
    ).toBe(false)
  })

  test('accepts real filesystem paths', async () => {
<<<<<<< HEAD
    const filePath = join(tmpdir(), `hubo-rg-${Date.now()}`)
=======
    const filePath = join(tmpdir(), `cc-haha-rg-${Date.now()}`)
>>>>>>> upstream/main
    await writeFile(filePath, '')
    tempFiles.push(filePath)

    expect(isUsableBuiltinRipgrepPath(filePath)).toBe(true)
  })
})

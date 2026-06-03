import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const html = readFileSync(join(__dirname, 'index.html'), 'utf-8')

describe('desktop index startup diagnostics', () => {
  it('installs a non-module startup watchdog before the app module loads', () => {
<<<<<<< HEAD
    const watchdogIndex = html.indexOf('__HUBO_SHOW_STARTUP_ERROR__')
=======
    const watchdogIndex = html.indexOf('__CC_HAHA_SHOW_STARTUP_ERROR__')
>>>>>>> upstream/main
    const moduleIndex = html.indexOf('type="module"')

    expect(watchdogIndex).toBeGreaterThan(0)
    expect(moduleIndex).toBeGreaterThan(watchdogIndex)
<<<<<<< HEAD
    expect(html).toContain('__HUBO_BOOTSTRAPPED__')
=======
    expect(html).toContain('__CC_HAHA_BOOTSTRAPPED__')
>>>>>>> upstream/main
    expect(html).toContain('Desktop startup failed')
  })

  it('diagnoses module resource failures and boot timeouts outside React', () => {
    expect(html).toContain('Startup resource failed to load:')
    expect(html).toContain('Desktop app did not finish bootstrapping within')
  })
})

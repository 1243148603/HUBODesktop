import { baselineCases } from './baseline/cases'
import type { BaselineTarget, LaneDefinition, QualityGateMode } from './types'

<<<<<<< HEAD
export function lanesForMode(mode: QualityGateMode, baselineTargets: BaselineTarget[] = []): LaneDefinition[] {
=======
export function currentPackageSmokePlatform(platform: NodeJS.Platform = process.platform) {
  if (platform === 'darwin') return 'macos'
  if (platform === 'win32') return 'windows'
  if (platform === 'linux') return 'linux'
  return null
}

export function currentReleaseArtifactsDir(
  platform: NodeJS.Platform = process.platform,
  arch: NodeJS.Architecture = process.arch,
) {
  if (platform === 'darwin') return arch === 'x64' ? 'desktop/build-artifacts/macos-x64' : 'desktop/build-artifacts/macos-arm64'
  if (platform === 'win32') return arch === 'arm64' ? 'desktop/build-artifacts/windows-arm64' : 'desktop/build-artifacts/windows-x64'
  if (platform === 'linux') return arch === 'arm64' ? 'desktop/build-artifacts/linux-arm64' : 'desktop/build-artifacts/linux-x64'
  return null
}

export function lanesForMode(mode: QualityGateMode, baselineTargets: BaselineTarget[] = []): LaneDefinition[] {
  const packageSmokePlatform = currentPackageSmokePlatform()
  const releaseArtifactsDir = currentReleaseArtifactsDir()
>>>>>>> upstream/main
  const lanes: LaneDefinition[] = [
    {
      id: 'impact-report',
      title: 'Impact report',
      description: 'Summarize changed areas, required local checks, and risk notes.',
      kind: 'command',
      command: ['bun', 'run', 'check:impact'],
      requiredForModes: ['pr', 'baseline', 'release'],
      category: 'scope',
    },
    {
      id: 'policy-checks',
      title: 'Policy checks',
      description: 'Run policy, workflow, hook, quarantine, and gate unit tests when any PR quality policy applies.',
      kind: 'command',
      command: ['bun', 'run', 'check:policy'],
      impactRequiredCheck: 'bun run check:policy',
      requiredForModes: ['pr', 'release'],
      category: 'governance',
    },
    {
      id: 'desktop-checks',
      title: 'Desktop checks',
      description: 'Run desktop lint, Vitest, and production build when desktop paths changed.',
      kind: 'command',
      command: ['bun', 'run', 'check:desktop'],
      impactRequiredCheck: 'bun run check:desktop',
<<<<<<< HEAD
      requiredForModes: ['pr'],
=======
      requiredForModes: ['pr', 'release'],
>>>>>>> upstream/main
      category: 'unit',
    },
    {
      id: 'server-checks',
      title: 'Server checks',
      description: 'Run server, provider, runtime, MCP, OAuth, WebSocket, and API tests when server paths changed.',
      kind: 'command',
      command: ['bun', 'run', 'check:server'],
      impactRequiredCheck: 'bun run check:server',
<<<<<<< HEAD
      requiredForModes: ['pr'],
=======
      requiredForModes: ['pr', 'release'],
>>>>>>> upstream/main
      category: 'unit',
    },
    {
      id: 'adapter-checks',
      title: 'Adapter checks',
      description: 'Run adapter tests when IM adapter paths changed.',
      kind: 'command',
      command: ['bun', 'run', 'check:adapters'],
      impactRequiredCheck: 'bun run check:adapters',
<<<<<<< HEAD
      requiredForModes: ['pr'],
=======
      requiredForModes: ['pr', 'release'],
>>>>>>> upstream/main
      category: 'unit',
    },
    {
      id: 'native-checks',
      title: 'Native desktop checks',
<<<<<<< HEAD
      description: 'Build sidecars and run the Tauri native compile check when native or packaging paths changed.',
=======
      description: 'Build sidecars and run Electron main/preload checks when native or packaging paths changed.',
>>>>>>> upstream/main
      kind: 'command',
      command: ['bun', 'run', 'check:native'],
      impactRequiredCheck: 'bun run check:native',
      requiredForModes: ['pr', 'release'],
      category: 'native',
    },
    {
      id: 'docs-checks',
      title: 'Docs checks',
      description: 'Run docs install and VitePress build when docs paths changed.',
      kind: 'command',
      command: ['bun', 'run', 'check:docs'],
      impactRequiredCheck: 'bun run check:docs',
<<<<<<< HEAD
      requiredForModes: ['pr'],
=======
      requiredForModes: ['pr', 'release'],
>>>>>>> upstream/main
      category: 'docs',
    },
    {
      id: 'persistence-upgrade',
      title: 'Persistence upgrade checks',
      description: 'Validate local JSON and desktop localStorage migrations against old-version fixtures.',
      kind: 'command',
      command: ['bun', 'run', 'check:persistence-upgrade'],
      requiredForModes: ['pr', 'release'],
      category: 'governance',
    },
    {
      id: 'quarantine',
      title: 'Quarantine governance',
      description: 'Validate quarantined tests still have owners, exit criteria, and active review windows.',
      kind: 'command',
      command: ['bun', 'run', 'check:quarantine'],
      requiredForModes: ['pr', 'baseline', 'release'],
      category: 'governance',
    },
    {
      id: 'coverage',
      title: 'Coverage gate',
      description: 'Run unit/component coverage suites and enforce the ratcheted coverage baseline.',
      kind: 'command',
      command: ['bun', 'run', 'check:coverage'],
      requiredForModes: ['pr', 'baseline', 'release'],
      category: 'coverage',
    },
    {
      id: 'baseline-catalog',
      title: 'Baseline case catalog validation',
      description: 'Validate real Coding Agent baseline case definitions and fixture metadata.',
      kind: 'command',
      command: ['bun', 'test', 'scripts/quality-gate/baseline/cases.test.ts'],
      requiredForModes: ['baseline', 'release'],
      category: 'unit',
    },
  ]

<<<<<<< HEAD
=======
  if (packageSmokePlatform && releaseArtifactsDir) {
    const packageSmokeCommand = ['bun', 'run', 'test:package-smoke', '--platform', packageSmokePlatform, '--package-kind', 'release', '--artifacts-dir', releaseArtifactsDir]
    if (packageSmokePlatform === 'macos') {
      packageSmokeCommand.push('--require-macos-gatekeeper')
    }

    lanes.push({
      id: `desktop-package-smoke:${packageSmokePlatform}`,
      title: `Desktop packaged artifact smoke (${packageSmokePlatform})`,
      description: 'Inspect the current-platform canonical Electron release artifact for app metadata, app.asar, sidecar binaries, update metadata, and unpacked native runtime resources. GUI behavior is verified separately with Computer Use against the real packaged app.',
      kind: 'command',
      command: packageSmokeCommand,
      requiredForModes: ['release'],
      category: 'smoke',
    })
  }

>>>>>>> upstream/main
  const targets = baselineTargets.length > 0
    ? baselineTargets
    : [{ providerId: null, modelId: 'current', label: 'current-runtime' }]

  for (const testCase of baselineCases) {
    for (const target of targets) {
      const targetSlug = target.label.replace(/[^a-zA-Z0-9._-]+/g, '-')
      lanes.push({
        id: `baseline:${testCase.id}:${targetSlug}`,
        title: `${testCase.title} (${target.label})`,
        description: testCase.description,
        kind: 'baseline-case',
        baselineCaseId: testCase.id,
        baselineTarget: target,
        requiredForModes: ['baseline', 'release'],
        category: 'integration',
        live: true,
      })
    }
  }

  for (const target of targets) {
    const targetSlug = target.label.replace(/[^a-zA-Z0-9._-]+/g, '-')
    lanes.push({
      id: `provider-smoke:${targetSlug}`,
      title: `Provider live/proxy smoke (${target.label})`,
      description: 'Validate live provider connectivity. Saved or active OpenAI-compatible providers also exercise the local non-stream and streaming proxy endpoints; env-only targets validate upstream connectivity and transform pipeline.',
      kind: 'provider-smoke',
      baselineTarget: target,
      requiredForModes: ['baseline', 'release'],
      category: 'smoke',
      live: true,
    })
  }

  for (const target of targets) {
    const targetSlug = target.label.replace(/[^a-zA-Z0-9._-]+/g, '-')
    lanes.push({
      id: `desktop-smoke:agent-browser-chat:${targetSlug}`,
      title: `Desktop agent-browser chat smoke (${target.label})`,
<<<<<<< HEAD
      description: 'Open the desktop web app with agent-browser, send a real chat task, and verify the model edits a fixture project through the UI.',
      kind: 'desktop-smoke',
      baselineTarget: target,
      requiredForModes: ['baseline', 'release'],
=======
      description: 'Open the desktop web app with agent-browser, send a real chat task, and verify the model edits a fixture project through the UI. This remains a browser/web-app confidence lane; Electron packaged-app acceptance is covered by package-smoke plus manual Computer Use evidence.',
      kind: 'desktop-smoke',
      baselineTarget: target,
      requiredForModes: ['baseline'],
>>>>>>> upstream/main
      category: 'smoke',
      live: true,
    })
  }

  return lanes.filter((lane) => lane.requiredForModes.includes(mode))
}

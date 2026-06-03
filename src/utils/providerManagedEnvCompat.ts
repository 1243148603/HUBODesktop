const DEEPSEEK_THINKING_CAPABILITIES = 'thinking,effort,adaptive_thinking,max_effort'

const DEEPSEEK_CAPABILITY_ENV_KEYS = [
  'ANTHROPIC_DEFAULT_HAIKU_MODEL_SUPPORTED_CAPABILITIES',
  'ANTHROPIC_DEFAULT_SONNET_MODEL_SUPPORTED_CAPABILITIES',
  'ANTHROPIC_DEFAULT_OPUS_MODEL_SUPPORTED_CAPABILITIES',
] as const

function looksLikeDeepSeekManagedEnv(env: Record<string, string>): boolean {
  const baseUrl = env.ANTHROPIC_BASE_URL ?? ''
  const modelIds = [
    env.ANTHROPIC_MODEL,
    env.ANTHROPIC_DEFAULT_HAIKU_MODEL,
    env.ANTHROPIC_DEFAULT_SONNET_MODEL,
    env.ANTHROPIC_DEFAULT_OPUS_MODEL,
  ].filter(Boolean)

  return (
    baseUrl.includes('api.deepseek.com') ||
    modelIds.some((model) => /^deepseek[-_]/i.test(model ?? ''))
  )
}

export function normalizeLegacyDeepSeekManagedEnv(
  env: Record<string, string>,
): { env: Record<string, string>; changed: boolean } {
<<<<<<< HEAD
  if (!env.HUBO_SEND_DISABLED_THINKING || !looksLikeDeepSeekManagedEnv(env)) {
=======
  if (!env.CC_HAHA_SEND_DISABLED_THINKING || !looksLikeDeepSeekManagedEnv(env)) {
>>>>>>> upstream/main
    return { env, changed: false }
  }

  const next = { ...env }
<<<<<<< HEAD
  delete next.HUBO_SEND_DISABLED_THINKING
=======
  delete next.CC_HAHA_SEND_DISABLED_THINKING
>>>>>>> upstream/main

  for (const key of DEEPSEEK_CAPABILITY_ENV_KEYS) {
    next[key] = DEEPSEEK_THINKING_CAPABILITIES
  }

  return { env: next, changed: true }
}

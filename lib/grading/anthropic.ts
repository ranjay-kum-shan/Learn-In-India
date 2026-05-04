import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { env, isAnthropicConfigured } from '@/lib/env'

let _client: Anthropic | null = null

export function getAnthropicClient() {
  if (!isAnthropicConfigured) {
    throw new Error('Anthropic is not configured. Set ANTHROPIC_API_KEY.')
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY! })
  }
  return _client
}

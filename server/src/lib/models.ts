export interface ModelDef {
  id: string;
  name: string;
  provider: string;
  description: string;
}

// All models below work via OpenRouter (OpenAI-compatible).
export const MODELS: ModelDef[] = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI', description: 'Fast and affordable' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Most capable OpenAI' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Excellent for writing and reasoning' },
  { id: 'x-ai/grok-beta', name: 'Grok', provider: 'xAI', description: 'Conversational, current-events aware' },
  { id: 'google/gemini-flash-1.5', name: 'Gemini 1.5 Flash', provider: 'Google', description: 'Fast and cheap' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'Meta', description: 'Open source' },
];

export const DEFAULT_MODEL_ID = process.env.DEFAULT_MODEL_ID || 'openai/gpt-4o-mini';

export function getModel(id: string): ModelDef | undefined {
  return MODELS.find((m) => m.id === id);
}

export function getConsensusModels(): string[] {
  const env = process.env.CONSENSUS_MODELS;
  if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
  return ['openai/gpt-4o-mini', 'anthropic/claude-3.5-sonnet', 'google/gemini-flash-1.5'];
}

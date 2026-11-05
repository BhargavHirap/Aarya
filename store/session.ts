import { create } from 'zustand';
import type { Language, Message } from '../lib/types';

interface SessionState {
  language: Language;
  modelId: string;
  consensusMode: boolean;
  messages: Message[];
  historyEnabled: boolean;
  setLanguage: (l: Language) => void;
  setModelId: (id: string) => void;
  toggleConsensus: () => void;
  addMessage: (m: Message) => void;
  updateMessage: (id: string, patch: Partial<Message>) => void;
  clear: () => void;
}

export const useSession = create<SessionState>((set) => ({
  language: 'mr',
  modelId: 'openai/gpt-4o-mini',
  consensusMode: false,
  messages: [],
  historyEnabled: false,
  setLanguage: (language) => set({ language }),
  setModelId: (modelId) => set({ modelId }),
  toggleConsensus: () => set((s) => ({ consensusMode: !s.consensusMode })),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  updateMessage: (id, patch) =>
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
  clear: () => set({ messages: [] }),
}));

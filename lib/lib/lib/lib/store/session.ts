import { create } from 'zustand';
import type { Language, Message } from '../lib/types';

interface SessionState {
  language: Language;
  messages: Message[];
  historyEnabled: boolean;
  setLanguage: (l: Language) => void;
  addMessage: (m: Message) => void;
  updateMessage: (id: string, patch: Partial<Message>) => void;
  clear: () => void;
}

// Session-only memory. No AsyncStorage in v1 — history is not persisted.
export const useSession = create<SessionState>((set) => ({
  language: 'mr',
  messages: [],
  historyEnabled: false,
  setLanguage: (language) => set({ language }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  updateMessage: (id, patch) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),
  clear: () => set({ messages: [] }),
}));

import { useCallback, useState } from 'react';
import { sendChat } from '../lib/api';
import { useSession } from '../store/session';
import type { Message } from '../lib/types';

const MAX_HISTORY = 12;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChat() {
  const { messages, language, addMessage, updateMessage, clear } = useSession();
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      const userMsg: Message = {
        id: uid(),
        role: 'user',
        content: trimmed,
        createdAt: Date.now(),
        status: 'sending',
      };
      addMessage(userMsg);
      setIsThinking(true);
      setError(null);

      try {
        const history = messages.slice(-MAX_HISTORY);
        const res = await sendChat({ message: trimmed, language, history });
        updateMessage(userMsg.id, { status: 'sent' });
        addMessage({
          id: uid(),
          role: 'assistant',
          content: res.reply,
          createdAt: Date.now(),
        });
        setLastFailedText(null);
      } catch (e: any) {
        updateMessage(userMsg.id, { status: 'failed' });
        setError(e?.message || 'Failed');
        setLastFailedText(trimmed);
      } finally {
        setIsThinking(false);
      }
    },
    [addMessage, isThinking, language, messages, updateMessage]
  );

  const retry = useCallback(async () => {
    if (lastFailedText) await send(lastFailedText);
  }, [lastFailedText, send]);

  const clearChat = useCallback(() => {
    clear();
    setError(null);
    setLastFailedText(null);
  }, [clear]);

  return { messages, isThinking, error, send, retry, clearChat };
}

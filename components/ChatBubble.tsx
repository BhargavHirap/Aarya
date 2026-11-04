import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';
import { strings } from '../lib/i18n';
import type { Message, Language } from '../lib/types';

function sanitize(text: string) {
  return text.replace(/<\/?script[^>]*>/gi, '');
}

interface Props {
  message: Message;
  language: Language;
  ttsAvailable: boolean;
  onReadAloud?: (text: string) => void;
  onRetry?: () => void;
}

export function ChatBubble({
  message,
  language,
  ttsAvailable,
  onReadAloud,
  onRetry,
}: Props) {
  const isUser = message.role === 'user';
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.row, isUser ? styles.rowRight : styles.rowLeft]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {sanitize(message.content)}
        </Text>
        <Text style={[styles.time, isUser ? styles.userTime : styles.assistantTime]}>
          {time}
        </Text>

        {!isUser && ttsAvailable && onReadAloud && (
          <Pressable onPress={() => onReadAloud(message.content)} style={styles.actionBtn}>
            <Text style={styles.actionText}>🔊 {strings[language].readAloud}</Text>
          </Pressable>
        )}
        {isUser && message.status === 'failed' && onRetry && (
          <Pressable onPress={onRetry} style={styles.actionBtn}>
            <Text style={[styles.actionText, { color: theme.colors.danger }]}>
              ↻ {strings[language].retry}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginVertical: 6, paddingHorizontal: theme.spacing.md, flexDirection: 'row' },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '82%', padding: 12, borderRadius: theme.radii.lg },
  userBubble: { backgroundColor: theme.colors.teal, borderBottomRightRadius: 6 },
  assistantBubble: {
    backgroundColor: theme.colors.card,
    borderBottomLeftRadius: 6,
    ...theme.shadow,
  },
  text: { fontSize: 16, lineHeight: 24 },
  userText: { color: '#FFFFFF' },
  assistantText: { color: theme.colors.text },
  time: { fontSize: 11, marginTop: 6 },
  userTime: { color: '#E6F2F1', textAlign: 'right' },
  assistantTime: { color: theme.colors.muted },
  actionBtn: { marginTop: 8, paddingVertical: 4 },
  actionText: { color: theme.colors.teal, fontSize: 13, fontWeight: '600' },
});

import React, { useEffect, useRef } from 'react';
import { View, FlatList, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useChat } from '../../hooks/useChat';
import { useVoice } from '../../hooks/useVoice';
import { useSession } from '../../store/session';
import { strings } from '../../lib/i18n';
import { theme } from '../../lib/theme';
import { ChatBubble } from '../../components/ChatBubble';
import { ThinkingBubble } from '../../components/ThinkingBubble';
import { ChatInput } from '../../components/ChatInput';
import { EmptyState } from '../../components/EmptyState';
import { LanguageSwitch } from '../../components/LanguageSwitch';
import { Disclaimer } from '../../components/Disclaimer';
import type { Message } from '../../lib/types';

export default function AskScreen() {
  const language = useSession((s) => s.language);
  const setLanguage = useSession((s) => s.setLanguage);
  const { messages, isThinking, error, send, retry, clearChat } = useChat();
  const { speak, ttsAvailable, startListening, isListening, sttAvailable } = useVoice();
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (messages.length) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isThinking]);

  const onMic = () => {
    if (!sttAvailable) {
      Alert.alert('Voice', strings[language].micUnavailable);
      return;
    }
    startListening();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>आ</Text>
          </View>
          <Text style={styles.appName}>{strings[language].appName}</Text>
        </View>
        <LanguageSwitch value={language} onChange={setLanguage} />
      </View>

      {messages.length === 0 ? (
        <EmptyState language={language} onPromptSelect={send} />
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              language={language}
              ttsAvailable={ttsAvailable}
              onReadAloud={(t) => speak(t, language)}
              onRetry={retry}
            />
          )}
          ListFooterComponent={isThinking ? <ThinkingBubble language={language} /> : null}
          contentContainerStyle={{ paddingVertical: theme.spacing.sm }}
        />
      )}

      {error && (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>{strings[language].errorNetwork}</Text>
          <Pressable onPress={retry} style={styles.retryBtn}>
            <Text style={styles.retryText}>{strings[language].retry}</Text>
          </Pressable>
        </View>
      )}

      {messages.length === 0 && (
        <View style={styles.shortcutRow}>
          <Pressable style={styles.shortcut} onPress={() => router.push('/schemes')}>
            <Text style={styles.shortcutText}>📄 {strings[language]['tabs.schemes']}</Text>
          </Pressable>
          <Pressable style={styles.shortcut} onPress={() => router.push('/eligibility')}>
            <Text style={styles.shortcutText}>✅ {strings[language]['tabs.eligibility']}</Text>
          </Pressable>
        </View>
      )}

      <ChatInput
        language={language}
        onSend={send}
        onMic={onMic}
        onClear={clearChat}
        disabled={isThinking}
        isListening={isListening}
        micAvailable={sttAvailable}
      />
      <Disclaimer language={language} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.saffron,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  appName: { color: theme.colors.text, fontSize: 20, fontWeight: '700' },
  errorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDE7E7',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  errorText: { color: theme.colors.danger, fontSize: 13, flex: 1, marginRight: 8 },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.teal,
    borderRadius: theme.radii.pill,
  },
  retryText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  shortcutRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  shortcut: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  shortcutText: { color: theme.colors.text, fontSize: 13, fontWeight: '600' },
});

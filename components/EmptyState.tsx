import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';
import { strings } from '../lib/i18n';
import { QuickPrompts } from './QuickPrompts';
import type { Language } from '../lib/types';

export function EmptyState({
  language,
  onPromptSelect,
}: {
  language: Language;
  onPromptSelect: (t: string) => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>आ</Text>
      </View>
      <Text style={styles.title}>{strings[language].appName}</Text>
      <Text style={styles.subtitle}>{strings[language].emptyTitle}</Text>
      <Text style={styles.welcome}>{strings[language].welcome}</Text>
      <View style={{ height: 16 }} />
      <QuickPrompts language={language} onSelect={onPromptSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', paddingTop: 32 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.saffron,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#FFFFFF', fontSize: 32, fontWeight: '700' },
  title: { ...theme.typography.title, color: theme.colors.text },
  subtitle: { color: theme.colors.teal, marginTop: 4, fontSize: 15, fontWeight: '600' },
  welcome: {
    color: theme.colors.text,
    opacity: 0.85,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
    fontSize: 15,
    lineHeight: 24,
  },
});

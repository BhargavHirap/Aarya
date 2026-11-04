import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';
import { quickPromptsMr, quickPromptsEn } from '../lib/i18n';
import type { Language } from '../lib/types';

export function QuickPrompts({
  language,
  onSelect,
}: {
  language: Language;
  onSelect: (t: string) => void;
}) {
  const prompts = language === 'mr' ? quickPromptsMr : quickPromptsEn;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {prompts.map((p) => (
        <Pressable key={p} onPress={() => onSelect(p)} style={styles.chip}>
          <Text style={styles.text} numberOfLines={2}>
            {p}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.teal,
    maxWidth: 260,
    marginRight: 8,
  },
  text: { color: theme.colors.text, fontSize: 13 },
});

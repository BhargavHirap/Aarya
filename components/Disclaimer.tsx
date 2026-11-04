import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';
import { finalDisclaimer } from '../lib/i18n';
import type { Language } from '../lib/types';

export function Disclaimer({
  language,
  variant = 'footer',
}: {
  language: Language;
  variant?: 'footer' | 'inline';
}) {
  return (
    <View style={[styles.wrap, variant === 'inline' && styles.inline]}>
      <Text style={styles.text}>{finalDisclaimer[language]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inline: { borderTopWidth: 0 },
  text: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
});

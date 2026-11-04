import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';
import type { Language } from '../lib/types';

export function LanguageSwitch({
  value,
  onChange,
}: {
  value: Language;
  onChange: (l: Language) => void;
}) {
  return (
    <View style={styles.wrap}>
      {(['mr', 'en'] as Language[]).map((lng) => {
        const active = value === lng;
        return (
          <Pressable
            key={lng}
            onPress={() => onChange(lng)}
            style={[styles.seg, active && styles.activeSeg]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {lng === 'mr' ? 'मराठी' : 'English'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  seg: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: theme.radii.pill },
  activeSeg: { backgroundColor: theme.colors.teal },
  text: { color: theme.colors.text, fontSize: 13, fontWeight: '600' },
  activeText: { color: '#FFFFFF' },
});

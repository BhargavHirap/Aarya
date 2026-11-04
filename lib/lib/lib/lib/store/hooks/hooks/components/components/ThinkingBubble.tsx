import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';
import { strings } from '../lib/i18n';
import type { Language } from '../lib/types';

export function ThinkingBubble({ language }: { language: Language }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        <Animated.Text style={[styles.text, { opacity }]}>
          {strings[language].thinking}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 6,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: theme.radii.lg,
    borderBottomLeftRadius: 6,
    backgroundColor: theme.colors.card,
    ...theme.shadow,
  },
  text: { color: theme.colors.muted, fontSize: 15 },
});

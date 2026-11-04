import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { theme } from '../lib/theme';
import { strings } from '../lib/i18n';
import type { Language } from '../lib/types';

interface Props {
  language: Language;
  onSend: (text: string) => void;
  onMic: () => void;
  onClear: () => void;
  disabled: boolean;
  isListening: boolean;
  micAvailable: boolean;
}

export function ChatInput({
  language,
  onSend,
  onMic,
  onClear,
  disabled,
  isListening,
  micAvailable,
}: Props) {
  const [text, setText] = useState('');

  const submit = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText('');
  };

  const tooLong = text.length > 1800;

  return (
    <View style={styles.wrap}>
      <View style={styles.inputRow}>
        <Pressable
          onPress={onMic}
          style={[
            styles.micBtn,
            isListening && { backgroundColor: theme.colors.saffron },
            !micAvailable && { opacity: 0.6 },
          ]}
          accessibilityLabel="Microphone"
        >
          <Text style={styles.micIcon}>🎤</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={strings[language].placeholder}
          placeholderTextColor={theme.colors.muted}
          multiline
          maxLength={2000}
          editable={!disabled}
        />
        <Pressable
          onPress={submit}
          disabled={disabled || text.trim().length === 0 || tooLong}
          style={[
            styles.sendBtn,
            (disabled || text.trim().length === 0 || tooLong) && { opacity: 0.5 },
          ]}
          accessibilityLabel="Send"
        >
          <Text style={styles.sendText}>➤</Text>
        </Pressable>
      </View>
      <View style={styles.footerRow}>
        {tooLong && <Text style={styles.warn}>{strings[language].errorTooLong}</Text>}
        <Pressable
          onPress={() =>
            Alert.alert(strings[language].clearChat, strings[language].clearConfirm, [
              { text: 'Cancel', style: 'cancel' },
              {
                text: strings[language].clearChat,
                style: 'destructive',
                onPress: onClear,
              },
            ])
          }
        >
          <Text style={styles.clearText}>🗑 {strings[language].clearChat}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.saffron,
    marginRight: 8,
  },
  micIcon: { fontSize: 18 },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.saffron,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  warn: { color: theme.colors.danger, fontSize: 12 },
  clearText: { color: theme.colors.muted, fontSize: 12 },
});

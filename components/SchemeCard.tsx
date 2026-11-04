import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { theme } from '../lib/theme';
import { strings } from '../lib/i18n';
import type { Language, Scheme } from '../lib/types';

export function SchemeCard({ scheme, language }: { scheme: Scheme; language: Language }) {
  const [open, setOpen] = useState(false);
  const name = language === 'mr' ? scheme.nameMr : scheme.nameEn;
  const summary = language === 'mr' ? scheme.summaryMr : scheme.summaryEn;
  const eligibility = language === 'mr' ? scheme.eligibilityMr : scheme.eligibilityEn;
  const steps = language === 'mr' ? scheme.applicationStepsMr : scheme.applicationStepsEn;

  return (
    <View style={styles.card}>
      <Text style={styles.category}>{scheme.category}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.summary} numberOfLines={open ? undefined : 2}>
        {summary}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          {strings[language]['schemes.lastVerified']}: {scheme.lastVerified}
        </Text>
        <Text style={styles.meta}> • {scheme.sourceLabel}</Text>
      </View>

      {open && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.sectionLabel}>Eligibility</Text>
          <Text style={styles.body}>{eligibility}</Text>
          <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Documents</Text>
          {scheme.documents.map((d) => (
            <Text key={d} style={styles.body}>
              • {d}
            </Text>
          ))}
          <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Application steps</Text>
          {steps.map((s, i) => (
            <Text key={i} style={styles.body}>
              {i + 1}. {s}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={() => setOpen((o) => !o)}>
          <Text style={styles.btnText}>{open ? 'Hide details' : 'View details'}</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.primaryBtn]}
          onPress={() => Linking.openURL(scheme.officialUrl)}
        >
          <Text style={[styles.btnText, { color: '#FFF' }]}>
            {strings[language]['schemes.openOfficial']}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.verifyNote}>{strings[language]['schemes.verifyBanner']}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow,
  },
  category: { color: theme.colors.teal, fontWeight: '700', fontSize: 12, marginBottom: 4 },
  name: { color: theme.colors.text, fontSize: 17, fontWeight: '700', lineHeight: 24 },
  summary: {
    color: theme.colors.text,
    opacity: 0.85,
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' },
  meta: { color: theme.colors.muted, fontSize: 11 },
  sectionLabel: { color: theme.colors.teal, fontWeight: '700', fontSize: 13, marginBottom: 2 },
  body: { color: theme.colors.text, fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.teal,
  },
  primaryBtn: { backgroundColor: theme.colors.teal },
  btnText: { color: theme.colors.teal, fontWeight: '600', fontSize: 13 },
  verifyNote: { color: theme.colors.muted, fontSize: 10, marginTop: 8 },
});

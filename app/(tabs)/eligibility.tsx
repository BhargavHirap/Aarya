import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { submitEligibility } from '../../lib/api';
import { useSession } from '../../store/session';
import { strings } from '../../lib/i18n';
import { theme } from '../../lib/theme';
import { Disclaimer } from '../../components/Disclaimer';
import type { EligibilityAnswers, EligibilityResult } from '../../lib/types';

const HELP_OPTIONS = ['Scholarship', 'Education assistance', 'Welfare', 'Other'];
const STATUS_OPTIONS = ['Student', 'Working', 'Unemployed', 'Other'];
const AWARE_OPTIONS = ['Yes', 'No', 'Partly'];
const DOC_OPTIONS = [
  'Aadhaar',
  'Income certificate',
  'Caste certificate',
  'Bank passbook',
  'Marksheet',
  'Domicile',
];

export default function EligibilityScreen() {
  const language = useSession((s) => s.language);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<EligibilityAnswers>({
    helpType: '',
    state: '',
    status: '',
    aware: '',
    documents: [],
  });
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDoc = (d: string) => {
    setAnswers((a) => ({
      ...a,
      documents: a.documents.includes(d)
        ? a.documents.filter((x) => x !== d)
        : [...a.documents, d],
    }));
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitEligibility(answers);
      setResult(res);
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAnswers({ helpType: '', state: '', status: '', aware: '', documents: [] });
    setStep(1);
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>
              {strings[language]['eligibility.resultTitle']}
            </Text>
            <Text style={styles.noticeBody}>{result.notice}</Text>
          </View>
          <Text style={styles.section}>{strings[language]['eligibility.nextSteps']}</Text>
          {result.nextSteps.map((s, i) => (
            <Text key={i} style={styles.body}>
              {i + 1}. {s}
            </Text>
          ))}
          <Text style={styles.section}>{strings[language]['eligibility.checklist']}</Text>
          {result.checklist.map((c) => (
            <Text key={c} style={styles.body}>
              • {c}
            </Text>
          ))}
          <Text style={styles.verify}>
            {strings[language]['eligibility.verifyReminder']} {result.verifyAt}
          </Text>
          <Pressable style={styles.primaryBtn} onPress={reset}>
            <Text style={styles.primaryText}>{strings[language]['eligibility.reset']}</Text>
          </Pressable>
        </ScrollView>
        <Disclaimer language={language} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{strings[language]['eligibility.title']}</Text>
        <Text style={styles.step}>Step {step}/5</Text>

        {step === 1 && (
          <View>
            <Text style={styles.question}>{strings[language]['eligibility.q1']}</Text>
            {HELP_OPTIONS.map((o) => (
              <Pressable
                key={o}
                onPress={() => setAnswers((a) => ({ ...a, helpType: o }))}
                style={[styles.option, answers.helpType === o && styles.selectedOption]}
              >
                <Text style={styles.optionText}>{o}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.question}>{strings[language]['eligibility.q2']}</Text>
            <TextInput
              value={answers.state}
              onChangeText={(v) => setAnswers((a) => ({ ...a, state: v }))}
              placeholder="Maharashtra"
              placeholderTextColor={theme.colors.muted}
              style={styles.textInput}
            />
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.question}>{strings[language]['eligibility.q3']}</Text>
            {STATUS_OPTIONS.map((o) => (
              <Pressable
                key={o}
                onPress={() => setAnswers((a) => ({ ...a, status: o }))}
                style={[styles.option, answers.status === o && styles.selectedOption]}
              >
                <Text style={styles.optionText}>{o}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {step === 4 && (
          <View>
            <Text style={styles.question}>{strings[language]['eligibility.q4']}</Text>
            {AWARE_OPTIONS.map((o) => (
              <Pressable
                key={o}
                onPress={() => setAnswers((a) => ({ ...a, aware: o }))}
                style={[styles.option, answers.aware === o && styles.selectedOption]}
              >
                <Text style={styles.optionText}>{o}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {step === 5 && (
          <View>
            <Text style={styles.question}>{strings[language]['eligibility.q5']}</Text>
            <View style={styles.docRow}>
              {DOC_OPTIONS.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => toggleDoc(d)}
                  style={[
                    styles.docChip,
                    answers.documents.includes(d) && styles.selectedOption,
                  ]}
                >
                  <Text style={styles.optionText}>{d}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {error && <Text style={{ color: theme.colors.danger, marginTop: 12 }}>{error}</Text>}

        <View style={styles.btnRow}>
          {step > 1 && (
            <Pressable style={styles.secondaryBtn} onPress={() => setStep((s) => s - 1)}>
              <Text style={styles.secondaryText}>{strings[language]['eligibility.back']}</Text>
            </Pressable>
          )}
          {step < 5 ? (
            <Pressable style={styles.primaryBtn} onPress={() => setStep((s) => s + 1)}>
              <Text style={styles.primaryText}>{strings[language]['eligibility.submit']}</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryBtn} onPress={submit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryText}>
                  {strings[language]['eligibility.submit']}
                </Text>
              )}
            </Pressable>
          )}
        </View>
      </ScrollView>
      <Disclaimer language={language} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.md },
  title: { ...theme.typography.title, color: theme.colors.text },
  step: { color: theme.colors.teal, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  question: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
  option: {
    padding: 12,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  selectedOption: { borderColor: theme.colors.teal, backgroundColor: '#E6F2F1' },
  optionText: { color: theme.colors.text, fontSize: 15 },
  textInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  docRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  docChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  primaryBtn: {
    flex: 1,
    backgroundColor: theme.colors.saffron,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    alignItems: 'center',
  },
  primaryText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryText: { color: theme.colors.text, fontWeight: '700', fontSize: 15 },
  noticeCard: {
    backgroundColor: '#E6F2F1',
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginBottom: 12,
  },
  noticeTitle: { color: theme.colors.teal, fontWeight: '700', fontSize: 16 },
  noticeBody: { color: theme.colors.text, marginTop: 6, fontSize: 13 },
  section: { marginTop: 16, marginBottom: 6, color: theme.colors.teal, fontWeight: '700', fontSize: 14 },
  body: { color: theme.colors.text, fontSize: 14, lineHeight: 22 },
  verify: { marginTop: 16, fontSize: 12, color: theme.colors.muted },
});

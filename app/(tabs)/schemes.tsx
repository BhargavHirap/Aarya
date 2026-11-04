import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listSchemes } from '../../lib/api';
import { useSession } from '../../store/session';
import { strings } from '../../lib/i18n';
import { theme } from '../../lib/theme';
import { SchemeCard } from '../../components/SchemeCard';
import { Disclaimer } from '../../components/Disclaimer';
import type { Scheme } from '../../lib/types';

export default function SchemesScreen() {
  const language = useSession((s) => s.language);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const load = () => {
    setLoading(true);
    setError(null);
    listSchemes()
      .then(setSchemes)
      .catch((e) => setError(e?.message || 'Failed'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = schemes.filter((s) => {
    const t = q.toLowerCase();
    return (
      s.nameMr.toLowerCase().includes(t) ||
      s.nameEn.toLowerCase().includes(t) ||
      s.category.toLowerCase().includes(t)
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings[language]['schemes.title']}</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={strings[language]['schemes.searchPlaceholder']}
          placeholderTextColor={theme.colors.muted}
          style={styles.search}
        />
      </View>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{strings[language]['schemes.verifyBanner']}</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.teal} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: theme.colors.danger, marginBottom: 8 }}>{error}</Text>
          <Pressable onPress={load} style={styles.retryBtn}>
            <Text style={{ color: '#FFF' }}>{strings[language].retry}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => <SchemeCard scheme={item} language={language} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No schemes found.</Text>}
        />
      )}
      <Disclaimer language={language} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: theme.spacing.md },
  title: { ...theme.typography.title, color: theme.colors.text, marginBottom: 8 },
  search: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  banner: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: '#FCEEDC',
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md,
  },
  bannerText: { color: theme.colors.text, fontSize: 12 },
  list: { paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { color: theme.colors.muted, textAlign: 'center', marginTop: 24 },
  retryBtn: {
    backgroundColor: theme.colors.teal,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
});

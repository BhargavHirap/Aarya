import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../lib/theme';
import { useSession } from '../../store/session';
import { strings } from '../../lib/i18n';

export default function TabsLayout() {
  const language = useSession((s) => s.language);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.saffron,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopWidth: 0,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: strings[language]['tabs.ask'],
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="schemes"
        options={{
          title: strings[language]['tabs.schemes'],
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="eligibility"
        options={{
          title: strings[language]['tabs.eligibility'],
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { EntriesProvider } from './src/state/EntriesContext';
import { SettingsProvider } from './src/state/SettingsContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <EntriesProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </EntriesProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

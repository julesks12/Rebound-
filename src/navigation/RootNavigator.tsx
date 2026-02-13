import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { TabsNavigator } from './TabsNavigator';
import { Colors } from '../theme/colors';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    card: Colors.card,
    text: Colors.text,
    border: Colors.border,
    primary: Colors.primary,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <TabsNavigator />
    </NavigationContainer>
  );
}


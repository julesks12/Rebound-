import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import type {
  CheckInStackParamList,
  DashboardStackParamList,
  HistoryStackParamList,
  RootTabParamList,
  SettingsStackParamList,
} from './types';
import { Colors } from '../theme/colors';

import { DashboardScreen } from '../screens/DashboardScreen';
import { CheckInScreen } from '../screens/CheckInScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { EntryDetailScreen } from '../screens/EntryDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const CheckInStack = createNativeStackNavigator<CheckInStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
    </DashboardStack.Navigator>
  );
}

function CheckInStackScreen() {
  return (
    <CheckInStack.Navigator>
      <CheckInStack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{ title: 'Check-In' }}
      />
    </CheckInStack.Navigator>
  );
}

function HistoryStackScreen() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name="History" component={HistoryScreen} />
      <HistoryStack.Screen
        name="EntryDetail"
        component={EntryDetailScreen}
        options={{ title: 'Entry' }}
      />
    </HistoryStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

export function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mutedText,
        tabBarIcon: ({ color, size }) => {
          const icon =
            route.name === 'DashboardTab'
              ? 'home-outline'
              : route.name === 'CheckInTab'
                ? 'create-outline'
                : route.name === 'HistoryTab'
                  ? 'time-outline'
                  : 'settings-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStackScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="CheckInTab"
        component={CheckInStackScreen}
        options={{ title: 'Check-In' }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackScreen}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}


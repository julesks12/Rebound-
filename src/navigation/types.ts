import type { NavigatorScreenParams } from '@react-navigation/native';

export type DashboardStackParamList = {
  Dashboard: undefined;
};

export type CheckInStackParamList = {
  CheckIn: { date?: string } | undefined;
};

export type HistoryStackParamList = {
  History: undefined;
  EntryDetail: { date: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type RootTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  CheckInTab: NavigatorScreenParams<CheckInStackParamList>;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};


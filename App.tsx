import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { RootStackParamList } from './src/types';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { UserProvider } from './src/context/UserContext';
import { BuildProvider } from './src/context/BuildContext';
import { LeagueProvider } from './src/context/LeagueContext';
import { COLORS } from './src/utils/theme';

import DashboardScreen from './src/screens/DashboardScreen';
import BuildListScreen from './src/screens/BuildListScreen';
import BuildDetailScreen from './src/screens/BuildDetailScreen';
import AddBuildScreen from './src/screens/AddBuildScreen';
import UserListScreen from './src/screens/UserListScreen';
import LeagueListScreen from './src/screens/LeagueListScreen';
import LeagueScheduleScreen from './src/screens/LeagueScheduleScreen';
import LeagueDetailScreen from './src/screens/LeagueDetailScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// 1. 대시보드 스택
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.card }, headerTitleStyle: { color: COLORS.text }, headerTintColor: COLORS.primary, }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: '대시보드' }} />
      
      {/* 추가: 대시보드에서 리그 클릭 시 이동할 일정 화면 등록 */}
      <Stack.Screen name="LeagueSchedule" component={LeagueScheduleScreen} options={{ title: '리그 일정' }} />
      
      <Stack.Screen name="LeagueDetail" component={LeagueDetailScreen} options={{ title: '리그 상세' }} />
      <Stack.Screen name="BuildDetail" component={BuildDetailScreen} options={{ title: '빌드 상세' }} />
    </Stack.Navigator>
  );
}

// 2. 리그 스택
function LeagueStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.card }, headerTitleStyle: { color: COLORS.text }, headerTintColor: COLORS.primary, }}>
      <Stack.Screen name="Leagues" component={LeagueListScreen} options={{ title: '리그 목록' }} />
      <Stack.Screen name="LeagueSchedule" component={LeagueScheduleScreen} options={{ title: '리그 일정' }} />
      <Stack.Screen name="LeagueDetail" component={LeagueDetailScreen} options={{ title: '리그 상세' }} />
    </Stack.Navigator>
  );
}

// 3. 빌드 스택
function BuildStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.card }, headerTitleStyle: { color: COLORS.text }, headerTintColor: COLORS.primary, }}>
      <Stack.Screen name="BuildList" component={BuildListScreen} options={{ title: '빌드 목록' }} />
      <Stack.Screen name="BuildDetail" component={BuildDetailScreen} options={{ title: '빌드 상세' }} />
      <Stack.Screen name="AddBuild" component={AddBuildScreen} options={{ title: '빌드 추가/수정' }} />
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.card }, headerTitleStyle: { color: COLORS.text }, headerTintColor: COLORS.primary, }}>
      <Stack.Screen name="Users" component={UserListScreen} options={{ title: '유저 목록' }} />
    </Stack.Navigator>
  );
}


function RootTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'DashboardTab') iconName = '🏠';
          else if (route.name === 'LeaguesTab') iconName = '🏆';
          else if (route.name === 'Users') iconName = '👥';
          else if (route.name === 'Builds') iconName = '🛠️';
          return <Text style={{ color, fontSize: size }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: COLORS.border },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: '홈' }} />
      <Tab.Screen name="LeaguesTab" component={LeagueStack} options={{ title: '리그' }} />
      <Tab.Screen name="Users" component={UserStack} options={{ title: '유저' }} />
      <Tab.Screen name="Builds" component={BuildStack} options={{ title: '빌드' }} />
    </Tab.Navigator>
  );
}

function NavigationWrapper() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        <UserProvider>
          <BuildProvider>
            <LeagueProvider>
              <RootTabNavigator />
            </LeagueProvider>
          </BuildProvider>
        </UserProvider>
      ) : (
        <LoginScreen />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationWrapper />
    </AuthProvider>
  );
}
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './src/types';

import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import AddBuildScreen from './src/screens/AddBuildScreen';
import UserListScreen from './src/screens/UserListScreen';
import LoginScreen from './src/screens/LoginScreen';
import { BuildProvider } from './src/context/BuildContext';
import { UserProvider } from './src/context/UserContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Text, View, ActivityIndicator } from 'react-native';
import { COLORS } from './src/utils/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 핵심 해결책: createBottomTabNavigator에 <RootStackParamList> 타입을 명시적으로 넣어야 합니다.
 * 이렇게 하지 않으면 Tab.Screen의 name="Users" 부분에서 타입 충돌이 발생합니다.
 */
const Tab = createBottomTabNavigator<RootStackParamList>();

function BuildStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '빌드 목록' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: '빌드 상세' }} />
      <Stack.Screen name="AddBuild" component={AddBuildScreen} options={{ title: '빌드 추가/수정' }} />
    </Stack.Navigator>
  );
}

function RootTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          // route.name이 RootStackParamList의 키 중 하나임을 보장받습니다.
          let iconName = route.name === 'Builds' ? '🛠️' : '👥';
          return <Text style={{ color, fontSize: size }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Builds" component={BuildStack} options={{ title: '빌드' }} />
      {/* component={UserListScreen} 부분의 빨간 줄이 사라질 것입니다. */}
      <Tab.Screen name="Users" component={UserListScreen} options={{ title: '유저' }} />
    </Tab.Navigator>
  );
}

function NavigationWrapper() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        <UserProvider>
          <BuildProvider>
            <RootTabNavigator />
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


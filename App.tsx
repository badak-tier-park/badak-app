import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './src/types';

import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import AddBuildScreen from './src/screens/AddBuildScreen';
import UserListScreen from './src/screens/UserListScreen';
import LeagueListScreen from './src/screens/LeagueListScreen';
import LeagueDetailScreen from './src/screens/LeagueDetailScreen';
import LoginScreen from './src/screens/LoginScreen';
import { BuildProvider } from './src/context/BuildContext';
import { UserProvider } from './src/context/UserContext';
import { LeagueProvider } from './src/context/LeagueContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Text, View, ActivityIndicator } from 'react-native';
import { COLORS } from './src/utils/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
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

function LeagueStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Leagues' component={LeagueListScreen} options={{ title: '리그 목록' }}/>
            <Stack.Screen name='LeagueDetail' component={LeagueDetailScreen} options={{ title: '리그 상세' }}/>
        </Stack.Navigator>
    );
}

function RootTabNavigator() {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Builds') {
                        iconName = '🛠️';
                    } else if (route.name === 'Users') {
                        iconName = '👥';
                    } else if (route.name === 'Leagues') {
                        iconName = '🏆';
                }
                    return <Text style={{ color, fontSize: size }}>{iconName}</Text>;
                    },
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                })}
            >
            <Tab.Screen name="Leagues" component={LeagueStack} options={{ title: '리그' }} />
            <Tab.Screen name="Users" component={UserListScreen} options={{ title: '유저' }} />
            <Tab.Screen name="Builds" component={BuildStack} options={{ title: '빌드' }} />
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


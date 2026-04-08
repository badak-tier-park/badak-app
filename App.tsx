import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';
import { BuildProvider } from './src/context/BuildContext';

import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import AddBuildScreen from './src/screens/AddBuildScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <BuildProvider> 
            <NavigationContainer>
                <StatusBar barStyle="light-content" />
                <Stack.Navigator 
                    screenOptions={{
                        headerStyle: { backgroundColor: '#121212' },
                        headerTintColor: '#fff',
                        contentStyle: { backgroundColor: '#121212' },
                        headerTitleStyle: { fontWeight: 'bold' }
                    }}
                >
                    <Stack.Screen 
                        name="Home" 
                        component={HomeScreen} 
                        options={{ title: '빌드 아카이브' }} 
                    />
                    <Stack.Screen 
                        name="Detail" 
                        component={DetailScreen} 
                        options={{ title: '상세 전략' }} 
                    />
                    <Stack.Screen 
                        name="AddBuild" 
                        component={AddBuildScreen} 
                        options={{ title: '새 빌드 작성' }} 
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </BuildProvider>
    );
}
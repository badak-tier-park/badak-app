import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#121212' }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '빌드 아카이브' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: '상세 전략' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
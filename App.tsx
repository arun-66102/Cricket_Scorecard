import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Import all screens
import StartScreen from './screens/StartScreen';
import ScoreBoard from './screens/ScoreBoard';
import ChaseScreen from './screens/ChaseScreen';
import TournamentScreen from './screens/TournamentScreen';
import { MatchProvider } from './contexts/MatchContext';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <MatchProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen 
            name="StartScreen" 
            component={StartScreen} 
            options={{ title: 'Cricket Scorer' }}
          />
          <Stack.Screen 
            name="ScoreBoard" 
            component={ScoreBoard} 
            options={({ route }) => ({
              title: route.params?.isTournament ? 'Tournament Match' : 'Single Match',
              headerBackTitle: 'Back',
            })}
          />
          <Stack.Screen 
            name="ChaseScreen" 
            component={ChaseScreen} 
            options={{ title: 'Chase Target' }}
          />
          <Stack.Screen 
            name="Tournament" 
            component={TournamentScreen} 
            options={{ title: 'Tournament' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MatchProvider>
  );
}

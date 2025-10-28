import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMatch } from '../contexts/MatchContext';
import { ScreenProps } from '../types';

export default function StartScreen({ navigation }: ScreenProps) {
  const { dispatch } = useMatch();

  const startNewGame = (isTournament: boolean = false) => {
    // Reset match state when starting a new game
    dispatch({ type: 'RESET_MATCH' });
    navigation.navigate('ScoreBoard', { isTournament });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>🏏</Text>
      </View>
      <Text style={styles.title}>Cricket Scorer</Text>
      <Text style={styles.subtitle}>Track your cricket matches with ease</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => startNewGame(false)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Single Match</Text>
          <Text style={styles.buttonSubtext}>Track a single cricket match</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => startNewGame(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Tournament</Text>
          <Text style={styles.buttonSubtext}>Start a tournament</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => {/* Navigate to stats */}}
        >
          <Text style={styles.statsButtonText}>View Match History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#d0e3ff',
  },
  logoText: {
    fontSize: 60,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: { 
    fontSize: 20, 
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  statsButton: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  statsButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
});
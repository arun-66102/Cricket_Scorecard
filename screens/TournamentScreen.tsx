import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

export default function TournamentScreen({ navigation }: any) {
  const [teams, setTeams] = useState<string[]>([]);
  const [teamName, setTeamName] = useState('');

  const addTeam = () => {
    if (teamName.trim() === '') {
      Alert.alert('Error', 'Team name cannot be empty.');
      return;
    }
    if (teams.includes(teamName.trim())) {
      Alert.alert('Error', 'Team already added.');
      return;
    }
    setTeams([...teams, teamName.trim()]);
    setTeamName('');
  };

  const startMatch = () => {
    if (teams.length < 2) {
      Alert.alert('Error', 'Add at least 2 teams to start the tournament.');
      return;
    }
    // Start first match (Team 1 vs Team 2)
    navigation.navigate('ScoreBoard', { teamA: teams[0], teamB: teams[1], isTournament: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Tournament Mode</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Team Name"
        value={teamName}
        onChangeText={setTeamName}
      />

      <TouchableOpacity style={styles.addButton} onPress={addTeam}>
        <Text style={styles.addButtonText}>Add Team</Text>
      </TouchableOpacity>

      <FlatList
        data={teams}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <View style={styles.teamItem}>
            <Text style={styles.teamText}>{index + 1}. {item}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: 'gray' }}>No teams added yet.</Text>}
        style={{ marginVertical: 20 }}
      />

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: teams.length >= 2 ? '#4CAF50' : '#aaa' }]}
        onPress={startMatch}
      >
        <Text style={styles.startText}>Start Match</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  teamItem: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginVertical: 5,
    width: '90%',
  },
  teamText: {
    fontSize: 16,
    fontWeight: '500',
  },
  startButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  startText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
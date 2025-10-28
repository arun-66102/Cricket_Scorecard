import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ScoreBoard({ navigation }: any) {
  const [runs, setRuns] = useState(22);
  const [wickets, setWickets] = useState(1);
  const [balls, setBalls] = useState(20);

  const addRun = (r: number) => setRuns(runs + r);
  const addWicket = () => setWickets(wickets + 1);

  const overs = (balls / 6).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.scoreHeader}>
        <Text style={styles.team}>TEAM 1*</Text>
        <Text style={styles.score}>{runs}/{wickets}</Text>
        <Text style={styles.over}>({overs}/10)</Text>
      </View>

      <View style={styles.buttonsContainer}>
        {[0, 1, 2, 3, 4, 6].map((num) => (
          <TouchableOpacity key={num} style={styles.runButton} onPress={() => addRun(num)}>
            <Text style={styles.runText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.extraButton}><Text>WIDE BALL</Text></TouchableOpacity>
        <TouchableOpacity style={styles.extraButton}><Text>NO BALL</Text></TouchableOpacity>
        <TouchableOpacity style={styles.extraButton} onPress={addWicket}><Text>WICKET</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingTop: 60 },
  scoreHeader: { alignItems: 'center', marginBottom: 30 },
  team: { fontSize: 18, fontWeight: '500' },
  score: { fontSize: 42, fontWeight: '700' },
  over: { fontSize: 16, color: 'gray' },
  buttonsContainer: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '90%', marginTop: 20,
  },
  runButton: {
    backgroundColor: '#f1f1f1', margin: 10, padding: 20, borderRadius: 50, width: 70, alignItems: 'center',
  },
  runText: { fontSize: 20, fontWeight: 'bold' },
  bottomButtons: {
    flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 40,
  },
  extraButton: {
    backgroundColor: '#e0e0e0', padding: 10, borderRadius: 8, width: 100, alignItems: 'center',
  },
});

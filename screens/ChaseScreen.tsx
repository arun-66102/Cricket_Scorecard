import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMatch } from '../contexts/MatchContext';
import { ScreenProps } from '../types';

export default function ChaseScreen({ navigation }: ScreenProps) {
  const { state, dispatch } = useMatch();
  const { team1, team2, matchSettings } = state;
  
  // Get target from team1's score if not already set
  const target = team1.totalRuns + 1;
  const oversLimit = matchSettings.totalOvers;
  
  const { totalRuns: runs, wickets, overs, balls } = team2;
  
  const totalBalls = oversLimit * 6;
  const oversFormatted = (overs * 6 + balls) / 6; // Convert to decimal overs
  const ballsLeft = Math.max(0, totalBalls - (overs * 6 + balls));
  const runsToWin = Math.max(0, target - runs);

  // Check for match completion on state changes
  useEffect(() => {
    if (runs >= target) {
      Alert.alert("Match Result", `${team2.name} Won the Match!`, [
        { text: "Back to Home", onPress: () => navigation.navigate('StartScreen') }
      ]);
    } else if (wickets >= matchSettings.maxWickets || (overs * 6 + balls) >= totalBalls) {
      Alert.alert("Match Result", `${team1.name} Won the Match!`, [
        { text: "Back to Home", onPress: () => navigation.navigate('StartScreen') }
      ]);
    }
  }, [runs, wickets, overs, balls, target]);

  const addRun = (r: number) => {
    if (wickets < matchSettings.maxWickets && 
        (overs * 6 + balls) < totalBalls && 
        runs < target) {
      dispatch({ type: 'ADD_RUNS', payload: r });
    }
  };

  const addWicket = () => {
    if (wickets < matchSettings.maxWickets && 
        (overs * 6 + balls) < totalBalls && 
        runs < target) {
      dispatch({ 
        type: 'ADD_WICKET', 
        payload: { 
          playerId: `p2-${wickets + 1}`, 
          howOut: 'Bowled' 
        } 
      });
    }
  };

  const handleExtra = (type: 'wide' | 'no') => {
    if (wickets < matchSettings.maxWickets && runs < target) {
      dispatch({ type: 'ADD_RUNS', payload: 1 });
    }
  };

  // Calculate run rate (runs per over)
  const runRate = ((runs / (overs * 6 + balls || 1)) * 6).toFixed(2);
  const projectedScore = Math.round((runs / (overs * 6 + balls || 1)) * totalBalls);

  return (
    <View style={styles.container}>
      <View style={styles.scoreHeader}>
        <Text style={styles.team}>{team1.name}: {team1.totalRuns}/{team1.wickets}</Text>
        <Text style={[styles.team, styles.battingTeam]}>{team2.name}*</Text>
        <Text style={styles.score}>{runs}/{wickets}</Text>
        <Text style={styles.over}>
          ({oversFormatted.toFixed(1)}/{oversLimit} overs)
        </Text>
      </View>

      <Text style={[
        styles.toWin,
        runsToWin <= 20 && styles.toWinClose,
        runsToWin === 0 && styles.toWinAchieved
      ]}>
        {runsToWin > 0 
          ? `Need ${runsToWin} runs in ${Math.floor(ballsLeft / 6)}.${ballsLeft % 6} overs` 
          : 'Target Achieved! 🎉'}
      </Text>

      <View style={styles.statsBox}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Run Rate:</Text>
          <Text style={styles.statValue}>{runRate}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Required RR:</Text>
          <Text style={styles.statValue}>
            {runsToWin > 0 ? (runsToWin / (ballsLeft / 6)).toFixed(2) : '-'}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Projected Score:</Text>
          <Text style={styles.statValue}>{projectedScore}</Text>
        </View>
      </View>

      <View style={styles.overSection}>
        <Text style={styles.sectionTitle}>THIS OVER</Text>
      </View>

      <View style={styles.buttonsContainer}>
        {[0, 1, 2, 3, 4, 6].map((num) => (
          <TouchableOpacity key={num} style={styles.runButton} onPress={() => addRun(num)}>
            <Text style={styles.runText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.extraButton} onPress={() => handleExtra('wide')}>
          <Text>WIDE BALL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraButton} onPress={() => handleExtra('no')}>
          <Text>NO BALL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraButton} onPress={addWicket}>
          <Text>WICKET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    alignItems: 'center', 
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  scoreHeader: { 
    alignItems: 'center', 
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  team: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#555',
    marginBottom: 4,
  },
  battingTeam: {
    color: '#2c7be5',
    fontWeight: '600',
    marginVertical: 8,
  },
  score: { 
    fontSize: 42, 
    fontWeight: '700', 
    marginVertical: 4,
    color: '#2c3e50',
  },
  over: { 
    fontSize: 16, 
    color: '#7f8c8d',
    marginTop: 4,
  },
  toWin: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginVertical: 16,
    color: '#27ae60',
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  toWinClose: {
    color: '#e67e22',
    backgroundColor: 'rgba(230, 126, 34, 0.1)',
  },
  toWinAchieved: {
    color: '#27ae60',
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
  },
  statsBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: 15,
  },
  statValue: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  overSection: { 
    marginBottom: 16,
    width: '100%',
  },
  sectionTitle: { 
    fontWeight: '600', 
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    paddingLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    width: '100%',
    marginBottom: 16,
  },
  runButton: {
    backgroundColor: '#f1f8ff', 
    margin: 6, 
    padding: 16, 
    borderRadius: 12, 
    width: 70, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0e3ff',
  },
  runText: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#2c7be5',
  },
  bottomButtons: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 8,
    paddingHorizontal: 8,
  },
  extraButton: {
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 8, 
    minWidth: 100, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
  },
});
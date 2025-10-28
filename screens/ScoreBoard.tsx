import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMatch } from '../contexts/MatchContext';
import { ScreenProps } from '../types';

export default function ScoreBoard({ navigation, route }: ScreenProps) {
  const { state, dispatch } = useMatch();
  const { team1, team2, matchSettings, isFirstInnings } = state;
  const { isTournament = false } = route?.params || {};
  
  // Get the current batting team
  const currentTeam = team1.isBatting ? team1 : team2;
  const otherTeam = team1.isBatting ? team2 : team1;
  const { totalRuns, wickets, overs, balls } = currentTeam;
  
  const totalBalls = matchSettings.totalOvers * 6;
  const ballsBowled = overs * 6 + balls;
  const ballsRemaining = Math.max(0, totalBalls - ballsBowled);
  const oversFormatted = (overs + (balls / 6)).toFixed(1);
  
  // Check for innings completion
  useEffect(() => {
    if (wickets >= matchSettings.maxWickets || ballsBowled >= totalBalls) {
      if (isFirstInnings) {
        // First innings completed, switch to second innings
        Alert.alert(
          'Innings Complete',
          `End of ${currentTeam.name}'s innings. ${otherTeam.name} needs ${totalRuns + 1} runs to win.`,
          [
            { 
              text: 'Start Chase', 
              onPress: () => {
                dispatch({ type: 'TOGGLE_INNINGS' });
                if (isTournament) {
                  navigation.navigate('ChaseScreen');
                }
              } 
            }
          ]
        );
      } else {
        // Match complete
        const winner = currentTeam.totalRuns > otherTeam.totalRuns ? currentTeam.name : otherTeam.name;
        Alert.alert(
          'Match Complete',
          `${winner} won the match!`,
          [
            { 
              text: 'Back to Home', 
              onPress: () => {
                dispatch({ type: 'RESET_MATCH' });
                navigation.navigate('StartScreen');
              } 
            }
          ]
        );
      }
    }
  }, [wickets, ballsBowled]);

  const handleRun = (runs: number) => {
    if (wickets < matchSettings.maxWickets && ballsBowled < totalBalls) {
      dispatch({ type: 'ADD_RUNS', payload: runs });
    }
  };

  const handleWicket = () => {
    if (wickets < matchSettings.maxWickets && ballsBowled < totalBalls) {
      dispatch({ 
        type: 'ADD_WICKET', 
        payload: { 
          playerId: `${currentTeam === team1 ? 'p1' : 'p2'}-${wickets + 1}`,
          howOut: 'Bowled'
        } 
      });
    }
  };

  const handleExtra = (type: 'wide' | 'no') => {
    if (wickets < matchSettings.maxWickets && ballsBowled < totalBalls) {
      // For wides and no balls, add 1 run and don't count as a ball
      dispatch({ type: 'ADD_RUNS', payload: 1 });
    }
  };

  // Calculate run rate (runs per over)
  const runRate = ((totalRuns / (ballsBowled || 1)) * 6).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.scoreHeader}>
        <Text style={styles.matchType}>
          {isTournament ? 'TOURNAMENT MATCH' : 'SINGLE MATCH'}
        </Text>
        <Text style={styles.team}>
          {currentTeam.name} {currentTeam.isBatting ? '*' : ''}
        </Text>
        <Text style={styles.score}>{totalRuns}/{wickets}</Text>
        <Text style={styles.over}>
          ({oversFormatted}/{matchSettings.totalOvers} overs)
        </Text>
        <Text style={styles.runRate}>RR: {runRate}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        {[0, 1, 2, 3, 4, 6].map((num) => (
          <TouchableOpacity 
            key={num} 
            style={styles.runButton} 
            onPress={() => handleRun(num)}
            disabled={wickets >= matchSettings.maxWickets || ballsBowled >= totalBalls}
          >
            <Text style={styles.runText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={styles.extraButton}
          onPress={() => handleExtra('wide')}
          disabled={wickets >= matchSettings.maxWickets || ballsBowled >= totalBalls}
        >
          <Text>WIDE BALL</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.extraButton}
          onPress={() => handleExtra('no')}
          disabled={wickets >= matchSettings.maxWickets || ballsBowled >= totalBalls}
        >
          <Text>NO BALL</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.extraButton, styles.wicketButton]}
          onPress={handleWicket}
          disabled={wickets >= matchSettings.maxWickets || ballsBowled >= totalBalls}
        >
          <Text style={styles.wicketText}>WICKET</Text>
        </TouchableOpacity>
      </View>
      
      {!isFirstInnings && (
        <View style={styles.targetBox}>
          <Text style={styles.targetText}>
            Target: {team1.totalRuns + 1}
          </Text>
          <Text style={styles.ballsRemaining}>
            {ballsRemaining} balls remaining
          </Text>
        </View>
      )}
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
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  matchType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  team: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#2c3e50',
    marginBottom: 4,
  },
  score: { 
    fontSize: 48, 
    fontWeight: '700', 
    color: '#2c3e50',
    marginVertical: 8,
  },
  over: { 
    fontSize: 16, 
    color: '#7f8c8d',
    marginBottom: 4,
  },
  runRate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    width: '100%',
    marginBottom: 20,
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
    marginTop: 20,
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
  wicketButton: {
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
  },
  wicketText: {
    color: '#e53935',
    fontWeight: '600',
  },
  targetBox: {
    marginTop: 24,
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  targetText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 4,
  },
  ballsRemaining: {
    fontSize: 14,
    color: '#5c6bc0',
  },
});

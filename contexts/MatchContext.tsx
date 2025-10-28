import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MatchState, Player, Bowler } from '../types';

type MatchAction =
  | { type: 'ADD_RUNS'; payload: number }
  | { type: 'ADD_WICKET'; payload: { playerId: string; howOut: string } }
  | { type: 'CHANGE_BOWLER'; payload: string }
  | { type: 'TOGGLE_INNINGS' }
  | { type: 'RESET_MATCH' };

const initialState: MatchState = {
  team1: {
    name: 'Team 1',
    players: Array(11).fill(0).map((_, i) => ({
      id: `p1-${i + 1}`,
      name: `Player ${i + 1}`,
      runs: 0,
      ballsFaced: 0,
      isOut: false,
    })),
    totalRuns: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    isBatting: true,
  },
  team2: {
    name: 'Team 2',
    players: Array(11).fill(0).map((_, i) => ({
      id: `p2-${i + 1}`,
      name: `Player ${i + 1}`,
      runs: 0,
      ballsFaced: 0,
      isOut: false,
    })),
    totalRuns: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    isBatting: false,
  },
  currentBatsmen: ['p1-1', 'p1-2'],
  matchSettings: {
    totalOvers: 10,
    maxWickets: 10,
    isTournament: false,
    tournamentName: '',
    currentMatch: 1,
    totalMatches: 1,
    teams: [] as string[],
  },
  isFirstInnings: true,
  isMatchComplete: false,
};

const MatchContext = createContext<{
  state: MatchState;
  dispatch: React.Dispatch<MatchAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const matchReducer = (state: MatchState, action: MatchAction): MatchState => {
  const currentTeam = state.team1.isBatting ? 'team1' : 'team2';
  const otherTeam = currentTeam === 'team1' ? 'team2' : 'team1';
  const currentBatsmanId = state.currentBatsmen[0];
  const currentTeamState = state[currentTeam];
  const isNewOver = currentTeamState.balls >= 5;
  const totalBalls = state.matchSettings.totalOvers * 6;
  const ballsBowled = currentTeamState.overs * 6 + currentTeamState.balls;
  const isInningsComplete = 
    currentTeamState.wickets >= state.matchSettings.maxWickets - 1 || 
    ballsBowled >= totalBalls;

  const updateBatsman = (player: Player, runs: number) => ({
    ...player,
    runs: player.runs + runs,
    ballsFaced: player.ballsFaced + 1,
  });

  const updateBowlingFigures = () => {
    // Implement bowler stats update if needed
  };

  switch (action.type) {
    case 'ADD_RUNS': {
      const newBalls = (currentTeamState.balls + 1) % 6;
      const newOvers = isNewOver ? currentTeamState.overs + 1 : currentTeamState.overs;
      
      const newState = {
        ...state,
        [currentTeam]: {
          ...currentTeamState,
          totalRuns: currentTeamState.totalRuns + action.payload,
          balls: newBalls,
          overs: isNewOver ? newOvers : currentTeamState.overs,
          players: currentTeamState.players.map(player => 
            player.id === currentBatsmanId 
              ? updateBatsman(player, action.payload)
              : player
          ),
        },
      };

      // Update bowler's figures if needed
      updateBowlingFigures();

      return newState;
    }

    case 'ADD_WICKET': {
      const updatedPlayers = state[currentTeam].players.map(player => 
        player.id === action.payload.playerId 
          ? { ...player, isOut: true, howOut: action.payload.howOut }
          : player
      );

      // Find next batsman
      const nextBatsman = updatedPlayers.find(p => !p.isOut && !state.currentBatsmen.includes(p.id));
      const newBatsmen = nextBatsman 
        ? [nextBatsman.id, state.currentBatsmen[1]] 
        : state.currentBatsmen;

      const newBalls = (currentTeamState.balls + 1) % 6;
      const newOvers = isNewOver ? currentTeamState.overs + 1 : currentTeamState.overs;
      const newWickets = currentTeamState.wickets + 1;

      return {
        ...state,
        [currentTeam]: {
          ...currentTeamState,
          wickets: newWickets,
          balls: newBalls,
          overs: isNewOver ? newOvers : currentTeamState.overs,
          players: updatedPlayers,
        },
        currentBatsmen: newBatsmen,
        isMatchComplete: isInningsComplete || newWickets >= state.matchSettings.maxWickets - 1,
      };
    }

    case 'TOGGLE_INNINGS':
      return {
        ...state,
        [currentTeam]: {
          ...state[currentTeam],
          isBatting: false,
        },
        [otherTeam]: {
          ...state[otherTeam],
          isBatting: true,
        },
        isFirstInnings: false,
        target: state[currentTeam].totalRuns + 1,
      };

    case 'RESET_MATCH':
      return initialState;

    default:
      return state;
  }
};

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  return (
    <MatchContext.Provider value={{ state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};

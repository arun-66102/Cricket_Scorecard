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

  switch (action.type) {
    case 'ADD_RUNS':
      return {
        ...state,
        [currentTeam]: {
          ...state[currentTeam],
          totalRuns: state[currentTeam].totalRuns + action.payload,
          balls: (state[currentTeam].balls + 1) % 6,
          overs: state[currentTeam].balls === 5 ? state[currentTeam].overs + 1 : state[currentTeam].overs,
          players: state[currentTeam].players.map(player => 
            player.id === currentBatsmanId 
              ? { ...player, runs: player.runs + action.payload, ballsFaced: player.ballsFaced + 1 }
              : player
          ),
        },
      };

    case 'ADD_WICKET':
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

      return {
        ...state,
        [currentTeam]: {
          ...state[currentTeam],
          wickets: state[currentTeam].wickets + 1,
          balls: (state[currentTeam].balls + 1) % 6,
          overs: state[currentTeam].balls === 5 ? state[currentTeam].overs + 1 : state[currentTeam].overs,
          players: updatedPlayers,
        },
        currentBatsmen: newBatsmen,
        isMatchComplete: state[currentTeam].wickets + 1 >= state.matchSettings.maxWickets || 
                         (state[currentTeam].balls === 5 && 
                          state[currentTeam].overs + 1 >= state.matchSettings.totalOvers),
      };

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

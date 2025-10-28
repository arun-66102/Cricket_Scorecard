// Navigation types
export type RootStackParamList = {
  StartScreen: undefined;
  ScoreBoard: { isTournament?: boolean };
  ChaseScreen: undefined;
  Tournament: undefined;
};

// Match state types
export interface Player {
  id: string;
  name: string;
  runs: number;
  ballsFaced: number;
  isOut: boolean;
  howOut?: string;
}

export interface Bowler {
  id: string;
  name: string;
  overs: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  ballsBowled: number;
}

export interface MatchState {
  team1: {
    name: string;
    players: Player[];
    totalRuns: number;
    wickets: number;
    overs: number;
    balls: number;
    isBatting: boolean;
  };
  team2: {
    name: string;
    players: Player[];
    totalRuns: number;
    wickets: number;
    overs: number;
    balls: number;
    isBatting: boolean;
  };
  currentBowler?: string;
  currentBatsmen: string[];
  matchSettings: {
    totalOvers: number;
    maxWickets: number;
    isTournament: boolean;
    tournamentName?: string;
    currentMatch?: number;
    totalMatches?: number;
    teams?: string[];
  };
  isFirstInnings: boolean;
  isMatchComplete: boolean;
  target?: number;
}

// Component props
export interface ScreenProps {
  navigation: {
    navigate: (screen: keyof RootStackParamList, params?: any) => void;
    goBack: () => void;
  };
  route?: {
    params?: any;
  };
}

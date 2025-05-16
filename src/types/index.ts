export interface Team {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  round: number;
  position: number;
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
  nextMatchId: string | null;
  comments: string;
}

export interface Tournament {
  id: string;
  name: string;
  createdAt: number;
  createdBy: string;
  isActive: boolean;
  matches: Match[];
}

export interface User {
  id: string;
  email: string;
  isEditor: boolean;
}
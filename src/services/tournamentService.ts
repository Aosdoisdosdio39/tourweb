import { db } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { Tournament, Match } from '../types';

export const createTournament = async (name: string, userId: string): Promise<string> => {
  const tournamentId = uuidv4();
  const tournamentRef = doc(db, 'tournaments', tournamentId);
  
  const tournament: Tournament = {
    id: tournamentId,
    name,
    createdAt: Date.now(),
    createdBy: userId,
    isActive: false,
    matches: []
  };
  
  await setDoc(tournamentRef, tournament);
  return tournamentId;
};

export const getTournament = async (tournamentId: string): Promise<Tournament | null> => {
  const tournamentRef = doc(db, 'tournaments', tournamentId);
  const tournamentSnap = await getDoc(tournamentRef);
  
  if (tournamentSnap.exists()) {
    return tournamentSnap.data() as Tournament;
  }
  
  return null;
};

export const updateMatch = async (
  tournamentId: string, 
  matchId: string, 
  matchData: Partial<Match>
): Promise<void> => {
  const tournamentRef = doc(db, 'tournaments', tournamentId);
  const tournamentSnap = await getDoc(tournamentRef);
  
  if (tournamentSnap.exists()) {
    const tournament = tournamentSnap.data() as Tournament;
    const matches = tournament.matches.map(match => 
      match.id === matchId ? { ...match, ...matchData } : match
    );
    
    await updateDoc(tournamentRef, { matches });
  }
};

export const startTournament = async (tournamentId: string): Promise<void> => {
  const tournamentRef = doc(db, 'tournaments', tournamentId);
  await updateDoc(tournamentRef, { 
    isActive: true,
    activatedAt: serverTimestamp()
  });
};

export const subscribeTournament = (
  tournamentId: string, 
  callback: (tournament: Tournament) => void
) => {
  const tournamentRef = doc(db, 'tournaments', tournamentId);
  
  return onSnapshot(tournamentRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as Tournament);
    }
  });
};

export const createBracket = async (
  tournamentId: string,
  numTeams: number
): Promise<void> => {
  const tournamentRef = doc(db, 'tournaments', tournamentId);
  const tournamentSnap = await getDoc(tournamentRef);
  
  if (!tournamentSnap.exists()) {
    throw new Error('Tournament not found');
  }
  
  // Calculate the number of rounds needed
  const numRounds = Math.ceil(Math.log2(numTeams));
  const totalMatches = Math.pow(2, numRounds) - 1;
  
  // Generate all matches
  const matches: Match[] = [];
  
  // Final match (championship)
  const finalMatchId = uuidv4();
  matches.push({
    id: finalMatchId,
    round: numRounds,
    position: 1,
    team1: null,
    team2: null,
    winner: null,
    nextMatchId: null,
    comments: ''
  });
  
  // Generate all other rounds and matches
  for (let round = numRounds - 1; round >= 1; round--) {
    const matchesInRound = Math.pow(2, round - 1);
    
    for (let position = 1; position <= matchesInRound; position++) {
      const matchId = uuidv4();
      
      // Determine the next match this feeds into
      const nextMatchPosition = Math.ceil(position / 2);
      const nextRound = round + 1;
      
      // Find the ID of the next match
      const nextMatch = matches.find(m => m.round === nextRound && m.position === nextMatchPosition);
      const nextMatchId = nextMatch ? nextMatch.id : null;
      
      matches.push({
        id: matchId,
        round,
        position,
        team1: null,
        team2: null,
        winner: null,
        nextMatchId,
        comments: ''
      });
    }
  }
  
  await updateDoc(tournamentRef, { matches });
};
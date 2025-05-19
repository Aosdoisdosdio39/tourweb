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

  console.log("🧠 createBracket стартанул");
  
  if (!tournamentSnap.exists()) {
    throw new Error('Tournament not found');
  }

  const numRounds = Math.ceil(Math.log2(numTeams));
  const totalMatches = Math.pow(2, numRounds) - 1;

  const matches: Match[] = [];

  // Шаг 1: создать все матчи (totalMatches)
  for (let i = 0; i < totalMatches; i++) {
    matches.push({
      id: uuidv4(),
      round: 0, // потом установим
      position: 0, // потом установим
      team1: null,
      team2: null,
      winner: null,
      nextMatchId: null,
      comments: ''
    });
  }

  // Шаг 2: установить раунды и позиции
  let matchIndex = 0;
  for (let round = 1; round <= numRounds; round++) {
    // matchesInRound: number of matches in this round
    const matchesInRound = Math.pow(2, numRounds - round);
    for (let position = 1; position <= matchesInRound; position++) {
      matches[matchIndex].round = round;
      matches[matchIndex].position = position;
      matchIndex++;
    }
  }

  // Шаг 3: установить связи (nextMatchId)
  for (const match of matches) {
    if (match.round < numRounds) {
      const nextRound = match.round + 1;
      const nextPosition = Math.ceil(match.position / 2);
      const nextMatch = matches.find(m =>
        m.round === nextRound && m.position === nextPosition
      );
      if (nextMatch) {
        match.nextMatchId = nextMatch.id;
      }
    }
  }

  // Log round 1 matches for debugging
  const round1Matches = matches.filter(m => m.round === 1);
  console.log(`Round 1 matches (should be ${numTeams / 2}):`, round1Matches);

  console.log("Создано матчей:", matches.length); // должен быть 3 при 4 командах

  await updateDoc(tournamentRef, { matches });
};


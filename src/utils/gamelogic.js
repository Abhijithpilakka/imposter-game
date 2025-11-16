import { WORD_CATEGORIES } from './constants';

export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const assignWords = (playerCount, category = 'general') => {
  const wordsPool = WORD_CATEGORIES[category] || WORD_CATEGORIES.general;
  
  const randomWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
  const impostorIndex = Math.floor(Math.random() * playerCount);
  const impostorWord = wordsPool.filter(w => w !== randomWord)[
    Math.floor(Math.random() * (wordsPool.length - 1))
  ];
  
  return { randomWord, impostorIndex, impostorWord };
};

export const calculateVoteResults = (votes, players) => {
  const voteCounts = {};
  
  // Count votes for each player
  Object.values(votes).forEach(vote => {
    const votedFor = vote.votedFor;
    if (votedFor) {
      voteCounts[votedFor] = (voteCounts[votedFor] || 0) + 1;
    }
  });
  
  // Find the player with most votes
  let mostVoted = '';
  let maxVotes = 0;
  
  Object.entries(voteCounts).forEach(([playerName, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      mostVoted = playerName;
    }
  });
  
  return { voteCounts, mostVoted };
};

export const calculatePoints = (votes, wordAssignments, players) => {
  const pointsAwarded = {};
  
  // Initialize all players with 0 points
  Object.values(players).forEach(player => {
    pointsAwarded[player.id] = 0;
  });
  
  // Find the impostor
  const impostorId = Object.keys(wordAssignments).find(
    id => wordAssignments[id].isImpostor
  );
  const impostorPlayer = players[impostorId];
  
  if (!impostorPlayer) return pointsAwarded;
  
  // Count how many players voted for the impostor
  const correctVoters = [];
  const wrongVoters = [];
  
  Object.values(votes).forEach(vote => {
    const voterId = vote.votedForId;
    const voterPlayerId = Object.keys(votes).find(key => votes[key] === vote);
    
    if (vote.votedFor === impostorPlayer.name) {
      correctVoters.push(voterPlayerId);
    } else {
      wrongVoters.push(voterPlayerId);
    }
  });
  
  const totalPlayers = Object.keys(players).length;
  
  // If impostor wins (not caught or minority voted correctly)
  if (correctVoters.length <= totalPlayers / 2) {
    // Impostor gets 2 points for each player who voted wrong
    pointsAwarded[impostorId] = (wrongVoters.length-1) * 2;
  } else {
    // Innocents win - players who voted correctly get 2 points each
    correctVoters.forEach(voterId => {
      pointsAwarded[voterId] = 2;
    });
  }
  
  return pointsAwarded;
};
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
    const votedFor = vote.votedFor; // This should be a string (player name)
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
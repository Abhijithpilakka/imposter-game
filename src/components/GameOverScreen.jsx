import React, { useState, useEffect } from 'react';
import { Crown, Trophy } from 'lucide-react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../utils/firebase';
import { calculateVoteResults } from '../utils/gamelogic';

export default function GameOverScreen({ roomCode, playerName, playerId, onPlayAgain }) {
  const [roomData, setRoomData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [myWord, setMyWord] = useState('');
  const [isImpostor, setIsImpostor] = useState(false);
  const [voteResults, setVoteResults] = useState({ voteCounts: {}, mostVoted: '' });
  const [winner, setWinner] = useState('');
  const [impostorName, setImpostorName] = useState('');

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomCode}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);
        setPlayers(data.players ? Object.values(data.players) : []);
        
        if (data.wordAssignments && data.wordAssignments[playerId]) {
          setMyWord(data.wordAssignments[playerId].word);
          setIsImpostor(data.wordAssignments[playerId].isImpostor);
        }
        
        if (data.votes) {
          
          const results = calculateVoteResults(data.votes, data.players);
          
          setVoteResults(results);
          
          // Find impostor
          const impostorId = Object.keys(data.wordAssignments).find(
            id => data.wordAssignments[id].isImpostor
          );
          const impostorPlayer = data.players[impostorId];
          setImpostorName(impostorPlayer?.name || '');
          
          if (results.mostVoted === impostorPlayer?.name) {
            setWinner('🎉 Innocents Win! The impostor was caught!');
          } else {
            setWinner('👺 Impostor Wins! They fooled everyone!');
          }
        }
      }
    });

    return () => unsubscribe();
  }, [roomCode, playerId]);

  const handlePlayAgain = async () => {
    // Reset game state back to lobby
    await update(ref(database, `rooms/${roomCode}`), {
      gameState: 'lobby',
      wordAssignments: null,
      votes: null
    });
  };

  const isHost = roomData?.hostId === playerId;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className={`inline-block p-4 rounded-full mb-4 ${
            winner.includes('Impostor Wins') 
              ? 'bg-red-100' 
              : 'bg-green-100'
          }`}>
            <Trophy className={`w-16 h-16 ${
              winner.includes('Impostor Wins')
                ? 'text-red-500'
                : 'text-green-500'
            }`} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{winner}</h2>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl mb-6">
          <p className="text-center text-lg text-gray-700 mb-2">
            <span className="font-bold text-red-600 text-xl">The Impostor was:</span>
          </p>
          <p className="text-center text-3xl font-bold text-red-600">{impostorName} 👺</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl mb-6">
          <p className="text-lg text-gray-700 mb-2 text-center">
            You were: <span className="font-bold text-purple-600">
              {isImpostor ? 'THE IMPOSTOR 👺' : 'AN INNOCENT 😇'}
            </span>
          </p>
          <p className="text-gray-600 text-center">Your word: <span className="font-semibold text-lg">{myWord}</span></p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 text-center">Vote Results:</h3>
          <div className="space-y-2">
            {players.map(player => {
              const voteCount = voteResults.voteCounts[player.name] || 0;
              const wasImpostor = roomData?.wordAssignments?.[player.id]?.isImpostor;
              return (
                <div key={player.id} className={`flex justify-between items-center p-4 rounded-lg ${
                  wasImpostor ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'
                }`}>
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    {player.name} 
                    {wasImpostor && <span className="text-red-500 text-xl">👺</span>}
                  </span>
                  <span className="text-purple-600 font-bold">{voteCount} votes</span>
                </div>
              );
            })}
          </div>
        </div>

        {isHost ? (
          <button
            onClick={handlePlayAgain}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            Play Again
          </button>
        ) : (
          <div className="text-center text-gray-600 bg-purple-50 p-4 rounded-xl">
            Waiting for host to start a new game...
          </div>
        )}

        <button
          onClick={onPlayAgain}
          className="w-full mt-3 bg-white border-2 border-purple-500 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Vote } from 'lucide-react';
import { ref, onValue, set, update } from 'firebase/database';
import { database } from '../utils/firebase';

export default function VotingScreen({ roomCode, playerName, playerId }) {
  const [roomData, setRoomData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [votes, setVotes] = useState({});
  const [myVote, setMyVote] = useState('');

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomCode}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);
        setPlayers(data.players ? Object.values(data.players) : []);
        setVotes(data.votes || {});
        
        if (data.votes && data.votes[playerId]) {
          setMyVote(data.votes[playerId].votedFor);
        }
      }
    });

    return () => unsubscribe();
  }, [roomCode, playerId]);

  const submitVote = async (votedPlayerId, votedPlayerName) => {
    try {
      await set(ref(database, `rooms/${roomCode}/votes/${playerId}`), {
        voterName: playerName,
        votedFor: votedPlayerName,
        votedForId: votedPlayerId,
        timestamp: Date.now()
      });
      
      setMyVote(votedPlayerName);
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const revealResults = async () => {
    await update(ref(database, `rooms/${roomCode}`), {
      gameState: 'finished'
    });
  };

  const isHost = roomData?.hostId === playerId;
  const allVoted = Object.keys(votes).length === players.length;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Vote className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Voting Time!</h2>
            <p className="text-gray-600 text-lg">Who do you think is the impostor?</p>
          </div>

          <div className="grid gap-3 mb-6">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => submitVote(player.id, player.name)}
                disabled={myVote !== ''}
                className={`p-5 rounded-xl font-semibold text-lg transition-all ${
                  myVote === player.name
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:cursor-not-allowed`}
              >
                {player.name} {myVote === player.name && '✓'}
              </button>
            ))}
          </div>

          <div className="text-center mb-6">
            <div className="inline-block bg-purple-100 px-6 py-3 rounded-full">
              <span className="text-purple-700 font-bold text-lg">
                Votes: {Object.keys(votes).length} / {players.length}
              </span>
            </div>
          </div>

          {isHost && allVoted && (
            <button
              onClick={revealResults}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
            >
              Reveal Results
            </button>
          )}

          {!isHost && allVoted && (
            <div className="text-center text-gray-600 bg-green-50 p-4 rounded-xl">
              ⏳ Waiting for host to reveal results...
            </div>
          )}

          {!allVoted && myVote && (
            <div className="text-center text-gray-600 bg-blue-50 p-4 rounded-xl">
              ⏳ Waiting for other players to vote...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
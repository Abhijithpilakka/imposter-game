import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../utils/firebase';

export default function GameScreen({ roomCode, playerName, playerId }) {
  const [roomData, setRoomData] = useState(null);
  const [myWord, setMyWord] = useState('');
  const [isImpostor, setIsImpostor] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomCode}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);
        
        if (data.wordAssignments && data.wordAssignments[playerId]) {
          setMyWord(data.wordAssignments[playerId].word);
          setIsImpostor(data.wordAssignments[playerId].isImpostor);
        }
        
        setPlayers(data.players ? Object.values(data.players) : []);
      }
    });

    return () => unsubscribe();
  }, [roomCode, playerId]);

  const startVoting = async () => {
    await update(ref(database, `rooms/${roomCode}`), {
      gameState: 'voting'
    });
  };

  const isHost = roomData?.hostId === playerId;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Game In Progress</h2>
              <div className="px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-semibold">
                {players.length} Players
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-8 h-8 ${isImpostor ? 'text-red-500' : 'text-blue-500'} mt-1`} />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {isImpostor ? 'You are the IMPOSTOR!' : 'Your word:'}
                  </h3>
                  <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    {myWord}
                  </p>
                  <p className="text-gray-700 text-lg">
                    {isImpostor 
                      ? '🎭 Blend in! Pretend you know the same word as everyone else.' 
                      : '💬 Discuss your word out loud with the group!'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎮 How to Play:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Take turns describing your word without saying it directly</li>
                <li>• Try to figure out who has a different word</li>
                <li>• The impostor should try to blend in!</li>
                <li>• When ready, the host can start the voting</li>
              </ul>
            </div>

            {isHost && (
              <button
                onClick={startVoting}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg"
              >
                Start Voting Phase
              </button>
            )}

            {!isHost && (
              <div className="text-center text-gray-600 bg-yellow-50 p-4 rounded-xl">
                ⏳ Waiting for host to start voting...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
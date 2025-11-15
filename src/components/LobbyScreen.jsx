import React, { useState, useEffect } from 'react';
import { Users, Crown } from 'lucide-react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../utils/firebase';
import { assignWords } from '../utils/gamelogic';
import { CATEGORIES } from '../utils/constants';

export default function LobbyScreen({ roomCode, playerName, playerId }) {
  const [roomData, setRoomData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('general');

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomCode}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRoomData(data);
        
        const playersList = data.players ? Object.values(data.players) : [];
        setPlayers(playersList);
        
        // Sync category from Firebase
        if (data.category) {
          setSelectedCategory(data.category);
        }
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    await update(ref(database, `rooms/${roomCode}`), {
      category: category
    });
  };

  const startGame = async () => {
    if (players.length < 3) {
      alert('Need at least 3 players to start!');
      return;
    }

    const { randomWord, impostorIndex, impostorWord } = assignWords(players.length, selectedCategory);
    
    const wordAssignments = {};
    players.forEach((player, index) => {
      wordAssignments[player.id] = {
        word: index === impostorIndex ? impostorWord : randomWord,
        isImpostor: index === impostorIndex
      };
    });

    await update(ref(database, `rooms/${roomCode}`), {
      gameState: 'playing',
      wordAssignments,
      votes: {},
      category: selectedCategory
    });
  };

  const isHost = roomData?.hostId === playerId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Waiting Room</h2>
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full text-2xl font-mono font-bold">
              {roomCode}
            </div>
            <p className="text-gray-600 mt-2">Share this code with your friends!</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Players ({players.length})
            </h3>
            <div className="space-y-2">
              {players.map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    index % 3 === 0 ? 'bg-purple-500' : index % 3 === 1 ? 'bg-pink-500' : 'bg-blue-500'
                  }`}>
                    {player.name[0].toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700">{player.name}</span>
                  {player.id === roomData?.hostId && <Crown className="w-5 h-5 text-yellow-500 ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              {isHost ? 'Select Category' : 'Category'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => isHost && handleCategoryChange(category.id)}
                  disabled={!isHost}
                  className={`p-4 rounded-xl font-semibold text-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="text-3xl mb-1">{category.emoji}</div>
                  <div>{category.name}</div>
                </button>
              ))}
            </div>
            {!isHost && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Only the host can change the category
              </p>
            )}
          </div>

          {isHost && (
            <button
              onClick={startGame}
              disabled={players.length < 3}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {players.length < 3 ? 'Need at least 3 players' : 'Start Game'}
            </button>
          )}

          {!isHost && (
            <div className="text-center text-gray-600 bg-purple-50 p-4 rounded-xl">
              Waiting for host to start the game...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
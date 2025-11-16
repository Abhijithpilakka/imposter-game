import React, { useState } from 'react';
import { Users, Plus, LogIn } from 'lucide-react';
import { ref, set, get } from 'firebase/database';
import { database } from '../utils/firebase';
import { generateRoomCode } from '../utils/gamelogic';

export default function HomeScreen({ onRoomCreated, onRoomJoined }) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const code = generateRoomCode();
      const playerId = Date.now().toString();
      
      await set(ref(database, `rooms/${code}`), {
        code,
        host: playerName,
        hostId: playerId,
        players: {
          [playerId]: {
            name: playerName,
            id: playerId,
            joined: Date.now(),
            totalPoints: 0
          }
        },
        gameState: 'lobby',
        category: 'general',
        createdAt: Date.now()
      });

      onRoomCreated(code, playerName, playerId);
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      setError('Please enter your name and room code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const roomRef = ref(database, `rooms/${roomCode.toUpperCase()}`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        setError('Room not found. Check the code and try again.');
        setLoading(false);
        return;
      }

      const roomData = snapshot.val();
      
      if (roomData.gameState !== 'lobby') {
        setError('Game already started. Cannot join.');
        setLoading(false);
        return;
      }

      const playerId = Date.now().toString();
      
      await set(ref(database, `rooms/${roomCode.toUpperCase()}/players/${playerId}`), {
        name: playerName,
        id: playerId,
        joined: Date.now(),
        totalPoints: 0
      });

      onRoomJoined(roomCode.toUpperCase(), playerName, playerId);
    } catch (err) {
      setError('Failed to join room. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform hover:scale-105 transition-transform">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Imposter Challenge
          </h1>
          <p className="text-gray-600">Find the impostor among you!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            disabled={loading}
          />

          <button
            onClick={createRoom}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Room'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors uppercase"
            disabled={loading}
            maxLength={6}
          />

          <button
            onClick={joinRoom}
            disabled={loading}
            className="w-full bg-white border-2 border-purple-500 text-purple-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-purple-50 transition-all disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-8 text-center">
        <p className="text-black/20 text-sm">
          Made with love by{' '}
          <a 
            href="https://linkedin.com/in/abhijithpilakka" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-black/25 transition-colors"
          >
            Abhijith Pilakka
          </a>
        </p>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './utils/firebase';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';
import VotingScreen from './components/VotingScreen';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const [screen, setScreen] = useState('home');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [gameState, setGameState] = useState('lobby');

  useEffect(() => {
    if (roomCode) {
      const roomRef = ref(database, `rooms/${roomCode}`);
      
      const unsubscribe = onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setGameState(data.gameState);
        }
      });

      return () => unsubscribe();
    }
  }, [roomCode]);

  const handleRoomCreated = (code, name, id) => {
    setRoomCode(code);
    setPlayerName(name);
    setPlayerId(id);
    setScreen('lobby');
  };

  const handleRoomJoined = (code, name, id) => {
    setRoomCode(code);
    setPlayerName(name);
    setPlayerId(id);
    setScreen('lobby');
  };

  const handlePlayAgain = () => {
    setScreen('home');
    setRoomCode('');
    setPlayerName('');
    setPlayerId('');
    setGameState('lobby');
  };

  if (screen === 'home') {
    return <HomeScreen onRoomCreated={handleRoomCreated} onRoomJoined={handleRoomJoined} />;
  }

  if (gameState === 'lobby') {
    return <LobbyScreen roomCode={roomCode} playerName={playerName} playerId={playerId} />;
  }

  if (gameState === 'playing') {
    return <GameScreen roomCode={roomCode} playerName={playerName} playerId={playerId} />;
  }

  if (gameState === 'voting') {
    return <VotingScreen roomCode={roomCode} playerName={playerName} playerId={playerId} />;
  }

  if (gameState === 'finished') {
    return <GameOverScreen roomCode={roomCode} playerName={playerName} playerId={playerId} onPlayAgain={handlePlayAgain} />;
  }

  return null;
}

export default App;
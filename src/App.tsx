import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { GameField } from './components/GameField';
import { PlayerList } from './components/PlayerList';
import { LoginForm } from './components/LoginForm';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useRealtimePlayers } from './hooks/useRealtimePlayers';
import { firebaseService } from './services/firebase';
import { GameConfig, Position } from './types/game';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #121212;
  width: 100vw;
`;

const gameConfig: GameConfig = {
  width: 800,
  height: 600,
  playerSize: 16,
  speed: 1
};

function App() {
  const [playerId] = useState(uuidv4());
  const [position, setPosition] = useState<Position>({
    x: Math.floor(Math.random() * (gameConfig.width - gameConfig.playerSize)),
    y: Math.floor(Math.random() * (gameConfig.height - gameConfig.playerSize))
  });
  const [name, setName] = useState<string | null>(null);
  const [color] = useState<string>(`#${Math.floor(Math.random()*16777215).toString(16)}`);

  const players = useRealtimePlayers(playerId);

  usePlayerMovement(playerId, position, setPosition, gameConfig);

  useEffect(() => {
    if (!name) return;
    firebaseService.addPlayer({
      id: playerId,
      x: position.x,
      y: position.y,
      color,
      name
    });
  }, [playerId, name]);

  if (!name) {
    return (
      <Container>
        <LoginForm onSubmit={setName} />
      </Container>
    );
  }

  return (
    <Container>
      <GameField players={players} config={gameConfig} />
      <PlayerList players={players} />
    </Container>
  );
}

export default App; 
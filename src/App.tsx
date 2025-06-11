import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { GameField } from './components/GameField';
import { PlayerList } from './components/PlayerList';
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
  playerSize: 4,
  speed: 1
};

function App() {
  const [playerId] = useState(uuidv4());
  const [position, setPosition] = useState<Position>({
    x: Math.floor(Math.random() * (gameConfig.width - gameConfig.playerSize)),
    y: Math.floor(Math.random() * (gameConfig.height - gameConfig.playerSize))
  });

  const players = useRealtimePlayers(playerId);

  usePlayerMovement(playerId, position, setPosition, gameConfig);

  useEffect(() => {
    // Генерируем случайный цвет для игрока
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    
    // Добавляем игрока при монтировании компонента
    firebaseService.addPlayer({
      id: playerId,
      x: position.x,
      y: position.y,
      color: randomColor,
      name: `Player ${playerId.slice(0, 4)}`
    });
  }, [playerId]);

  return (
    <Container>
      <GameField players={players} config={gameConfig} />
      <PlayerList players={players} />
    </Container>
  );
}

export default App; 
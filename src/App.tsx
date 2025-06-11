import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { GameField } from './components/GameField';
import { PlayerList } from './components/PlayerList';
import { LoginForm } from './components/LoginForm';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useRealtimePlayers } from './hooks/useRealtimePlayers';
import { useRealtimeFood } from './hooks/useRealtimeFood';
import { firebaseService } from './services/firebase';
import { GameConfig, Position, Food } from './types/game';

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
  speed: 4
};

function getRandomFood(config: GameConfig): Food {
  return {
    id: uuidv4(),
    x: Math.floor(Math.random() * (config.width - config.playerSize)),
    y: Math.floor(Math.random() * (config.height - config.playerSize)),
  };
}

function App() {
  const [playerId] = useState(uuidv4());
  const [position, setPosition] = useState<Position>({
    x: Math.floor(Math.random() * (gameConfig.width - gameConfig.playerSize)),
    y: Math.floor(Math.random() * (gameConfig.height - gameConfig.playerSize))
  });
  const [name, setName] = useState<string | null>(null);
  const [color] = useState<string>(`#${Math.floor(Math.random()*16777215).toString(16)}`);
  const [initialized, setInitialized] = useState(false);

  const players = useRealtimePlayers(playerId);
  const food = useRealtimeFood();

  usePlayerMovement(playerId, position, setPosition, gameConfig);

  // Генерируем food только если их нет при старте
  useEffect(() => {
    firebaseService.getAllFood().then(existing => {
      if (!existing || existing.length === 0) {
        for (let i = 0; i < 10; i++) {
          firebaseService.addFood(getRandomFood(gameConfig));
        }
      }
    });
  }, []);

  // Если все food исчезли — сгенерировать новые
  useEffect(() => {
    if (Object.keys(food).length === 0) {
      for (let i = 0; i < 10; i++) {
        firebaseService.addFood(getRandomFood(gameConfig));
      }
    }
  }, [food]);

  useEffect(() => {
    if (!name || initialized) return;
    firebaseService.addPlayer({
      id: playerId,
      x: position.x,
      y: position.y,
      color,
      name,
      score: 0
    });
    setInitialized(true);
    // eslint-disable-next-line
  }, [playerId, name]);

  // Обработка сбора точки
  const handleCollectFood = (foodId: string) => {
    // Удаляем точку
    firebaseService.removeFood(foodId);
    // +1 очко игроку
    const currentScore = players[playerId]?.score ?? 0;
    firebaseService.updatePlayerScore(playerId, currentScore + 1);
  };

  if (!name) {
    return (
      <Container>
        <LoginForm onSubmit={setName} />
      </Container>
    );
  }

  return (
    <Container>
      <GameField
        players={players}
        config={gameConfig}
        food={food}
        onCollectFood={handleCollectFood}
        playerId={playerId}
      />
      <PlayerList players={players} />
    </Container>
  );
}

export default App; 
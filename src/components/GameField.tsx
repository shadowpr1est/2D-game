import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Player, GameConfig, Food } from '../types/game';

const Canvas = styled.canvas`
  background-color: #1a1a1a;
  border: 1px solid #333;
`;

interface GameFieldProps {
  players: Record<string, Player>;
  config: GameConfig;
  food?: Record<string, Food>;
  onCollectFood?: (foodId: string) => void;
  playerId?: string;
}

export const GameField = ({ players, config, food, onCollectFood, playerId }: GameFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очищаем поле
    ctx.clearRect(0, 0, config.width, config.height);

    // Отрисовываем food (точки)
    if (food) {
      Object.values(food).forEach((f) => {
        ctx.fillStyle = '#FFD600';
        ctx.beginPath();
        ctx.arc(f.x + config.playerSize / 2, f.y + config.playerSize / 2, config.playerSize / 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Отрисовываем всех игроков
    Object.values(players).forEach((player) => {
      ctx.fillStyle = player.color;
      ctx.fillRect(
        player.x,
        player.y,
        config.playerSize,
        config.playerSize
      );
    });
  }, [players, config, food]);

  // Проверка сбора точки
  useEffect(() => {
    if (!food || !playerId) return;
    const player = players[playerId];
    if (!player) return;
    Object.values(food).forEach((f) => {
      const dx = player.x - f.x;
      const dy = player.y - f.y;
      if (Math.abs(dx) < config.playerSize && Math.abs(dy) < config.playerSize) {
        onCollectFood && onCollectFood(f.id);
      }
    });
  }, [players, food, playerId, config, onCollectFood]);

  return (
    <Canvas
      ref={canvasRef}
      width={config.width}
      height={config.height}
    />
  );
}; 
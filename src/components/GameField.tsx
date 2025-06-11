import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Player, GameConfig } from '../types/game';

const Canvas = styled.canvas`
  background-color: #1a1a1a;
  border: 1px solid #333;
`;

interface GameFieldProps {
  players: Record<string, Player>;
  config: GameConfig;
}

export const GameField = ({ players, config }: GameFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очищаем поле
    ctx.clearRect(0, 0, config.width, config.height);

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
  }, [players, config]);

  return (
    <Canvas
      ref={canvasRef}
      width={config.width}
      height={config.height}
    />
  );
}; 
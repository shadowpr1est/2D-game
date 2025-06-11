import { useEffect, useRef } from 'react';
import { GameConfig, Position } from '../types/game';
import { firebaseService } from '../services/firebase';

export const usePlayerMovement = (
  playerId: string,
  position: Position,
  setPosition: (pos: Position) => void,
  config: GameConfig
) => {
  const pressedKeys = useRef<Set<string>>(new Set());
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.current.add(e.key.toLowerCase());
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const keys = pressedKeys.current;
      let { x, y } = positionRef.current;
      let moved = false;
      if (keys.has('w')) {
        y = Math.max(0, y - config.speed);
        moved = true;
      }
      if (keys.has('s')) {
        y = Math.min(config.height - config.playerSize, y + config.speed);
        moved = true;
      }
      if (keys.has('a')) {
        x = Math.max(0, x - config.speed);
        moved = true;
      }
      if (keys.has('d')) {
        x = Math.min(config.width - config.playerSize, x + config.speed);
        moved = true;
      }
      if (moved && (x !== positionRef.current.x || y !== positionRef.current.y)) {
        setPosition({ x, y });
        firebaseService.updatePlayerPosition(playerId, x, y);
      }
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, [playerId, setPosition, config]);
}; 
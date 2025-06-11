import { useEffect, useCallback } from 'react';
import { GameConfig, Position } from '../types/game';
import { firebaseService } from '../services/firebase';

export const usePlayerMovement = (
  playerId: string,
  position: Position,
  setPosition: (pos: Position) => void,
  config: GameConfig
) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      let newX = position.x;
      let newY = position.y;

      switch (e.key.toLowerCase()) {
        case 'w':
          newY = Math.max(0, position.y - config.speed);
          break;
        case 's':
          newY = Math.min(config.height - config.playerSize, position.y + config.speed);
          break;
        case 'a':
          newX = Math.max(0, position.x - config.speed);
          break;
        case 'd':
          newX = Math.min(config.width - config.playerSize, position.x + config.speed);
          break;
        default:
          return;
      }

      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
        firebaseService.updatePlayerPosition(playerId, newX, newY);
      }
    },
    [playerId, position, setPosition, config]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
}; 
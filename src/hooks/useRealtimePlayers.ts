import { useEffect, useState } from 'react';
import { Player } from '../types/game';
import { firebaseService } from '../services/firebase';

export const useRealtimePlayers = (currentPlayerId: string) => {
  const [players, setPlayers] = useState<Record<string, Player>>({});

  useEffect(() => {
    const handlePlayerAdded = (player: Player) => {
      setPlayers((prev) => ({
        ...prev,
        [player.id]: player,
      }));
    };

    const handlePlayerRemoved = (playerId: string) => {
      setPlayers((prev) => {
        const newPlayers = { ...prev };
        delete newPlayers[playerId];
        return newPlayers;
      });
    };

    const handlePlayerChanged = (player: Player) => {
      setPlayers((prev) => ({
        ...prev,
        [player.id]: player,
      }));
    };

    firebaseService.onPlayerAdded(handlePlayerAdded);
    firebaseService.onPlayerRemoved(handlePlayerRemoved);
    firebaseService.onPlayerChanged(handlePlayerChanged);

    return () => {
      // Firebase автоматически отписывается при размонтировании компонента
    };
  }, []);

  return players;
}; 
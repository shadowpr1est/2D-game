import styled from 'styled-components';
import { Player } from '../types/game';

const List = styled.div`
  background-color: #2a2a2a;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  width: 200px;
`;

const PlayerItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #fff;
`;

const ColorSquare = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
`;

interface PlayerListProps {
  players: Record<string, Player>;
}

export const PlayerList = ({ players }: PlayerListProps) => {
  return (
    <List>
      <h3 style={{ color: '#fff', marginTop: 0 }}>Active Players</h3>
      {Object.values(players).map((player) => (
        <PlayerItem key={player.id}>
          <ColorSquare color={player.color} />
          <span>{player.name}</span>
        </PlayerItem>
      ))}
    </List>
  );
}; 
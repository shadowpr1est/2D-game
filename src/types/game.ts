export interface Player {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

export interface GameConfig {
  width: number;
  height: number;
  playerSize: number;
  speed: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
} 
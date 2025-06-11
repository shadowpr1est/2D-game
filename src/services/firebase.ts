import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onDisconnect, onChildAdded, onChildRemoved, onChildChanged, set, update, Database } from 'firebase/database';
import { Player } from '../types/game';

const firebaseConfig = {
  apiKey: "AIzaSyCKMi-NxvOfll1SIXNWfrGVxS3S8FyiqII",
  authDomain: "d-game-cea42.firebaseapp.com",
  projectId: "d-game-cea42",
  storageBucket: "d-game-cea42.firebasestorage.app",
  messagingSenderId: "753840452511",
  appId: "1:753840452511:web:bc7dc8d174198a0fcc43aa",
  measurementId: "G-MF3T8L64E1"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export class FirebaseService {
  private db: Database;
  private playersRef;

  constructor() {
    this.db = database;
    this.playersRef = ref(this.db, 'players');
  }

  addPlayer(player: Player): void {
    const playerRef = ref(this.db, `players/${player.id}`);
    set(playerRef, player);
    onDisconnect(playerRef).remove();
  }

  updatePlayerPosition(playerId: string, x: number, y: number): void {
    const playerRef = ref(this.db, `players/${playerId}`);
    update(playerRef, { x, y });
  }

  onPlayerAdded(callback: (player: Player) => void): void {
    onChildAdded(this.playersRef, (snapshot) => {
      callback(snapshot.val() as Player);
    });
  }

  onPlayerRemoved(callback: (playerId: string) => void): void {
    onChildRemoved(this.playersRef, (snapshot) => {
      callback(snapshot.key as string);
    });
  }

  onPlayerChanged(callback: (player: Player) => void): void {
    onChildChanged(this.playersRef, (snapshot) => {
      callback(snapshot.val() as Player);
    });
  }
}

export const firebaseService = new FirebaseService(); 
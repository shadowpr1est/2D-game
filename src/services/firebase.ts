import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onDisconnect, onChildAdded, onChildRemoved, onChildChanged, set, update, Database } from 'firebase/database';
import { Player } from '../types/game';

const firebaseConfig = {
  // Замените на ваши данные из Firebase Console
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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
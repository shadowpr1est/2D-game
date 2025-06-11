import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onDisconnect, onChildAdded, onChildRemoved, onChildChanged, set, update, remove, Database, push, get } from 'firebase/database';
import { Player, Food } from '../types/game';

const firebaseConfig = {
  apiKey: "AIzaSyCKMi-NxvOfll1SIXNWfrGVxS3S8FyiqII",
  authDomain: "d-game-cea42.firebaseapp.com",
  databaseURL: "https://d-game-cea42-default-rtdb.asia-southeast1.firebasedatabase.app",
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
  private foodRef;

  constructor() {
    this.db = database;
    this.playersRef = ref(this.db, 'players');
    this.foodRef = ref(this.db, 'food');
  }

  addPlayer(player: Player): void {
    const playerRef = ref(this.db, `players/${player.id}`);
    set(playerRef, player)
      .then(() => console.log('Player added to Firebase:', player))
      .catch((err) => console.error('Firebase write error:', err));
    onDisconnect(playerRef).remove();
  }

  updatePlayerPosition(playerId: string, x: number, y: number): void {
    const playerRef = ref(this.db, `players/${playerId}`);
    update(playerRef, { x, y });
  }

  updatePlayerScore(playerId: string, score: number): void {
    const playerRef = ref(this.db, `players/${playerId}`);
    update(playerRef, { score });
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

  // --- FOOD ---
  addFood(food: Food): void {
    set(ref(this.db, `food/${food.id}`), food);
  }

  removeFood(foodId: string): void {
    remove(ref(this.db, `food/${foodId}`));
  }

  onFoodAdded(callback: (food: Food) => void): void {
    onChildAdded(this.foodRef, (snapshot) => {
      callback(snapshot.val() as Food);
    });
  }

  onFoodRemoved(callback: (foodId: string) => void): void {
    onChildRemoved(this.foodRef, (snapshot) => {
      callback(snapshot.key as string);
    });
  }

  getAllFood(): Promise<Food[]> {
    return get(this.foodRef).then(snap => {
      const val = snap.val();
      if (!val) return [];
      return Object.values(val) as Food[];
    });
  }
}

export const firebaseService = new FirebaseService(); 
# Multiplayer 2D Game

A real-time multiplayer 2D game built with React, TypeScript, and Firebase.

## Features

- Real-time player movement synchronization
- Multiple players support
- WASD controls
- Player list with colors
- Collision detection with game boundaries

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable Realtime Database
4. Copy your Firebase configuration to `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

## Controls

- W: Move up
- A: Move left
- S: Move down
- D: Move right

## Technical Stack

- React
- TypeScript
- Firebase Realtime Database
- Vite
- Styled Components

## Project Structure

```
/src
├─ components/
│  ├─ GameField.tsx    # Canvas rendering
│  └─ PlayerList.tsx   # Active players list
├─ hooks/
│  ├─ usePlayerMovement.ts    # WASD controls
│  └─ useRealtimePlayers.ts   # Firebase sync
├─ services/
│  └─ firebase.ts      # Firebase configuration
├─ types/
│  └─ game.ts          # TypeScript types
└─ App.tsx             # Main component
```

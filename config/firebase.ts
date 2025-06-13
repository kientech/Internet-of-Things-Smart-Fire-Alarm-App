import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Cloud Firestore and get a reference to the service
export const firestore = getFirestore(app);

// Database structure
export const DB_STRUCTURE = {
    // Realtime Database paths
    REALTIME: {
        SENSORS: {
            GAS: 'sensors/gas',
            FIRE: 'sensors/fire',
            TEMPERATURE: 'sensors/temperature',
            HUMIDITY: 'sensors/humidity',
            BUZZER: 'sensors/buzzer',
        },
        SYSTEM: {
            STATUS: 'system/status',
            BATTERY: 'system/battery',
            LAST_UPDATE: 'system/lastUpdate',
        }
    },
    // Firestore collections
    FIRESTORE: {
        HISTORY: {
            GAS: 'history/gas',
            FIRE: 'history/fire',
            TEMPERATURE: 'history/temperature',
            HUMIDITY: 'history/humidity',
            ALARMS: 'history/alarms',
        }
    }
};

// Data types
export interface SensorData {
    value: number;
    timestamp: number;
    status: 'normal' | 'warning' | 'danger';
    location: string;
    batteryLevel: number;
}

export interface AlarmData {
    type: 'gas' | 'fire' | 'temperature';
    value: number;
    timestamp: number;
    status: 'active' | 'resolved';
    location: string;
    resolvedAt?: number;
    resolvedBy?: string;
}

export interface SystemStatus {
    isOnline: boolean;
    lastUpdate: number;
    batteryLevel: number;
    firmwareVersion: string;
    signalStrength: number;
} 
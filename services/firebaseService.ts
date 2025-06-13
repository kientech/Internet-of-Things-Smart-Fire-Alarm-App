import { ref, onValue, set, push, serverTimestamp } from 'firebase/database';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { database, firestore, DB_STRUCTURE, SensorData, AlarmData, SystemStatus } from '../config/firebase';

class FirebaseService {
    // Realtime Database listeners
    private listeners: { [key: string]: () => void } = {};

    // Subscribe to real-time sensor data
    subscribeToSensorData(
        sensorType: keyof typeof DB_STRUCTURE.REALTIME.SENSORS,
        callback: (data: SensorData) => void
    ) {
        const sensorRef = ref(database, DB_STRUCTURE.REALTIME.SENSORS[sensorType]);

        const unsubscribe = onValue(sensorRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                callback(data as SensorData);
            }
        });

        this.listeners[sensorType] = unsubscribe;
        return unsubscribe;
    }

    // Subscribe to system status
    subscribeToSystemStatus(callback: (status: SystemStatus) => void) {
        const statusRef = ref(database, DB_STRUCTURE.REALTIME.SYSTEM.STATUS);

        const unsubscribe = onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                callback(data as SystemStatus);
            }
        });

        this.listeners['system'] = unsubscribe;
        return unsubscribe;
    }

    // Save sensor data to history in Firestore
    async saveSensorHistory(
        sensorType: keyof typeof DB_STRUCTURE.FIRESTORE.HISTORY,
        data: SensorData
    ) {
        try {
            const historyRef = collection(firestore, DB_STRUCTURE.FIRESTORE.HISTORY[sensorType]);
            await addDoc(historyRef, {
                ...data,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error saving sensor history:', error);
        }
    }

    // Save alarm to history
    async saveAlarmHistory(alarmData: AlarmData) {
        try {
            const alarmsRef = collection(firestore, DB_STRUCTURE.FIRESTORE.HISTORY.ALARMS);
            await addDoc(alarmsRef, {
                ...alarmData,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error saving alarm history:', error);
        }
    }

    // Get sensor history
    async getSensorHistory(
        sensorType: keyof typeof DB_STRUCTURE.FIRESTORE.HISTORY,
        limit: number = 100
    ) {
        try {
            const historyRef = collection(firestore, DB_STRUCTURE.FIRESTORE.HISTORY[sensorType]);
            const q = query(historyRef, orderBy('timestamp', 'desc'), limit(limit));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting sensor history:', error);
            return [];
        }
    }

    // Update system status
    async updateSystemStatus(status: Partial<SystemStatus>) {
        try {
            const statusRef = ref(database, DB_STRUCTURE.REALTIME.SYSTEM.STATUS);
            await set(statusRef, {
                ...status,
                lastUpdate: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating system status:', error);
        }
    }

    // Cleanup all listeners
    cleanup() {
        Object.values(this.listeners).forEach(unsubscribe => unsubscribe());
        this.listeners = {};
    }
}

export const firebaseService = new FirebaseService(); 
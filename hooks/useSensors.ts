import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database, SensorData } from "../config/firebase";

export function useSensors() {
    const [sensors, setSensors] = useState<{ [key: string]: SensorData | null }>({});

    useEffect(() => {
        const sensorsRef = ref(database, "sensors");
        const unsubscribe = onValue(sensorsRef, (snapshot) => {
            setSensors(snapshot.val() || {});
        });
        return () => unsubscribe();
    }, []);

    return sensors;
} 
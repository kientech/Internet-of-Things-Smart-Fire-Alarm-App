import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  Bars3BottomLeftIcon,
  MagnifyingGlassIcon,
  BellIcon,
} from "react-native-heroicons/outline";
import WeatherCard from "./components/WeatherCard";
import SensorCard from "./components/SensorCard";
import { useState, useEffect, useRef } from "react";
import { useSensors } from "./hooks/useSensors";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./utils/notifications";
import {
  getGasStatus,
  getTemperatureStatus,
  getFireStatus,
} from "./utils/sensorStatus";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function App() {
  const sensors = useSensors();
  const [greeting, setGreeting] = useState(getGreeting());
  const [search, setSearch] = useState("");
  const [filteredSensors, setFilteredSensors] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // Trạng thái đã gửi thông báo để tránh gửi lặp lại
  const sentAlertRef = useRef({ temp: false, gas: false, fire: false });

  // Danh sách các loại cảm biến có thể hiển thị
  const sensorKeys = ["gas", "fire", "buzzer"];
  useEffect(() => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification",
        body: "This is a test notification!",
      },
      trigger: null,
    });
  }, []);
  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredSensors(sensorKeys);
    } else {
      const lower = search.toLowerCase();
      setFilteredSensors(sensorKeys.filter((key) => key.includes(lower)));
    }
  }, [search, sensors]);

  // Đăng ký nhận thông báo đẩy
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // Gửi thông báo khi có sự kiện nguy hiểm
  useEffect(() => {
    if (!sensors) return;
    console.log("🚀 ~ useEffect ~ sensors:", sensors?.fire?.value);
    // Nhiệt độ quá cao
    if (
      sensors?.temperature &&
      typeof sensors?.temperature.value === "number" &&
      sensors?.temperature.value > 50
    ) {
      if (!sentAlertRef.current.temp) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "High Temperature Alert!",
            body: `Temperature is ${sensors.temperature.value}°C!`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
          },
          trigger: null,
        });
        sentAlertRef.current.temp = true;
      }
    } else {
      sentAlertRef.current.temp = false;
    }
    // Nồng độ khí gas nguy hiểm
    if (
      sensors?.gas &&
      typeof sensors?.gas.value === "number" &&
      sensors?.gas.value > 800
    ) {
      if (!sentAlertRef.current.gas) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Gas Leak Detected!",
            body: `Gas concentration is ${sensors.gas.value} ppm!`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
          },
          trigger: null,
        });
        sentAlertRef.current.gas = true;
      }
    } else {
      sentAlertRef.current.gas = false;
    }
    // Phát hiện cháy
    if (
      sensors?.fire &&
      typeof sensors?.fire.value === "number" &&
      sensors?.fire.value > 0
    ) {
      if (!sentAlertRef.current.fire) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Fire Detected!",
            body: "Fire sensor has detected a fire!",
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
          },
          trigger: null,
        });
        sentAlertRef.current.fire = true;
      }
    } else {
      sentAlertRef.current.fire = false;
    }
  }, [sensors]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="py-4 px-6">
        <View className="flex-row items-center justify-between">
          <Bars3BottomLeftIcon size={24} color="#374151" />
          <View className="flex-row items-center gap-x-2">
            <Text className="font-semibold text-xl">Smart Fire Alarm</Text>
            <BellIcon size={20} color="#374151" />
          </View>
          <TouchableOpacity onPress={() => setShowSearch((v) => !v)}>
            <MagnifyingGlassIcon size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {showSearch && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
              marginTop: 16,
              marginBottom: 8,
              paddingHorizontal: 12,
            }}
          >
            <MagnifyingGlassIcon
              size={20}
              color="#9ca3af"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Search sensor name (e.g. gas, fire, ...)..."
              value={search}
              onChangeText={setSearch}
              style={{
                flex: 1,
                fontSize: 16,
                paddingVertical: 10,
                color: "#111827",
              }}
              placeholderTextColor="#9ca3af"
              autoFocus
            />
          </View>
        )}

        <View className="mt-4 flex-row items-center gap-x-2">
          <Text className="text-gray-800 text-lg font-semibold">
            {greeting},
          </Text>
          <Text className="text-orange-600 text-lg font-semibold">
            Kien Duong Trung
          </Text>
        </View>

        <WeatherCard
          temperature={sensors.temperature?.value ?? 0}
          humidity={sensors.humidity?.value ?? 0}
        />

        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-800 text-lg font-semibold">
              Sensor Status
            </Text>
            <Text className="text-orange-600 text-sm">View All</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredSensors.map((key) => {
              const sensorType = key as "gas" | "fire" | "buzzer";
              const sensorValue =
                sensors[key]?.value ?? (key === "buzzer" ? false : 0);
              const sensorStatus =
                key === "gas"
                  ? getGasStatus(sensors.gas?.value ?? 0)
                  : key === "fire"
                  ? getFireStatus(sensors.fire?.value ?? 0)
                  : "normal";

              return (
                <SensorCard
                  key={key}
                  type={sensorType}
                  value={sensorValue}
                  status={sensorStatus}
                  lastUpdate={
                    sensors[key]?.timestamp
                      ? new Date(sensors[key].timestamp * 1000).toLocaleString()
                      : "-"
                  }
                  threshold={
                    key === "gas" ? 500 : key === "fire" ? 1 : undefined
                  }
                  location={sensors[key]?.location}
                  batteryLevel={sensors[key]?.batteryLevel}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

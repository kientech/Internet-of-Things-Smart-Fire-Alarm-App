import { View } from "react-native";
import { Text } from "react-native";
import {
  FireIcon,
  BeakerIcon,
  BellAlertIcon,
  ChartBarIcon,
  ClockIcon,
  Battery100Icon,
} from "react-native-heroicons/solid";
import StatusBadge from "./StatusBadge";

interface SensorCardProps {
  type: "gas" | "fire" | "buzzer";
  value: number | boolean;
  status: "normal" | "warning" | "danger";
  lastUpdate: string;
  threshold?: number;
  location?: string;
  batteryLevel?: number;
  history?: { value: number; timestamp: string }[];
}

export default function SensorCard({
  type,
  value,
  status,
  lastUpdate,
  threshold,
  location,
  batteryLevel,
  history,
}: SensorCardProps) {
  const getIcon = () => {
    switch (type) {
      case "gas":
        return <BeakerIcon size={32} color={getStatusColor()} />;
      case "fire":
        return <FireIcon size={32} color={getStatusColor()} />;
      case "buzzer":
        return <BellAlertIcon size={32} color={getStatusColor()} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return "#22c55e";
      case "warning":
        return "#eab308";
      case "danger":
        return "#ef4444";
    }
  };

  const getTitle = () => {
    switch (type) {
      case "gas":
        return "Gas Sensor";
      case "fire":
        return "Fire Sensor";
      case "buzzer":
        return "Alarm Buzzer";
    }
  };

  const getValue = () => {
    if (type === "buzzer") {
      return value ? "Active" : "Inactive";
    }
    return `${value}${type === "gas" ? " ppm" : ""}`;
  };

  const getDescription = () => {
    if (type === "gas") {
      if (status === "normal") return "Gas concentration is within safe limits";
      if (status === "warning") return "Gas concentration is increasing";
      return "Gas concentration exceeds safety threshold!";
    }
    if (type === "fire") {
      if (status === "normal") return "No fire detected";
      if (status === "warning") return "Unusual temperature detected";
      return "Fire detected! Immediate attention required!";
    }
    if (type === "buzzer") {
      if (status === "normal") return "Alarm system operating normally";
      if (status === "warning") return "Alarm system under maintenance";
      return "Emergency alarm is active!";
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-x-3">
          {getIcon()}
          <View>
            <Text className="text-gray-800 font-semibold text-lg">
              {getTitle()}
            </Text>
            {location && (
              <Text className="text-gray-500 text-sm">{location}</Text>
            )}
          </View>
        </View>
        <Text className="text-gray-600 font-medium text-lg">{getValue()}</Text>
      </View>

      <View className="mb-3">
        <StatusBadge
          status={status}
          lastUpdate={lastUpdate}
          description={getDescription()}
        />
      </View>

      <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
        {threshold && (
          <View className="flex-row items-center gap-x-1">
            <ChartBarIcon size={16} color="#6b7280" />
            <Text className="text-gray-500 text-sm">
              Threshold: {threshold}
              {type === "gas" ? " ppm" : ""}
            </Text>
          </View>
        )}
        {batteryLevel !== undefined && (
          <View className="flex-row items-center gap-x-1">
            <Battery100Icon
              size={16}
              color={batteryLevel > 20 ? "#22c55e" : "#ef4444"}
            />
            <Text
              className={`text-sm ${
                batteryLevel > 20 ? "text-green-500" : "text-red-500"
              }`}
            >
              {batteryLevel}%
            </Text>
          </View>
        )}
        {history && history.length > 0 && (
          <View className="flex-row items-center gap-x-1">
            <ClockIcon size={16} color="#6b7280" />
            <Text className="text-gray-500 text-sm">
              {history.length} updates
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

import { View } from "react-native";
import { Text } from "react-native";
import { CloudIcon, SunIcon } from "react-native-heroicons/solid";

interface WeatherCardProps {
  temperature: number;
  humidity: number;
}

export default function WeatherCard({
  temperature,
  humidity,
}: WeatherCardProps) {
  return (
    <View className="mt-8 flex-row justify-between">
      {/* Temperature Card */}
      <View className="bg-orange-100 rounded-2xl p-4 w-[48%] ">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-500 text-md font-semibold mb-2">
              Temperature
            </Text>
            <Text className="text-2xl font-bold text-orange-600">
              {temperature}°C
            </Text>
          </View>
          <SunIcon size={40} color="#ea580c" />
        </View>
      </View>

      {/* Humidity Card */}
      <View className="bg-blue-100 rounded-2xl p-4 w-[48%]">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-500 text-md font-semibold mb-2">
              Humidity
            </Text>
            <Text className="text-2xl font-bold text-blue-600">
              {humidity}%
            </Text>
          </View>
          <CloudIcon size={40} color="#2563eb" />
        </View>
      </View>
    </View>
  );
}

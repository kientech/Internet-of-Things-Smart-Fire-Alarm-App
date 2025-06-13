import { View, StyleSheet } from "react-native";
import { Text } from "react-native";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";

interface StatusBadgeProps {
  status: "normal" | "warning" | "danger";
  lastUpdate?: string;
  description?: string;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    marginRight: 0,
  },
});

export default function StatusBadge({
  status,
  lastUpdate,
  description,
}: StatusBadgeProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === "danger") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return { backgroundColor: "#dcfce7", borderColor: "#bbf7d0" };
      case "warning":
        return { backgroundColor: "#fef9c3", borderColor: "#fef08a" };
      case "danger":
        return { backgroundColor: "#fee2e2", borderColor: "#fecaca" };
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case "normal":
        return { color: "#166534" };
      case "warning":
        return { color: "#854d0e" };
      case "danger":
        return { color: "#991b1b" };
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "normal":
        return "Normal";
      case "warning":
        return "Warning";
      case "danger":
        return "Danger";
    }
  };

  return (
    <View>
      <View style={styles.row}>
        <Animated.View
          style={[
            styles.badge,
            getStatusColor(),
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text
            style={[{ fontWeight: "500", fontSize: 14 }, getStatusTextColor()]}
          >
            {getStatusText()}
          </Text>
        </Animated.View>
        {lastUpdate && (
          <Text className="text-gray-500 text-xs">Updated: {lastUpdate}</Text>
        )}
      </View>
      {description && (
        <Text className="text-gray-800 font-semibold text-md mt-2">
          {description}
        </Text>
      )}
    </View>
  );
}

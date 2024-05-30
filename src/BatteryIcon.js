import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const BatteryIcon = ({ size, batteryPercentage }) => {
  // Calculate the width of the battery icon based on battery percentage
  const batteryWidth = (batteryPercentage / 100) * (size * 0.7);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: size * 0.7,
          height: size * 0.4,
          backgroundColor: "#F7FC03",
          borderRadius: 3,
          borderWidth: 1,
          borderColor: "#fff",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            height: size * 0.33,
            width: batteryWidth,
          }}
        />
      </View>
      <Text
        style={{
          color: "#fff",
          fontSize: size * 0.6,
          fontWeight: "bold",
          marginLeft: 5,
        }}
      >
        {batteryPercentage}%
      </Text>
    </View>
  );
};

export default BatteryIcon;

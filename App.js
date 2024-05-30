import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Dashboard from "./src/Dashboard";
import LoginPopup from "./src/LoginPopup";
import FileSettingsPopup from "./src/FileSettingsPopup";
import BluetoothScreen from "./src/BluetoothScreen"; // Adjust the path as needed
import NodeConfigScreen from "./src/NodeConfigScreen";

const Stack = createStackNavigator();

const FileSettingsPopupWrapper = ({ route, navigation }) => {
  const { onClose } = route.params;
  return <FileSettingsPopup navigation={navigation} onClose={onClose} />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginPopup"
              component={LoginPopup}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FileSettingsPopup"
              component={FileSettingsPopupWrapper}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BluetoothScreen"
              component={BluetoothScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NodeConfigScreen"
              component={NodeConfigScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </GestureHandlerRootView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

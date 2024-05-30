import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import BleManager from "react-native-ble-manager";
import { NativeEventEmitter, NativeModules } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

const BluetoothScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize BLE manager
    BleManager.start({ showAlert: false })
      .then(() => console.log("Bluetooth initialized"))
      .catch((error) => console.error("Bluetooth initialization error", error));

    const handleDiscover = (device) => {
      console.log("Discovered device:", device);
      setDevices((prevDevices) => [...prevDevices, device]);
    };

    const handleStopScan = () => {
      console.log("Scan stopped");
      setScanning(false);
    };

    const handleUpdateState = (args) => {
      console.log("BLE state updated:", args.state);
    };

    const discoverSubscription = bleManagerEmitter.addListener(
      "BleManagerDiscoverPeripheral",
      handleDiscover
    );
    const stopScanSubscription = bleManagerEmitter.addListener(
      "BleManagerStopScan",
      handleStopScan
    );
    const updateStateSubscription = bleManagerEmitter.addListener(
      "BleManagerDidUpdateState",
      handleUpdateState
    );

    return () => {
      discoverSubscription.remove();
      stopScanSubscription.remove();
      updateStateSubscription.remove();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const results = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(results).every(
          (result) => result === PermissionsAndroid.RESULTS.GRANTED
        );
        return allGranted;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // Assume permissions are granted for iOS
    }
  };

  const toggleScan = async () => {
    const permissionsGranted = await requestPermissions();
    if (permissionsGranted) {
      if (!scanning) {
        BleManager.scan([], 10, true) // Scan for 10 seconds
          .then(() => {
            console.log("Scan started");
            setScanning(true);
          })
          .catch((error) => console.error("Scan error", error));
      } else {
        BleManager.stopScan()
          .then(() => {
            console.log("Scan stopped");
            setScanning(false);
          })
          .catch((error) => console.error("Scan error", error));
      }
    } else {
      Alert.alert("Permission Denied", "Required permissions are not granted.");
    }
  };

  const connectToDevice = (device) => {
    BleManager.connect(device.id)
      .then(() => {
        console.log(`Connected to ${device.name}`);
      })
      .catch((error) => console.error("Connection error", error));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={{ marginLeft: 10, fontSize: 18 }}>Bluetooth Screen</Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title={scanning ? "Stop Scan" : "Start Scan"}
          onPress={toggleScan}
        />
        <Text>{scanning ? "Scanning..." : "Not scanning"}</Text>
        {devices.map((device, index) => (
          <Button
            key={index}
            title={`Connect to ${device.name || "Unknown"}`}
            onPress={() => connectToDevice(device)}
          />
        ))}
      </View>
    </View>
  );
};

export default BluetoothScreen;

import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  PermissionsAndroid,
  TouchableOpacity,
  Platform,
} from "react-native";
import BleManager from "react-native-ble-manager";
import { Buffer } from "buffer";
import { useNavigation } from "@react-navigation/native";
import { IconButton, useTheme, MD3Colors } from "react-native-paper";
import { BleContext } from "./ContextApi/BleContext";

const serviceid = "12345678-1234-1234-1234-123456789012";
const node1 = "12348765-8765-4321-8765-123456789012";

const BluetoothBLETerminal = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  const {
    setBleData,
    setSelectedDevice,
    selectedDevice,
    isConnected,
    setIsConnected,
  } = useContext(BleContext);
  const [paired, setPaired] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const { colors } = useTheme();

  const checkBluetoothEnabled = async () => {
    try {
      await BleManager.enableBluetooth();
      console.log("Bluetooth is turned on!");
    } catch (error) {
      console.error("BLE is not available on this device.");
    }
  };

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log("Scanning...");
          setIsScanning(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const startDeviceDiscovery = async () => {
    try {
      const bondedPeripheralsArray = await BleManager.getBondedPeripherals();
      console.log("Bonded peripherals: " + bondedPeripheralsArray.length);
      setPaired(bondedPeripheralsArray);
    } catch (error) {
      console.error(error);
    }
  };

  const connectToDevice = async (device) => {
    try {
      await BleManager.connect(device.id);
      console.log("Connected");
      setSelectedDevice(device);
      setIsConnected(true);
      const deviceInfo = await BleManager.retrieveServices(device.id);
      console.log("Device info:", deviceInfo);
    } catch (error) {
      console.error("Error connecting to device:", error);
    }
  };

  const sendMessage = async () => {
    if (selectedDevice && isConnected) {
      try {
        const buffer = Buffer.from(messageToSend);
        await BleManager.write(
          selectedDevice.id,
          serviceid,
          node1,
          buffer.toJSON().data
        );
        console.log("Write: " + buffer.toJSON().data);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const readData = async () => {
    if (selectedDevice && isConnected) {
      try {
        const readDataNode1 = await BleManager.read(
          selectedDevice.id,
          serviceid,
          node1
        );
        const messageNode1 = Buffer.from(readDataNode1).toString();
        console.log("Read node1: " + messageNode1);

        const data = {
          frontWeight: JSON.parse(messageNode1)["front weight"],
          crossWeight: JSON.parse(messageNode1)["cross weight"],
          rearWeight: JSON.parse(messageNode1)["rear weight"],
          totalWeight: JSON.parse(messageNode1)["total weight"],
          lfWeight: JSON.parse(messageNode1)["lfWeight"],
          lfWeightP: JSON.parse(messageNode1)["lfWeightP"],
          lfBattery: JSON.parse(messageNode1)["lfBattery"],
          rfWeight: JSON.parse(messageNode1)["rfWeight"],
          rfWeightP: JSON.parse(messageNode1)["rfWeightP"],
          rfBattery: JSON.parse(messageNode1)["rfBattery"],
          lrWeight: JSON.parse(messageNode1)["lrWeight"],
          lrWeightP: JSON.parse(messageNode1)["lrWeightP"],
          lrBattery: JSON.parse(messageNode1)["lrBattery"],
          rrWeight: JSON.parse(messageNode1)["rrWeight"],
          rrWeightP: JSON.parse(messageNode1)["rrWeightP"],
          rrBattery: JSON.parse(messageNode1)["rrBattery"],
        };

        setBleData(data);
      } catch (error) {
        console.error("Error reading message:", error);
        if (error.message.includes("Characteristic")) {
          console.error(`Characteristic not found: ${error.message}`);
        }
      }
    }
  };

  useEffect(() => {
    let intervalId;
    if (selectedDevice && isConnected) {
      intervalId = setInterval(readData, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isConnected, selectedDevice]);

  const disconnectFromDevice = async (device) => {
    try {
      await BleManager.disconnect(device.id);
      setSelectedDevice(null);
      setIsConnected(false);
      console.log("Disconnected from device");
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  useEffect(() => {
    checkBluetoothEnabled();

    if (Platform.OS === "android" && Platform.Version >= 23) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]).then((result) => {
        if (
          result["android.permission.BLUETOOTH_SCAN"] === "granted" &&
          result["android.permission.BLUETOOTH_CONNECT"] === "granted" &&
          result["android.permission.ACCESS_FINE_LOCATION"] === "granted"
        ) {
          console.log("User accepted");
        } else {
          console.log("User refused");
        }
      });
    }

    BleManager.start({ showAlert: false })
      .then(() => {
        console.log("BleManager initialized");
        startDeviceDiscovery();
      })
      .catch((error) => {
        console.error("Error initializing BleManager:", error);
      });

    return () => {
      BleManager.stopScan();
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.container1}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.navigate("Dashboard")}
          iconColor={isDarkMode ? MD3Colors.neutral100 : colors.text}
        />
        <IconButton
          icon="theme-light-dark"
          size={24}
          onPress={toggleDarkMode}
          iconColor={isDarkMode ? MD3Colors.neutral100 : colors.text}
        />
        <Text style={styles.heading1}>BLE Terminal</Text>
      </View>
      <ScrollView style={styles.scroll}>
        <Text style={[styles.heading, isDarkMode && { color: "white" }]}>
          Scan Devices
        </Text>
        {devices.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={styles.deviceContainer}
            onPress={() => connectToDevice(device)}
          >
            <Text style={styles.deviceName}>{device.name || device.id}</Text>
          </TouchableOpacity>
        ))}
        <Text style={[styles.heading, isDarkMode && { color: "white" }]}>
          Paired Devices
        </Text>
        {paired.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={styles.deviceContainer}
            onPress={() => connectToDevice(device)}
          >
            <Text style={styles.deviceName}>{device.name || device.id}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={messageToSend}
          onChangeText={setMessageToSend}
        />
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={readData}>
          <Text style={styles.buttonText}>Read</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={startScan}
        disabled={isScanning}
      >
        <Text style={styles.scanButtonText}>
          {isScanning ? "Scanning..." : "Start Scan"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.discoverButton}
        onPress={startDeviceDiscovery}
      >
        <Text style={styles.discoverButtonText}>Discover Paired Devices</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  darkContainer: {
    backgroundColor: "#1a1a1a",
  },
  scroll: {
    marginBottom: 20,
  },
  container1: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 7,
    color: "#0082FC",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 7,
    color: "#333",
  },
  deviceContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
  },
  deviceName: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginRight: 10,
    color: "#333",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: "#0082FC",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  scanButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  discoverButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  discoverButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default BluetoothBLETerminal;

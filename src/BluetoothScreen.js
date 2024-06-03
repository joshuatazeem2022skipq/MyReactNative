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
import { IconButton } from "react-native-paper";
import { BleContext } from "./ContextApi/BleContext";

const serviceid = "12345678-1234-1234-1234-123456789012";
const node1 = "12348765-8765-4321-8765-123456789012";
const node2 = "87651234-4321-4321-4321-876543210987";
const node3 = "29d16b06-534f-41a1-85f7-260cf91a217f";
const node4 = "06e320d1-1a74-45bc-a041-9b323e981ace";

const BluetoothBLETerminal = () => {
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  const { setBleData } = useContext(BleContext);
  const [paired, setPaired] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [messageToSend, setMessageToSend] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

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

        const readDataNode2 = await BleManager.read(
          selectedDevice.id,
          serviceid,
          node2
        );
        const messageNode2 = Buffer.from(readDataNode2).toString();
        console.log("Read node2: " + messageNode2);

        const readDataNode3 = await BleManager.read(
          selectedDevice.id,
          serviceid,
          node3
        );
        const messageNode3 = Buffer.from(readDataNode3).toString();
        console.log("Read node3: " + messageNode3);

        const readDataNode4 = await BleManager.read(
          selectedDevice.id,
          serviceid,
          node4
        );
        const messageNode4 = Buffer.from(readDataNode4).toString();
        console.log("Read node4: " + messageNode4);

        const data = {
          lfWeight: JSON.parse(messageNode1).lfWeight,
          lfWeightP: JSON.parse(messageNode1).lfWeightP,
          lfBattery: JSON.parse(messageNode1).lfBattery,
          rfWeight: JSON.parse(messageNode2).rfWeight,
          rfWeightP: JSON.parse(messageNode2).rfWeightP,
          rfBattery: JSON.parse(messageNode2).rfBattery,
          lrWeight: JSON.parse(messageNode3).lrWeight,
          lrWeightP: JSON.parse(messageNode3).lrWeightP,
          lrBattery: JSON.parse(messageNode3).lrBattery,
          rrWeight: JSON.parse(messageNode4).rrWeight,
          rrWeightP: JSON.parse(messageNode4).rrWeightP,
          rrBattery: JSON.parse(messageNode4).rrBattery,
        };

        setBleData(data);
      } catch (error) {
        console.error("Error reading message:", error);
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

  return (
    <View style={styles.mainBody}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.navigate("Dashboard")}
      />
      <ScrollView>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Bluetooth Terminal</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={startScan} style={styles.button}>
              <Text style={styles.buttonText}>Scan Devices</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={startDeviceDiscovery}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Bonded Devices</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Scanned Devices</Text>
          {devices.map((device, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => connectToDevice(device)}
              style={styles.deviceButton}
            >
              <Text style={styles.deviceButtonText}>{device.name}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.sectionTitle}>Paired Devices</Text>
          {paired.map((device, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => connectToDevice(device)}
              style={styles.deviceButton}
            >
              <Text style={styles.deviceButtonText}>{device.name}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.sectionTitle}>Terminal</Text>
          {isConnected ? (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Type message"
                value={messageToSend}
                onChangeText={setMessageToSend}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.button}>
                <Text style={styles.buttonText}>Send Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => disconnectFromDevice(selectedDevice)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>No device connected</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  deviceButton: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  deviceButtonText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});

export default BluetoothBLETerminal;

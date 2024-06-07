import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Platform,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import BleManager from "react-native-ble-manager";
import { Buffer } from "buffer";
import { useNavigation } from "@react-navigation/native";
import { IconButton, useTheme, MD3Colors } from "react-native-paper";
import { BleContext } from "./ContextApi/BleContext";
import _ from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [isScanning, setIsScanning] = useState(false);
  const { colors } = useTheme();
  const readDataRef = useRef(null);

  const BleManagerModule = NativeModules.BleManager;
  const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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
      setDevices([]);
      BleManager.scan([], 5, true)
        .then(() => {
          console.log("Scanning...");
          setIsScanning(true);
          // Stop scanning after 5 seconds
          setTimeout(() => {
            BleManager.stopScan()
              .then(() => {
                console.log("Scan stopped");
                setIsScanning(false);
              })
              .catch((error) => {
                console.error("Error stopping scan:", error);
              });
          }, 5000);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const savePairedDevices = async (pairedDevices) => {
    try {
      await AsyncStorage.setItem(
        "pairedDevices",
        JSON.stringify(pairedDevices)
      );
    } catch (error) {
      console.error("Error saving paired devices:", error);
    }
  };

  const startDeviceDiscovery = async () => {
    try {
      const bondedPeripheralsArray = await BleManager.getBondedPeripherals();
      console.log("Bonded peripherals: " + bondedPeripheralsArray.length);

      // Filter out duplicate devices based on their IDs
      const uniquePairedDevices = bondedPeripheralsArray.filter(
        (device, index, self) =>
          index === self.findIndex((d) => d.id === device.id)
      );

      setPaired(uniquePairedDevices);
      savePairedDevices(uniquePairedDevices);
    } catch (error) {
      console.error(error);
    }
  };

  // const loadPairedDevices = async () => {
  //   try {
  //     await AsyncStorage.getItem("example_key");

  //     const pairedDevicesString = await AsyncStorage.getItem("pairedDevices");
  //     if (pairedDevicesString) {
  //       const pairedDevices = JSON.parse(pairedDevicesString);
  //       setPaired(pairedDevices);
  //     }
  //   } catch (error) {
  //     console.error("Error loading paired devices:", error);
  //   }
  // };
  const loadPairedDevices = async () => {
    try {
      const pairedDevicesString = await AsyncStorage.getItem("pairedDevices");
      if (pairedDevicesString) {
        const pairedDevices = JSON.parse(pairedDevicesString);
        setPaired(pairedDevices);
      }
    } catch (error) {
      console.error("Error loading paired devices:", error);
    }
  };
  useEffect(() => {
    loadPairedDevices();
  }, []);

  const connectToDevice = async (device) => {
    try {
      await BleManager.connect(device.id);
      console.log("Connected to device:", device.id);
      setSelectedDevice(device);
      setIsConnected(true);

      // Check if the device is already in the paired list
      const isAlreadyPaired = paired.some(
        (pairedDevice) => pairedDevice.id === device.id
      );

      // if (!isAlreadyPaired) {
      //   // Add the device to the paired list
      //   setPaired((prevPaired) => {
      //     const updatedPaired = [...prevPaired, device];
      //     savePairedDevices(updatedPaired);
      //     return updatedPaired;
      //   });
      // }
      if (!isAlreadyPaired) {
        // Add the device to the paired list
        const updatedPaired = [...paired, device];
        setPaired(updatedPaired);
        savePairedDevices(updatedPaired); // Save updated paired devices
      }

      // Remove the device from the scan list
      setDevices((prevDevices) =>
        prevDevices.filter((d) => d.id !== device.id)
      );

      const deviceInfo = await BleManager.retrieveServices(device.id);
      console.log("Device info:", deviceInfo);

      // Check if the characteristic exists in the retrieved services
      const characteristicExists = deviceInfo.characteristics.some(
        (char) => char.characteristic === node1
      );

      if (characteristicExists) {
        await BleManager.startNotification(device.id, serviceid, node1);
      } else {
        throw new Error("Characteristic not found on the device");
      }
    } catch (error) {
      console.error("Error connecting to device:", error);
    }
  };

  const readData = async () => {
    while (true) {
      if (selectedDevice) {
        try {
          const readDataNode1 = await BleManager.read(
            selectedDevice.id,
            serviceid,
            node1
          );
          const messageNode1 = Buffer.from(readDataNode1).toString();
          console.log("Read node1: " + messageNode1);

          let parsedData;
          try {
            parsedData = JSON.parse(messageNode1);
          } catch (parseError) {
            console.error("Error parsing data:", parseError);
            continue;
          }

          const data = {
            frontWeight: parsedData["front weight"],
            crossWeight: parsedData["cross weight"],
            rearWeight: parsedData["rear weight"],
            totalWeight: parsedData["total weight"],
            lfWeight: parsedData["lfWeight"],
            lfWeightP: parsedData["lfWeightP"],
            lfBattery: parsedData["lfBattery"],
            rfWeight: parsedData["rfWeight"],
            rfWeightP: parsedData["rfWeightP"],
            rfBattery: parsedData["rfBattery"],
            lrWeight: parsedData["lrWeight"],
            lrWeightP: parsedData["lrWeightP"],
            lrBattery: parsedData["lrBattery"],
            rrWeight: parsedData["rrWeight"],
            rrWeightP: parsedData["rrWeightP"],
            rrBattery: parsedData["rrBattery"],
          };

          setBleData(data);
        } catch (error) {
          console.error("Error reading message:", error);
          if (error.message.includes("Characteristic")) {
            console.error(`Characteristic not found: ${error.message}`);
          }
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  useEffect(() => {
    readDataRef.current = _.debounce(readData, 500);
  }, [readData]);

  useEffect(() => {
    let intervalId;
    if (selectedDevice && isConnected) {
      intervalId = setInterval(() => {
        readDataRef.current();
      }, 2000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isConnected, selectedDevice]);

  const disconnectFromDevice = async (device) => {
    try {
      await BleManager.disconnect(device.id);
      setSelectedDevice(null);
      setIsConnected(false);

      // Remove the device from the paired list
      setPaired((prevPaired) => prevPaired.filter((d) => d.id !== device.id));

      // Save the updated paired devices list
      savePairedDevices();

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

  const handleDiscoverPeripheral = (peripheral) => {
    if (!peripheral.name || peripheral.name === "NO NAME") {
      return;
    }
    setDevices((prevDevices) => {
      if (!prevDevices.find((dev) => dev.id === peripheral.id)) {
        return [...prevDevices, peripheral];
      }
      return prevDevices;
    });
  };

  useEffect(() => {
    const handlerDiscover = BleManagerEmitter.addListener(
      "BleManagerDiscoverPeripheral",
      handleDiscoverPeripheral
    );

    return () => {
      handlerDiscover.remove();
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
            key={`devices-${device.id}`}
            style={styles.deviceContainer}
            onPress={() => connectToDevice(device)}
          >
            <Text style={styles.deviceName}>{device.name || device.id}</Text>
            <Text style={styles.deviceId}>{device.id}</Text>
          </TouchableOpacity>
        ))}
        <Text style={[styles.heading, isDarkMode && { color: "white" }]}>
          Paired Devices
        </Text>
        {paired.map((device) => (
          <TouchableOpacity
            key={`paired-${device.id}`}
            style={styles.deviceContainer}
            onPress={() => connectToDevice(device)}
            onLongPress={() => disconnectFromDevice(device)}
          >
            <Text style={styles.deviceName}>{device.name || device.id}</Text>
            <Text style={styles.deviceId}>{device.id}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceId: {
    fontSize: 14,
    color: "#666",
  },
  scanButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#0082FC",
    alignItems: "center",
    marginBottom: 10,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  discoverButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#0082FC",
    alignItems: "center",
    marginBottom: 10,
  },
  discoverButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BluetoothBLETerminal;

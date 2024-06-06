import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BleContext } from "./ContextApi/BleContext";
import BleManager from "react-native-ble-manager";
import { Buffer } from "buffer";

const CHARACTERISTIC_UUID_wifiLogin = "ca0279ab-3c2c-4efa-88ae-2863353339c9";
const serviceid = "12345678-1234-1234-1234-123456789012";
const CHUNK_SIZE = 20;

const BleCredentials = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [ble, setBle] = useState("");
  const { selectedDevice, isConnected } = useContext(BleContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const sendChunkedData = async (data) => {
    const buffer = Buffer.from(data, "utf-8");

    for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
      const chunk = buffer.slice(i, i + CHUNK_SIZE);
      await BleManager.write(
        selectedDevice.id,
        serviceid,
        CHARACTERISTIC_UUID_wifiLogin,
        chunk.toJSON().data
      );
      await new Promise((resolve) => setTimeout(resolve, 0)); // Increase delay between chunks
    }
  };

  const handleSubmit = async () => {
    if (selectedDevice && isConnected) {
      try {
        const credentials = JSON.stringify({ ble });
        await sendChunkedData(credentials);
        console.log("Credentials sent: ", credentials);

        // Read response from BLE device
        const responseData = await BleManager.read(
          selectedDevice.id,
          serviceid,
          CHARACTERISTIC_UUID_wifiLogin
        );
        const decodedResponse = Buffer.from(responseData).toString("utf-8");
        console.log("Response from device: ", decodedResponse);

        navigation.navigate("Dashboard");
      } catch (error) {
        console.error("Error during login: ", error);
        Alert.alert("Navigation Error", "An error occurred during navigation.");
      }
    }
  };

  const onClose = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.popup}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="cancel" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.heading}>Change BLE credentials</Text>
            <TextInput
              style={styles.input}
              placeholder="Change Ble Name"
              value={ble}
              onChangeText={setBle}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  heading: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  submitButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default BleCredentials;

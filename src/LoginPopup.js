// import React, { useState, useContext } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   TouchableWithoutFeedback,
//   Alert,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { BleContext } from "./ContextApi/BleContext";
// import BleManager from "react-native-ble-manager";
// import { Buffer } from "buffer";

// const CHARACTERISTIC_UUID_wifiLogin = "a5cd5a47-22eb-406f-8aa5-bf6a2cea1a8a";
// const serviceid = "12345678-1234-1234-1234-123456789012";

// const LoginPopup = ({ navigation }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { selectedDevice, isConnected } = useContext(BleContext);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async () => {
//     if (selectedDevice && isConnected) {
//       try {
//         const credentials = JSON.stringify({ username, password });
//         console.log("Writing credentials to BLE device...");

//         // Write the JSON string directly as UTF-8
//         await BleManager.write(
//           selectedDevice.id,
//           serviceid,
//           CHARACTERISTIC_UUID_wifiLogin,
//           Buffer.from(credentials)
//         );
//         console.log("Credentials sent: ", credentials);

//         // Reading response
//         console.log("Reading response from BLE device...");
//         const responseData = await BleManager.read(
//           selectedDevice.id,
//           serviceid,
//           CHARACTERISTIC_UUID_wifiLogin
//         );
//         const responseMessage = Buffer.from(responseData).toString("utf-8");
//         console.log("Response from device: ", responseMessage);

//         if (responseMessage.includes("true")) {
//           navigation.navigate("FileSettingsPopup", {
//             onClose: () => navigation.goBack(),
//           });
//         } else {
//           Alert.alert("Invalid Credentials", "Please try again.");
//         }
//       } catch (error) {
//         console.error("Error during login: ", error);
//         Alert.alert("Login Failed", "An error occurred during login.");
//       }
//     } else {
//       Alert.alert("Device not connected", "Please connect to a device first.");
//     }
//   };

//   const onClose = () => {
//     navigation.navigate("Dashboard");
//   };

//   return (
//     <Modal animationType="slide" transparent={true} visible={true}>
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.container}>
//           <View style={styles.popup}>
//             <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//               <Icon name="cancel" size={24} color="black" />
//             </TouchableOpacity>
//             <Text style={styles.heading}>User Login</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Username"
//               value={username}
//               onChangeText={setUsername}
//             />
//             <View style={styles.passwordContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 secureTextEntry={!showPassword}
//                 value={password}
//                 onChangeText={setPassword}
//               />
//               <TouchableOpacity
//                 onPress={togglePasswordVisibility}
//                 style={styles.icon}
//               >
//                 <Icon
//                   name={showPassword ? "visibility-off" : "visibility"}
//                   size={20}
//                   color="#777"
//                 />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity
//               style={styles.submitButton}
//               onPress={handleSubmit}
//             >
//               <Text style={styles.submitButtonText}>Submit</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//   },
//   popup: {
//     backgroundColor: "#fff",
//     padding: 30,
//     borderRadius: 10,
//     alignItems: "center",
//     width: "80%",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#333",
//   },
//   input: {
//     width: "100%",
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//   },
//   icon: {
//     position: "absolute",
//     right: 10,
//     top: 15,
//   },
//   submitButton: {
//     backgroundColor: "red",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignItems: "center",
//     width: "100%",
//     marginTop: 10,
//   },
//   submitButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   closeButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//   },
// });

// export default LoginPopup;

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

const CHARACTERISTIC_UUID_wifiLogin = "a5cd5a47-22eb-406f-8aa5-bf6a2cea1a8a";
const serviceid = "12345678-1234-1234-1234-123456789012";
const CHUNK_SIZE = 20;

const LoginPopup = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        // Convert username and password to JSON string
        const credentials = JSON.stringify({ username, password });

        // Send the JSON string in chunks
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

        if (decodedResponse.includes("true")) {
          navigation.navigate("FileSettingsPopup", {
            onClose: () => navigation.goBack(),
          });
        } else {
          Alert.alert("Invalid Credentials", "Please try again.");
        }
      } catch (error) {
        console.error("Error during login: ", error);
        Alert.alert("Login Failed", "An error occurred during login.");
      }
    } else {
      Alert.alert("Device not connected", "Please connect to a device first.");
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
            <Text style={styles.heading}>User Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.icon}
              >
                <Icon
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
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

export default LoginPopup;

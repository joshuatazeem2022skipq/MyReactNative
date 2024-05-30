import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const LoginPopup = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = () => {
    console.log("Username:", username);
    console.log("Password:", password);
    navigation.navigate("FileSettingsPopup", {
      onClose: () => navigation.goBack(),
    });
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

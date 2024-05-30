import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const FileSettingsPopup = ({ navigation }) => {
  const [setupMode, setSetupMode] = useState(false);
  const [nodeConfig, setNodeConfig] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = () => {
    if (!setupMode && !nodeConfig) {
      setErrorMessage("Please enable Setup Mode or Node Configuration");
      return;
    }

    if (!nodeConfig) {
      navigation.navigate("Dashboard");
    } else {
      setNodeConfig(false);
      navigation.navigate("NodeConfigScreen");
    }
  };

  const onClose = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="cancel" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>File Settings</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Setup Mode:</Text>
          <Switch
            value={setupMode}
            onValueChange={(value) => setSetupMode(value)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Node Configuration:</Text>
          <Switch
            value={nodeConfig}
            onValueChange={(value) => setNodeConfig(value)}
          />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
        <View>
          {errorMessage !== "" && (
            <Text style={styles.error}>{errorMessage}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  content: {
    width: "80%",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "600",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
    width: 250,
    height: 50,
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FileSettingsPopup;

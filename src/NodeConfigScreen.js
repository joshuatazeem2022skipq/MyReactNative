import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

const NodeConfigScreen = ({ navigation }) => {
  const [nodeConfigData, setNodeConfigData] = useState({
    id: "",
    idToSet: "",
    hx711Calibration: "",
  });

  const handleNodeConfigSave = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formHeading}>Node Configuration</Text>
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={nodeConfigData.id}
        onChangeText={(text) =>
          setNodeConfigData({ ...nodeConfigData, id: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="ID to Set"
        value={nodeConfigData.idToSet}
        onChangeText={(text) =>
          setNodeConfigData({ ...nodeConfigData, idToSet: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="HX711 Calibration"
        value={nodeConfigData.hx711Calibration}
        onChangeText={(text) =>
          setNodeConfigData({ ...nodeConfigData, hx711Calibration: text })
        }
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleNodeConfigSave}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  formHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NodeConfigScreen;

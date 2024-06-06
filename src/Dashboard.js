import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Appbar, RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import BatteryIcon from "./BatteryIcon";
import BGImage from "./assets/background.png";
import Logo from "./assets/1.png";
import BT from "./assets/blues.png";
import { useNavigation } from "@react-navigation/native";
import { BleContext } from "./ContextApi/BleContext";

const { width, height } = Dimensions.get("window");

const Dashboard = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigation = useNavigation();
  const { bleData, handleChangeUnit, unit, handleZeroClick } =
    useContext(BleContext);

  const handleLogin = () => {
    setShowLoginPopup(true);
    navigation.navigate("LoginPopup");
  };

  const handleBluetooth = () => {
    navigation.navigate("BluetoothScreen");
  };

  const formatWeight = (weight) => {
    return weight ? weight.toFixed(1) : "N/A";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BGImage} style={styles.backgroundImage}>
        <Appbar.Header style={styles.appBar}>
          <TouchableOpacity onPress={handleLogin} style={styles.menuIcon}>
            <Appbar.Action
              icon={() => <Icon name="menu" size={32} color="#fff" />}
            />
          </TouchableOpacity>
          <Appbar.Content style={styles.logoContainer} />
          <Image source={Logo} style={styles.logo} />
        </Appbar.Header>

        <View style={styles.content}>
          {/* Front Weight Block */}
          <View style={styles.centerCard}>
            <Text style={styles.cardTitle}>Front Weight</Text>
            <View style={styles.card}>
              <Text style={styles.cardValue}>
                {formatWeight(bleData.frontWeight)}
              </Text>
            </View>
          </View>
          {/* LF And RF Block */}

          <View style={styles.row}>
            <View style={styles.column}>
              <BatteryIcon
                size={30}
                batteryPercentage={bleData.lfBattery ?? "0"}
              />

              <Text style={styles.columnTitle}> LF</Text>
              <View style={styles.smallCard}>
                <Text style={styles.columnValue}>
                  {formatWeight(bleData.lfWeight)}
                </Text>
                <Text style={styles.columnPercentage}>
                  {bleData.lfWeightP ?? "N/A"}%
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <BatteryIcon
                size={30}
                batteryPercentage={bleData.rfBattery ?? "N/A"}
              />
              <Text style={styles.columnTitle}>RF</Text>
              <View style={styles.smallCard}>
                <Text style={styles.columnValue}>
                  {formatWeight(bleData.rfWeight)}
                </Text>
                <Text style={styles.columnPercentage}>
                  {bleData.rfWeightP ?? "N/A"}%
                </Text>
              </View>
            </View>
          </View>

          {/* Cross Weight Block */}
          <View style={styles.centerCard1}>
            <Text style={styles.cardTitle}>Cross Weight</Text>
            <View style={styles.card}>
              <Text style={styles.cardValue}>
                {formatWeight(bleData.crossWeight)}
              </Text>
            </View>
          </View>

          {/* LR And RR Block */}
          <View style={styles.row}>
            <View style={styles.column}>
              <BatteryIcon
                size={30}
                batteryPercentage={bleData.lrBattery ?? "N/A"}
              />
              <Text style={styles.columnTitle}>LR</Text>
              <View style={styles.smallCard}>
                <Text style={styles.columnValue}>
                  {formatWeight(bleData.lrWeight)}
                </Text>
                <Text style={styles.columnPercentage}>
                  {bleData.lrWeightP ?? "N/A"}%
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <BatteryIcon
                size={30}
                batteryPercentage={bleData.rrBattery ?? "N/A"}
              />
              <Text style={styles.columnTitle}>RR</Text>
              <View style={styles.smallCard}>
                <Text style={styles.columnValue}>
                  {formatWeight(bleData.rrWeight)}
                </Text>
                <Text style={styles.columnPercentage}>
                  {bleData.rrWeightP ?? "N/A"}%
                </Text>
              </View>
            </View>
          </View>

          {/* Rear Weight Block */}
          <View style={styles.centerCard1}>
            <Text style={styles.cardTitle}>Rear Weight</Text>
            <View style={styles.card}>
              <Text style={styles.cardValue}>
                {formatWeight(bleData.rearWeight)}
              </Text>
            </View>
          </View>
          {/* Total Weight Block and Radio Buttons */}
          <View style={styles.totalWeightContainer}>
            <View style={styles.centerCard3}>
              <Text style={styles.cardTitle}>Total Weight</Text>
              <View style={styles.card5}>
                <Text style={styles.cardValue}>
                  {formatWeight(bleData.totalWeight)}
                </Text>
              </View>
            </View>
            {/* Radio buttons for selecting unit */}
            <View style={styles.radioContainer}>
              <RadioButton.Group
                onValueChange={(value) => handleChangeUnit(value)} // Call handleChangeUnit when value changes
                value={unit}
              >
                {/* Radio buttons for selecting unit */}
                <View style={styles.radioOption}>
                  <Text style={styles.radioText}>Kg</Text>
                  <RadioButton
                    value="kg"
                    color="#aaff00"
                    uncheckedColor="#F7FC03"
                  />
                </View>
                <View style={styles.radioOption1}>
                  <Text style={styles.radioText}>Lbs</Text>
                  <View style={styles.radioButtonWrapper}>
                    <RadioButton
                      value="lbs"
                      color="#aaff00"
                      uncheckedColor="#F7FC03"
                    />
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>

          {/* Zero Block */}
          <TouchableOpacity style={styles.button} onPress={handleZeroClick}>
            <View style={styles.centerCard4}>
              <View style={styles.card1}>
                <Text style={styles.cardValue1}>Zero</Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* Connected text */}
          <View style={styles.connectedContainer}>
            <TouchableOpacity onPress={handleBluetooth}>
              <Image source={BT} style={styles.btImage} />
            </TouchableOpacity>
            <Text style={styles.connectedText}>Connected</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  appBar: {
    backgroundColor: "transparent",
    elevation: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.6,
    height: height * 0.1,
    position: "absolute",
    alignSelf: "center",
    top: 1,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  centerCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 1,
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#F7FC03",
  },
  card: {
    backgroundColor: "#aaff00",
    padding: 10,
    borderRadius: 8,
    width: width * 0.3,
    alignItems: "center",
  },
  cardValue: {
    fontSize: width * 0.044,
    fontWeight: "bold",
    color: "black",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  column: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  columnTitle: {
    marginBottom: 6,
    fontSize: width * 0.05,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    color: "#aaff00",
    textAlign: "right",
  },
  smallCard: {
    backgroundColor: "green",
    padding: 2,
    borderRadius: 8,
    alignItems: "center",
    width: width * 0.32,
  },
  columnValue: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#fff",
  },
  columnPercentage: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#fff",
  },
  centerCard1: {
    alignItems: "center",
    marginTop: 20,
  },
  centerCard2: {
    alignItems: "center",
    marginTop: 20,
  },
  centerCard3: {
    alignItems: "center",
    marginTop: 5,
    marginLeft: width * 0.3,
  },
  centerCard4: {
    alignItems: "center",
    marginTop: 10,
  },
  card1: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 8,
    width: width * 0.4,
    alignItems: "center",
    height: height * 0.07,
  },
  cardValue1: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "black",
    marginTop: 5,
  },
  connectedContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btImage: {
    width: width * 0.08,
    height: height * 0.06,
    marginRight: 10,
  },
  connectedText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#F7FC03",
  },
  menuIcon: {
    cursor: "pointer",
  },
  loginContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  card5: {
    backgroundColor: "#aaff00",
    padding: 10,
    borderRadius: 8,
    width: width * 0.4,
    alignItems: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginTop: 20,
  },
  radioOption1: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioText: {
    fontSize: width * 0.048,
    color: "#F7FC03",
    marginRight: 5,
    fontWeight: "900",
  },
  totalWeightContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  radioButton: {
    color: "red",
  },
});

export default Dashboard;

import React, { createContext, useEffect, useState } from "react";
import { Buffer } from "buffer";
import BleManager from "react-native-ble-manager";

const serviceid = "12345678-1234-1234-1234-123456789012";
const Zero = "9bad813d-370a-45e5-ac4d-bb4c2b65379f";
const CHUNK_SIZE = 20;

export const BleContext = createContext();

export const BleProvider = ({ children }) => {
  const [bleData, setBleData] = useState({
    frontWeight: "",
    lfWeight: "",
    rfWeight: "",
    rfWeightP: "",
    rfBattery: "",
    lfWeightP: "",
    lfBattery: "",
    crossWeight: "",
    lrWeight: "",
    lrWeightP: "",
    lrBattery: "",
    rrWeight: "",
    rrWeightP: "",
    rrBattery: "",
    rearWeight: "",
    totalWeight: "",
  });
  const [blockColors, setBlockColors] = useState({
    lfColor: false,
    rfColor: false,
    lrColor: false,
    rrColor: false,
  });
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unit, setUnit] = useState("kg");

  const checkConnectionStatus = async () => {
    if (selectedDevice) {
      const connected = await BleManager.isPeripheralConnected(
        selectedDevice.id
      );
      setIsConnected(connected);
    } else {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkConnectionStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [selectedDevice]);

  const sendChunkedData = async (data) => {
    const buffer = Buffer.from(data, "utf-8");

    for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
      const chunk = buffer.slice(i, i + CHUNK_SIZE);
      await BleManager.write(
        selectedDevice.id,
        serviceid,
        Zero,
        chunk.toJSON().data
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const sendResponse = async (value) => {
    if (!selectedDevice || !isConnected) {
      console.error("No device selected or device not connected");
      return;
    }

    try {
      const response = JSON.stringify({ [value.toUpperCase()]: true });
      console.log(`Sending ${value} response: `, response);
      await sendChunkedData(response);
      console.log(`${value} response sent: `, response);

      setTimeout(async () => {
        try {
          const falseResponse = JSON.stringify({
            [value.toUpperCase()]: false,
          });
          console.log(`Sending false ${value} response: `, falseResponse);
          await sendChunkedData(falseResponse);
          console.log(`False ${value} response sent: `, falseResponse);
        } catch (error) {
          console.error(`Error sending false ${value} response: `, error);
        }
      }, 3000);
    } catch (error) {
      console.error(`Error sending ${value} response: `, error);
    }
  };

  const handleChangeUnit = async (value) => {
    setUnit(value);
    await sendResponse(value);
  };

  const handleZeroClick = async () => {
    await sendResponse("zero");
  };

  return (
    <BleContext.Provider
      value={{
        bleData,
        setBleData,
        selectedDevice,
        setSelectedDevice,
        isConnected,
        setIsConnected,
        unit,
        handleChangeUnit,
        handleZeroClick,
        blockColors,
        setBlockColors,
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

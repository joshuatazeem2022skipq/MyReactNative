import React, { createContext, useState } from "react";

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
    rrWeight: "",
    rearWeight: "",
    totalWeight: "",
  });

  return (
    <BleContext.Provider value={{ bleData, setBleData }}>
      {children}
    </BleContext.Provider>
  );
};

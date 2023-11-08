import React, { createContext, useState, useMemo } from "react";

const SeatContext = createContext();

const SeatContextProvider = ({ children }) => {
  const [seatList, setSeatList] = useState([]);
  const updateSeatList = (newValue) => {
    setSeatList(newValue);
  };

  const [seatData, setSeatData] = useState([]);
  const updateSeatData = (newValue) => {
    setSeatData(newValue);
  };

  const value = useMemo(
    () => ({ seatList, updateSeatList, seatData, updateSeatData }),
    [seatList, seatData]
  );

  return <SeatContext.Provider value={value}>{children}</SeatContext.Provider>;
};

export { SeatContext, SeatContextProvider };

import React, { createContext, useState, useMemo } from "react";

const SeatContext = createContext();

const SeatContextProvider = ({ children }) => {
  const [seatList, setSeatList] = useState([]);
  const updateSeatList = (newValue) => {
    setSeatList(newValue);
  };
  const value = useMemo(() => ({ seatList, updateSeatList }), [seatList]);

  return <SeatContext.Provider value={value}>{children}</SeatContext.Provider>;
};

export { SeatContext, SeatContextProvider };

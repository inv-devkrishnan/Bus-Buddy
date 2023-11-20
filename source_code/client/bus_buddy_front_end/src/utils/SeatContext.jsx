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


  const [tripID, setTripID] = useState();
  const updateTripID = (newValue) => {
    setTripID(newValue);
  };

  const value = useMemo(
    () => ({
      seatList,
      updateSeatList,
      seatData,
      updateSeatData,
      tripID,
      updateTripID,
    }),
    [seatList, seatData, tripID]
  );

  return <SeatContext.Provider value={value}>{children}</SeatContext.Provider>;
};

export { SeatContext, SeatContextProvider };

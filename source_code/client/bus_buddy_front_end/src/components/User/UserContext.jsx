import React, { createContext, useState, useMemo } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [selectedCoupon, setSelectedCoupon] = useState([]);
  const [firstName, setFirstName] = useState(localStorage.getItem("user_name"))  // name stored in  navbar
  const updateSelectedCoupon = (newValue) => {
    setSelectedCoupon(newValue);
  };
  const updateFirstName = (newValue) =>
  {
    setFirstName(newValue)
  }

  const value = useMemo(
    () => ({
      selectedCoupon,
      updateSelectedCoupon,
      firstName,
      updateFirstName,
    }),
    [selectedCoupon,firstName]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserContextProvider };

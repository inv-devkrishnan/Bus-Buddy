import React, { createContext, useState, useMemo } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [selectedCoupon, setSelectedCoupon] = useState([]);
  const updateSelectedCoupon = (newValue) => {
    setSelectedCoupon(newValue);
  };

  const value = useMemo(
    () => ({
      selectedCoupon,
      updateSelectedCoupon,
    }),
    [selectedCoupon]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserContextProvider };

import { createContext, useState, useMemo } from "react";

const AddSeatContext = createContext("");

const AddSeatContextProvider = ({ children }) => {
  const [currentSeatData, setCurrentSeatData] = useState([]);
  const updateCurrentSeatData = (newValue) => {
    setCurrentSeatData(newValue);
  };

  const [isClicked, setIsClicked] = useState(false); // for seat onClick function
  const updateIsClicked = (newValue) => {
    setIsClicked(newValue);
  };

  const [propsData, setPropsData] = useState(0); // holds the ui order
  const updatePropsData = (newValue) => {
    setPropsData(newValue);
  };

  const [currentData, setCurrentData] = useState([]); // for storing the whole data from response
  const updateCurrentData = (newValue) => {
    setCurrentData(newValue);
  };

  const [reRender, setReRender] = useState(false);
  const updateReRender = (newValue) => {
    setReRender(newValue);
  };

  const value = useMemo(
    () => ({
      currentSeatData,
      updateCurrentSeatData,
      isClicked,
      updateIsClicked,
      propsData,
      updatePropsData,
      currentData,
      updateCurrentData,
      reRender,
      updateReRender,
    }),
    [currentSeatData, isClicked, propsData, currentData, reRender]
  );

  return (
    <AddSeatContext.Provider value={value}>{children}</AddSeatContext.Provider>
  );
};
export { AddSeatContext, AddSeatContextProvider };

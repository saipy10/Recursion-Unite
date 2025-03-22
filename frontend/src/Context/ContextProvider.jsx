import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
  // Add register to the initial state
  registration: false
};

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setisClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);

  const [currentColor, setCurrentColor] = useState(
    localStorage.getItem("colorMode") || "#03C9D7"
  );
  const [currentMode, setCurrentMode] = useState(
    localStorage.getItem("themeMode") || "Light"
  );
  const [themeSettings, setThemeSettings] = useState(false);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  // Manage which component is clicked
  const handleClick = (clicked) => {
    setisClicked({ ...initialState, [clicked]: true });
  };

  // Close a specific component
  const handleClose = (closed) => {
    setisClicked({ ...isClicked, [closed]: false });
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        isClicked,
        setisClicked,
        handleClick,
        handleClose,
        screenSize,
        setScreenSize,
        currentColor,
        setColor,
        currentMode,
        setMode,
        themeSettings,
        setThemeSettings,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
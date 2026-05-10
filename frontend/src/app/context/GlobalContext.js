'use client';

import { createContext, useState, useEffect } from 'react';
import weatherJson from '../data/weather.json';

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileDevice, setMobileDevice] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('/');
  const [dbWeather, setDbWeather] = useState(weatherJson);

  return (
    <GlobalContext.Provider
      value={{
        darkMode,
        setDarkMode,
        mobileDevice,
        setMobileDevice,
        currentUrl,
        setCurrentUrl,
        dbWeather,
        setDbWeather,

      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
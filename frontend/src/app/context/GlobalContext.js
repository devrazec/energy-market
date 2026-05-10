'use client';

import { createContext, useState, useEffect } from 'react';
import tomorrowJson from '../data/tomorrow.json';

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileDevice, setMobileDevice] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('/');
  const [dbTomorrow, setDbTomorrow] = useState(tomorrowJson);

  return (
    <GlobalContext.Provider
      value={{
        darkMode,
        setDarkMode,
        mobileDevice,
        setMobileDevice,
        currentUrl,
        setCurrentUrl,
        dbTomorrow,
        setDbTomorrow,

      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
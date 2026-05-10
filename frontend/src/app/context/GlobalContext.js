"use client";

import { createContext, useState, useEffect } from "react";
import weatherJson from "../data/weather.json";
import priceJson from "../data/price.json";
import cityPriceJson from "../data/city_price.json";

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileDevice, setMobileDevice] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("/");
  const [dbWeather, setDbWeather] = useState(weatherJson);
  const [dbPrice, setDbPrice] = useState(priceJson);
  const [dbCityPrice, setDbCityPrice] = useState(cityPriceJson);
    
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
        dbPrice,
        setDbPrice,
        dbCityPrice,
        setDbCityPrice,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

"use client";

import { createContext, useState, useEffect } from "react";
import portoWeatherJson from "../data/porto_weather.json";
import marketPriceJson from "../data/market_price.json";
import cityPriceJson from "../data/city_price.json";
import cityOrderJson from "../data/city_order.json";

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileDevice, setMobileDevice] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("/");
  const [dbPortoWeather, setDbPortoWeather] = useState(portoWeatherJson);
  const [dbMarketPrice, setDbMarketPrice] = useState(marketPriceJson);
  const [dbCityPrice, setDbCityPrice] = useState(cityPriceJson);
  const [dbCityOrder, setDbCityOrder] = useState(cityOrderJson);
  
  // Energy levels for each city battery
  const [energyLisbon, setEnergyLisbon] = useState(100);
  const [energyPorto, setEnergyPorto] = useState(100);
  const [energyFaro, setEnergyFaro] = useState(100);
  const [energyCoimbra, setEnergyCoimbra] = useState(100);
  const [energyBraga, setEnergyBraga] = useState(100);
  const [energyBraganca, setEnergyBraganca] = useState(100);
  const [energyLeiria, setEnergyLeiria] = useState(100);
  const [energyGuarda, setEnergyGuarda] = useState(100);
    
  return (
    <GlobalContext.Provider
      value={{
        darkMode,
        setDarkMode,
        mobileDevice,
        setMobileDevice,
        currentUrl,
        setCurrentUrl,
        dbPortoWeather,
        setDbPortoWeather,
        dbMarketPrice,
        setDbMarketPrice,
        dbCityPrice,
        setDbCityPrice,
        dbCityOrder,
        setDbCityOrder,
        energyLisbon,
        setEnergyLisbon,
        energyPorto,
        setEnergyPorto,
        energyFaro,
        setEnergyFaro,
        energyCoimbra,
        setEnergyCoimbra,
        energyBraga,
        setEnergyBraga,
        energyBraganca,
        setEnergyBraganca,
        energyLeiria,
        setEnergyLeiria,
        energyGuarda,
        setEnergyGuarda,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

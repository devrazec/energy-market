"use client";

import { createContext, useState, useEffect } from "react";
import portoWeatherJson from "../data/porto_weather.json";
import marketPriceJson from "../data/market_price.json";
import cityPriceJson from "../data/city_price.json";
import cityOrderJson from "../data/city_order.json";

import geoPortugalJson from "../data/geo-portugal.json";
import geoLisbonJson from "../data/geo-lisbon.json";
import geoPortoJson from "../data/geo-porto.json";
import geoFaroJson from "../data/geo-faro.json";
import geoCoimbraJson from "../data/geo-coimbra.json";
import geoBragaJson from "../data/geo-braga.json";
import geoBragancaJson from "../data/geo-braganca.json";
import geoLeiriaJson from "../data/geo-leiria.json";
import geoGuardaJson from "../data/geo-guarda.json";

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

  const [geoPortugal, setGeoPortugal] = useState(geoPortugalJson);
  const [geoLisbon, setGeoLisbon] = useState(geoLisbonJson);
  const [geoPorto, setGeoPorto] = useState(geoPortoJson);
  const [geoFaro, setGeoFaro] = useState(geoFaroJson);
  const [geoCoimbra, setGeoCoimbra] = useState(geoCoimbraJson);
  const [geoBraga, setGeoBraga] = useState(geoBragaJson);
  const [geoBraganca, setGeoBraganca] = useState(geoBragancaJson);
  const [geoLeiria, setGeoLeiria] = useState(geoLeiriaJson);
  const [geoGuarda, setGeoGuarda] = useState(geoGuardaJson);

  const [geoZoomView, setGeoZoomView] = useState(7);
  const [geoInitialView, setGeoInitialView] = useState([39.3999, -8.2245]);

  const [mapPanel, setMapPanel] = useState(true);
  const [dataPanel, setDataPanel] = useState(true);

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
        geoPortugal,

        setGeoPortugal,
        geoLisbon,
        setGeoLisbon,
        geoPorto,
        setGeoPorto,
        geoFaro,
        setGeoFaro,
        geoCoimbra,
        setGeoCoimbra,
        geoBraga,
        setGeoBraga,
        geoBraganca,
        setGeoBraganca,
        geoLeiria,
        setGeoLeiria,
        geoGuarda,
        setGeoGuarda,

        geoZoomView,
        setGeoZoomView,
        geoInitialView,
        setGeoInitialView,
        
        mapPanel,
        setMapPanel,
        dataPanel,
        setDataPanel,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

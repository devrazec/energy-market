"use client";

import React, { useState, useEffect, useContext } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { GlobalContext } from "../context/GlobalContext";

// City coordinates in Portugal
const cityCoordinates = {
  Lisbon: [38.7223, -9.1393],
  Porto: [41.1579, -8.6291],
  Faro: [37.0194, -7.9322],
  Coimbra: [40.2033, -8.4103],
  Braga: [41.5454, -8.4265],
  Bragança: [41.8065, -6.7569],
  Leiria: [39.7437, -8.8071],
  Guarda: [40.5364, -7.2683],
};

// City-specific colors (matching Historical page)
const cityColors = {
  Lisbon: "#ef4444",      // red
  Porto: "#0ea5e9",       // sky blue
  Faro: "#f59e0b",        // amber
  Coimbra: "#10b981",     // green
  Braga: "#8b5cf6",       // purple
  Bragança: "#06b6d4",    // cyan
  Leiria: "#ec4899",      // pink
  Guarda: "#f97316"       // orange
};

const createPriceIcon = (city, price, isHovered) => {
  const color = cityColors[city] || "#6b7280";
  return L.divIcon({
    className: "price-marker",
    html: `<div style="
      background: ${isHovered ? color : "#fff"};
      color: ${isHovered ? "#fff" : color};
      border: 2px solid ${color};
      border-radius: 12px;
      font-weight: bold;
      font-size: 13px;
      text-align: center;
      padding: 6px 1px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      white-space: nowrap;
    ">€${price}</div>`,
    iconSize: [60, 32],
    iconAnchor: [30, 16],
  });
};

const PriceMarker = ({ currentMinute }) => {
  const { dbCityPrice } = useContext(GlobalContext);
  const [hoveredCity, setHoveredCity] = useState(null);

  // Convert minute to time string (HH:MM)
  const getTimeFromMinute = (minute) => {
    const hour = Math.floor(minute / 60);
    const min = minute % 60;
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  const timeKey = getTimeFromMinute(currentMinute);

  return (
    <>
      {Object.keys(cityCoordinates).map((city) => {
        const position = cityCoordinates[city];
        const priceValue = dbCityPrice?.sources?.[city]?.[timeKey] 
          || dbCityPrice?.sources?.[city]?.["00:00"] 
          || "0.0000";
        const price = parseFloat(priceValue).toFixed(4);
        const color = cityColors[city];

        return (
          <Marker
            key={city}
            position={position}
            icon={createPriceIcon(city, price, hoveredCity === city)}
            eventHandlers={{
              mouseover: () => setHoveredCity(city),
              mouseout: () => setHoveredCity(null),
            }}
          >
            <Popup>
              <div style={{ padding: "8px", minWidth: "150px" }}>
                <div 
                  style={{ 
                    fontSize: "16px", 
                    fontWeight: "bold", 
                    color: color,
                    marginBottom: "8px" 
                  }}
                >
                  {city}
                </div>
                <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                  <strong>Time:</strong> {timeKey}
                </div>
                <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                  <strong>Price:</strong> €{price}/kWh
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default PriceMarker;

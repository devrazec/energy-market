"use client";

import React, { useState, useContext, useMemo, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Layout from "../../components/Layout";

export default function HistoricalPage() {
  const { 
    darkMode, 
    mobileDevice, 
    dbCityOrder,
    dbCityPrice,
    energyLisbon,
    energyPorto,
    energyFaro,
    energyCoimbra,
    energyBraga,
    energyBraganca,
    energyLeiria,
    energyGuarda
  } = useContext(GlobalContext);

  const cities = [
    "Lisbon",
    "Porto",
    "Faro",
    "Coimbra",
    "Braga",
    "Bragança",
    "Leiria",
    "Guarda",
  ];

  // State for dynamic minute display
  const [currentMinute, setCurrentMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentMinute((prev) => {
        if (prev >= 1439) {
          setIsPlaying(false);
          return 1439; // 23:59
        }
        return prev + 1;
      });
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Convert current minute to time string
  const getCurrentTimeFromMinute = (minute) => {
    const hour = Math.floor(minute / 60);
    const min = minute % 60;
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  };

  // Get status based on order value
  const getStatus = (orderValue) => {
    const statuses = ["Created", "Validated", "Rejected", "Forwarded", "Accepted", "Activated", "Completed"];
    
    if (orderValue < 15) return "Created";
    if (orderValue < 30) return "Validated";
    if (orderValue < 35) return "Rejected";
    if (orderValue < 50) return "Forwarded";
    if (orderValue < 65) return "Accepted";
    if (orderValue < 80) return "Activated";
    return "Completed";
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      "Created": "#6b7280",      // gray
      "Validated": "#3b82f6",    // blue
      "Rejected": "#ef4444",     // red
      "Forwarded": "#f59e0b",    // amber
      "Accepted": "#10b981",     // green
      "Activated": "#8b5cf6",    // purple
      "Completed": "#06b6d4"     // cyan
    };
    return colors[status] || "#6b7280";
  };

  // Get table data for current minute
  const getTableData = () => {
    const timeKey = getCurrentTimeFromMinute(currentMinute);
    return cities.map((city) => {
      const orderValue = dbCityOrder?.sources?.[city]?.[timeKey] 
        || dbCityOrder?.sources?.[city]?.["00:00"] 
        || "0";
      const priceValue = dbCityPrice?.sources?.[city]?.[timeKey] 
        || dbCityPrice?.sources?.[city]?.["00:00"] 
        || "0";
      
      const order = parseFloat(orderValue);
      const price = parseFloat(priceValue);
      const total = order * price;
      const status = getStatus(order);

      return {
        city,
        order: order.toFixed(0),
        price: price.toFixed(4),
        total: total.toFixed(4),
        status: status
      };
    });
  };

  const [batteryLevels, setBatteryLevels] = useState(() => {
    const values = {};
    const timeKey = getCurrentTimeFromMinute(0);
    cities.forEach((city) => {
      const value = dbCityOrder?.sources?.[city]?.[timeKey] 
        || dbCityOrder?.sources?.[city]?.["00:00"] 
        || "0";
      values[city] = parseInt(value, 10);
    });
    return values;
  });

  // Update battery levels when minute changes
  useEffect(() => {
    const timeKey = getCurrentTimeFromMinute(currentMinute);
    const values = {};
    cities.forEach((city) => {
      const value = dbCityOrder?.sources?.[city]?.[timeKey] 
        || dbCityOrder?.sources?.[city]?.["00:00"] 
        || "0";
      values[city] = parseInt(value, 10);
    });
    setBatteryLevels(values);
  }, [currentMinute, dbCityOrder]);

  // City-specific colors (matching CityPrice page)
  const cityColors = {
    "Lisbon": "#ef4444",      // red
    "Porto": "#0ea5e9",       // sky blue
    "Faro": "#f59e0b",        // amber
    "Coimbra": "#10b981",     // green
    "Braga": "#8b5cf6",       // purple
    "Bragança": "#06b6d4",    // cyan
    "Leiria": "#ec4899",      // pink
    "Guarda": "#f97316"       // orange
  };

  const Battery = ({ city, level }) => {
    const color = cityColors[city] || "#6b7280";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* City Name */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: color,
          }}
        >
          {city}
        </div>

        {/* Battery Container */}
        <div
          style={{
            width: "60px",
            height: "100px",
            border: `3px solid ${darkMode ? "#4b5563" : "#9ca3af"}`,
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            background: darkMode ? "#111827" : "#f3f4f6",
          }}
        >
          {/* Battery Terminal */}
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "24px",
              height: "8px",
              background: darkMode ? "#4b5563" : "#9ca3af",
              borderRadius: "4px 4px 0 0",
            }}
          />

          {/* Battery Fill */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${level}%`,
              background: `linear-gradient(to top, ${color}, ${color}dd)`,
              transition: "height 0.5s ease, background 0.5s ease",
              borderRadius: "0 0 5px 5px",
            }}
          />
        </div>

        {/* Percentage */}
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: color,
          }}
        >
          {level}%
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div
        style={{
          padding: "24px",
          overflowY: "auto",
          height: "100%",
          background: darkMode ? "#111827" : "#f9fafb",
        }}
      >
        {/* Title */}
        {/* <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: darkMode ? "#f9fafb" : "#111827",
            marginBottom: "16px",
          }}
        >
          Energy Market Overview
        </div> */}

        {/* Playback Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
            padding: "12px",
            background: darkMode ? "#1f2937" : "#fff",
            borderRadius: "8px",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            flexWrap: mobileDevice ? "wrap" : "nowrap",
          }}
        >
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: "8px 16px",
              background: isPlaying ? "#ef4444" : "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          
          <button
            onClick={() => {
              setCurrentMinute(0);
              setIsPlaying(false);
            }}
            style={{
              padding: "8px 16px",
              background: darkMode ? "#374151" : "#e5e7eb",
              color: darkMode ? "#d1d5db" : "#333",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            ⏮ Reset
          </button>

          <input
            type="range"
            min="0"
            max="1439"
            value={currentMinute}
            onChange={(e) => {
              setCurrentMinute(parseInt(e.target.value));
              setIsPlaying(false);
            }}
            style={{
              flex: 1,
              accentColor: "#0ea5e9",
              minWidth: mobileDevice ? "100%" : "200px",
            }}
          />

          <span
            style={{
              color: darkMode ? "#d1d5db" : "#333",
              fontWeight: 600,
              fontSize: "14px",
              minWidth: "60px",
              textAlign: "right",
            }}
          >
            {Math.floor(currentMinute / 60).toString().padStart(2, '0')}:
            {(currentMinute % 60).toString().padStart(2, '0')}
          </span>

          <span
            style={{
              color: darkMode ? "#9ca3af" : "#6b7280",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            ({currentMinute + 1} / 1440)
          </span>
        </div>

        {/* Table Card */}
        <div
          style={{
            background: darkMode ? "#1f2937" : "#fff",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            borderRadius: 12,
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {/* <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: darkMode ? "#f9fafb" : "#111827",
              }}
            >
              City Energy Data
            </div> */}
            {/* <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: darkMode ? "#0ea5e9" : "#0284c7",
                padding: "4px 12px",
                background: darkMode ? "#111827" : "#f0f9ff",
                borderRadius: "6px",
                border: `1px solid ${darkMode ? "#374151" : "#bae6fd"}`,
              }}
            >
              {Math.floor(currentMinute / 60).toString().padStart(2, '0')}:
              {(currentMinute % 60).toString().padStart(2, '0')}
            </div> */}
          </div>
          
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `2px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                }}
              >
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: darkMode ? "#f9fafb" : "#111827",
                    fontSize: "14px",
                  }}
                >
                  City
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: 600,
                    color: darkMode ? "#f9fafb" : "#111827",
                    fontSize: "14px",
                  }}
                >
                  Time
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "right",
                    fontWeight: 600,
                    color: darkMode ? "#f9fafb" : "#111827",
                    fontSize: "14px",
                  }}
                >
                  Order Value
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "right",
                    fontWeight: 600,
                    color: darkMode ? "#f9fafb" : "#111827",
                    fontSize: "14px",
                  }}
                >
                  Price (EUR/kWh)
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "right",
                    fontWeight: 600,
                    color: darkMode ? "#f9fafb" : "#111827",
                    fontSize: "14px",
                  }}
                >
                  Total (EUR)
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: 600,
                    color: darkMode ? "#f9fafb" : "#111827",
                    fontSize: "14px",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {getTableData().map((row) => (
                <tr
                  key={row.city}
                  style={{
                    borderBottom: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: 600,
                      color: cityColors[row.city],
                      fontSize: "14px",
                    }}
                  >
                    {row.city}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: darkMode ? "#0ea5e9" : "#0284c7",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {Math.floor(currentMinute / 60).toString().padStart(2, '0')}:
                    {(currentMinute % 60).toString().padStart(2, '0')}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      color: darkMode ? "#d1d5db" : "#374151",
                      fontSize: "14px",
                    }}
                  >
                    {row.order}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      color: darkMode ? "#d1d5db" : "#374151",
                      fontSize: "14px",
                    }}
                  >
                    €{row.price}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: darkMode ? "#f9fafb" : "#111827",
                      fontSize: "14px",
                    }}
                  >
                    €{row.total}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#fff",
                        background: getStatusColor(row.status),
                        display: "inline-block",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Batteries Card */}
        <div
          style={{
            background: darkMode ? "#1f2937" : "#fff",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            borderRadius: 12,
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {/* <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: darkMode ? "#f9fafb" : "#111827",
              marginBottom: "16px",
            }}
          >
            Energy Levels
          </div> */}

          {/* Battery Grid */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              overflowX: "auto",
              justifyContent: mobileDevice ? "flex-start" : "space-between",
            }}
          >
            {cities.map((city) => (
              <Battery key={city} city={city} level={batteryLevels[city]} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

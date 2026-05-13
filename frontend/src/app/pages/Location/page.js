"use client";

import React, { useState, useContext, useMemo, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Layout from "../../components/Layout";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../../components/LeafletMap"), {
  ssr: false,
});

export default function LocationPage() {
  const {
    darkMode,
    mobileDevice,
    dataPanel,
    mapPanel,
    setDataPanel,
  } = useContext(GlobalContext);

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

  useEffect(() => {
    if (!dataPanel && !mapPanel) {
      // Prefer keeping the data panel visible
      setDataPanel(true);
    }
  }, [dataPanel, mapPanel, setDataPanel]);

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
        {/* Main Card Container */}
        <div
          style={{
            background: darkMode ? "#1f2937" : "#fff",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            borderRadius: 12,
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Playback Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
              padding: "12px",
              background: darkMode ? "#111827" : "#f9fafb",
              borderRadius: "8px",
              border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
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

          {/* Map Container */}
          <div style={{ touchAction: "none", height: "100%", width: "100%", flex: 1, minHeight: 0, position: "relative" }}>
            <LeafletMap currentMinute={currentMinute} key={`${mapPanel}-${dataPanel}`} />
            
            {/* Legend */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: darkMode ? "#1f2937" : "#fff",
                border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                borderRadius: "8px",
                padding: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                zIndex: 1000,
                fontSize: "12px",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "8px", color: darkMode ? "#f9fafb" : "#111827" }}>
                Energy Prices (EUR/kWh)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {["Lisbon", "Porto", "Faro", "Coimbra", "Braga", "Bragança", "Leiria", "Guarda"].map((city) => {
                  const cityColors = {
                    Lisbon: "#ef4444",
                    Porto: "#0ea5e9",
                    Faro: "#f59e0b",
                    Coimbra: "#10b981",
                    Braga: "#8b5cf6",
                    Bragança: "#06b6d4",
                    Leiria: "#ec4899",
                    Guarda: "#f97316"
                  };
                  return (
                    <div key={city} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div 
                        style={{ 
                          width: "12px", 
                          height: "12px", 
                          borderRadius: "50%", 
                          background: cityColors[city],
                          border: "2px solid #fff",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                        }} 
                      />
                      <span style={{ color: darkMode ? "#d1d5db" : "#374151", fontSize: "11px" }}>
                        {city}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

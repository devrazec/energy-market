"use client";

import React, { useState, useContext, useMemo, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Layout from "../../components/Layout";

export default function LocationPage() {
  const { darkMode, setDarkMode, mobileDevice, setMobileDevice } =
    useContext(GlobalContext);

  return (
    <Layout>
      <div
        style={{
          padding: "24px 24px 24px 24px",
          overflowY: "auto",
          height: "100%",
          background: darkMode ? "#111827" : undefined,
        }}
      >
        {/* {dateRange && (
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#008bc1', marginBottom: 16 }}>
                        {dateRange}
                    </div>
                )} */}

        <div
          style={{
            background: darkMode ? "#1f2937" : "#fff",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
            borderRadius: 10,
            padding: "16px 20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ touchAction: "none" }}></div>
        </div>
      </div>
    </Layout>
  );
}

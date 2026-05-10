"use client";

import React, { useState, useContext, useMemo, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Layout from "../../components/Layout";
import ReactECharts from "echarts-for-react";

export default function MarketPricePage() {
  const {
    darkMode,
    setDarkMode,
    mobileDevice,
    setMobileDevice,
    dbMarketPrice,
    setDbMarketPrice,
  } = useContext(GlobalContext);

  const chartOption = useMemo(() => {
    if (!dbMarketPrice || !dbMarketPrice.prices) {
      return {};
    }

    const isMobile = !!mobileDevice;
    
    // Parse the new structure: prices is an object with days as keys
    const pricesData = dbMarketPrice.prices;
    const days = Object.keys(pricesData).sort();
    
    // Get all unique hours from all days
    const allHoursSet = new Set();
    days.forEach(day => {
      Object.keys(pricesData[day]).forEach(hour => {
        allHoursSet.add(hour);
      });
    });
    const allHours = Array.from(allHoursSet).sort();

    // Create series for each day with different colors
    const colors = [
      { color: '#0ea5e9', rgba: '14, 165, 233' },    // sky blue
      { color: '#10b981', rgba: '16, 185, 129' },    // green
      { color: '#f59e0b', rgba: '245, 158, 11' },    // amber
      { color: '#ef4444', rgba: '239, 68, 68' },     // red
      { color: '#8b5cf6', rgba: '139, 92, 246' },    // purple
      { color: '#ec4899', rgba: '236, 72, 153' },    // pink
      { color: '#06b6d4', rgba: '6, 182, 212' }      // cyan
    ];
    
    // Create markLine data for hour labels (every hour)
    const hourMarkLines = allHours.map(hour => ({
      name: hour,
      xAxis: hour,
      lineStyle: {
        color: darkMode ? '#4b5563' : '#cbd5e1',
        width: 1,
        type: 'solid'
      },
      label: {
        show: true,
        formatter: '{b}',
        position: 'insideEndTop',
        color: darkMode ? '#9ca3af' : '#94a3b8',
        fontSize: 10,
        fontWeight: 600
      }
    }));

    const series = days.map((day, index) => {
      const dayData = pricesData[day];
      const dayLabel = new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const colorInfo = colors[index % colors.length];
      
      // Map hours to prices
      const data = allHours.map(hour => {
        const priceStr = dayData[hour];
        return priceStr ? parseFloat(priceStr) : null;
      });

      const seriesConfig = {
        name: dayLabel,
        type: 'line',
        data: data,
        smooth: true,
        showSymbol: false,
        color: colorInfo.color,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `rgba(${colorInfo.rgba}, 0.5)` },
              { offset: 1, color: `rgba(${colorInfo.rgba}, 0.02)` }
            ]
          }
        },
        connectNulls: true,
        markPoint: {
          data: [
            {
              type: 'max',
              name: 'Max',
              label: { formatter: (p) => '€' + p.value.toFixed(4) }
            },
            {
              type: 'min',
              name: 'Min',
              label: { formatter: (p) => '€' + p.value.toFixed(4) }
            }
          ],
          symbol: 'pin',
          symbolSize: 50,
          label: { fontSize: 8 }
        }
      };

      // Add markLine only to the first series to avoid duplicate labels
      if (index === 0) {
        seriesConfig.markLine = {
          symbol: 'none',
          data: hourMarkLines
        };
      }

      return seriesConfig;
    });

    return {
      backgroundColor: 'transparent',
      title: {
        text: `Electricity Prices - ${dbMarketPrice.source || 'aWATTar'} (${dbMarketPrice.market || 'Austria'})`,
        left: 'center',
        textStyle: {
          color: darkMode ? '#fff' : '#000',
          fontSize: 18,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: 'axis',
        position: (pt) => [pt[0], '10%'],
        formatter: (params) => {
          let result = `Hour: ${params[0].axisValue}<br/>`;
          params.forEach(param => {
            if (param.value !== null && param.value !== undefined) {
              result += `${param.marker}${param.seriesName}: €${param.value.toFixed(4)}/kWh<br/>`;
            }
          });
          return result;
        },
        backgroundColor: darkMode ? '#1f2937' : '#fff',
        borderColor: darkMode ? '#374151' : '#ccc',
        textStyle: { color: darkMode ? '#d1d5db' : '#333' }
      },
      legend: {
        data: days.map(day => new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        orient: 'vertical',
        top: 'middle',
        right: 0,
        textStyle: { color: darkMode ? '#d1d5db' : '#333' }
      },
      grid: isMobile
        ? { left: 10, right: 10, bottom: 100, top: 60, containLabel: true }
        : { left: 50, right: 90, bottom: 80, top: 60, containLabel: false },
      toolbox: {
        top: 10,
        feature: {
          dataZoom: { yAxisIndex: 'none' },
          magicType: { type: ['line', 'bar'] },
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: allHours,
        boundaryGap: false,
        name: 'Hour',
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: { color: darkMode ? '#9ca3af' : '#666' },
        axisLabel: { 
          formatter: '{value}',
          color: darkMode ? '#9ca3af' : '#666' 
        },
        axisLine: { lineStyle: { color: darkMode ? '#374151' : '#ccc' } },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        name: 'Price (EUR/kWh)',
        nameTextStyle: { color: darkMode ? '#9ca3af' : '#666' },
        boundaryGap: [0, '20%'],
        axisLabel: {
          formatter: (val) => '€' + val.toFixed(4),
          color: darkMode ? '#9ca3af' : '#666'
        },
        splitLine: { lineStyle: { color: darkMode ? '#374151' : '#f0f0f0' } }
      },
      dataZoom: [
        { type: 'inside', start: 0, end: 80 },
        {
          type: 'slider',
          start: 0,
          end: 100,
          textStyle: { color: darkMode ? '#9ca3af' : '#666' },
          borderColor: darkMode ? '#374151' : '#ccc',
          fillerColor: darkMode ? 'rgba(55,65,81,0.5)' : 'rgba(0,139,193,0.1)',
          backgroundColor: darkMode ? '#1f2937' : '#f8f8f8'
        }
      ],
      series: series
    };
  }, [dbMarketPrice, darkMode, mobileDevice]);

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
          <div style={{ touchAction: "none", height: "100%" }}>
            <ReactECharts
              option={chartOption}
              style={{ height: "100%", width: "100%" }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

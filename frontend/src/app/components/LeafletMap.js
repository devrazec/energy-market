'use client';

import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import ResetView from './ResetView';
import ShowMyLocation from './ShowMyLocation';
import PortugalLayer from './PortugalLayer';
import LocationLayer from './LocationLayer';
import PriceMarker from './PriceMarker';


import { GlobalContext } from '../context/GlobalContext';

// Fix for default marker icons in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LeafletMap = ({ currentMinute = 0 }) => {
  const {
    geoZoomView,
    setGeoZoomView,
    geoInitialView,
  } = useContext(GlobalContext);

  return (
    <MapContainer
      center={geoInitialView}
      zoom={geoZoomView}
      scrollWheelZoom={true}
      zoomControl={true}
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <ResetView />
      <ShowMyLocation />
      <PortugalLayer />
      <LocationLayer />
      <PriceMarker currentMinute={currentMinute} />

    </MapContainer>
  );
};

export default React.memo(LeafletMap);

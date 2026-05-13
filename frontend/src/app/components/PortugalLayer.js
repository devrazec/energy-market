'use client';

import { useEffect, useContext } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { GlobalContext } from '../context/GlobalContext';

const PortugalLayer = () => {
  const map = useMap();

  const {
    geoPortugal,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!map) return;

    const geom = geoPortugal.features[0].geometry;

    const polygons = [];

    if (geom.type === 'Polygon') {
      // Single polygon (mainland)
      const coords = geom.coordinates[0].map(([lng, lat]) => [lat, lng]);
      polygons.push(coords);
    } else if (geom.type === 'MultiPolygon') {
      // Mainland + islands
      geom.coordinates.forEach(poly => {
        const coords = poly[0].map(([lng, lat]) => [lat, lng]);
        polygons.push(coords);
      });
    }

    // Draw polygons
    const leafletPolygons = polygons.map(coords =>
      L.polygon(coords, {
        color: '#00473C', // border color
        weight: 3,
        fillColor: '#057642', // fill color
        fillOpacity: 0.25, // soft highlight
      }).addTo(map)
    );

    return () => {
      leafletPolygons.forEach(poly => map.removeLayer(poly));
    };
  }, [map]);

  return null;
};

export default PortugalLayer;

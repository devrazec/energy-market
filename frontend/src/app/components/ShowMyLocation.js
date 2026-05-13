'use client';

import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ShowMyLocation = () => {
  const map = useMap();

  useEffect(() => {
    const zoomControl = document.querySelector('.leaflet-control-zoom');
    if (!zoomControl) return;

    // Create a container for the button
    const btn = L.DomUtil.create(
      'a',
      'leaflet-control-zoom-location leaflet-control-zoom-in',
      zoomControl
    );

    btn.href = '#';
    btn.title = 'Show my location';

    // Styling to match Leaflet zoom buttons
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.width = '30px';
    btn.style.height = '30px';
    btn.style.fontSize = '30px';
    btn.style.cursor = 'pointer';

    // Render the Material UI icon into the button
    const iconContainer = document.createElement('span');
    btn.appendChild(iconContainer);
    const root = createRoot(iconContainer);
    root.render(<LocationOnIcon sx={{ fontSize: 20, color: '#000' }} />);

    // Click handler to show user location
    btn.onclick = e => {
      e.preventDefault();

      if (!navigator.geolocation) {
        alert('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          map.panTo([latitude, longitude], { animate: true });

          // Optional: add a marker or circle
          L.circleMarker([latitude, longitude], {
            radius: 8,
            weight: 2,
            color: '#00473C',
            fillColor: '#057642',
            fillOpacity: 0.7,
          }).addTo(map);
        },
        () => {
          alert('Unable to get your location');
        }
      );
    };

    // Cleanup on unmount
    return () => {
      if (zoomControl.contains(btn)) zoomControl.removeChild(btn);
      root.unmount();
    };
  }, [map]);

  return null;
};

export default ShowMyLocation;

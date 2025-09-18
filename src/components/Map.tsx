import { useEffect, useRef } from 'react';
import { APIProvider, Map as GoogleMap, useMap } from '@vis.gl/react-google-maps';
import type { Coordinates, MapConfig, MapCameraChangeEvent } from '@/types';
import { HeatmapLayer } from './HeatmapLayer';

interface MapProps {
  coordinates: Coordinates[];
  config: MapConfig;
  onMapChange?: (center: Coordinates, zoom: number) => void;
  apiKey: string;
}

function MapContent({ coordinates, config, onMapChange }: Omit<MapProps, 'apiKey'>) {
  const map = useMap();
  const previousCoordinatesLength = useRef(0);

  const handleCameraChange = (event: MapCameraChangeEvent) => {
    if (onMapChange && event.detail.center && event.detail.zoom) {
      onMapChange(
        {
          lat: event.detail.center.lat,
          lng: event.detail.center.lng,
        },
        event.detail.zoom
      );
    }
  };

  useEffect(() => {
    if (!map || coordinates.length === 0) return;

    // Only adjust bounds when new coordinates are added
    if (coordinates.length > previousCoordinatesLength.current) {
      const bounds = new google.maps.LatLngBounds();
      coordinates.forEach(coord => {
        bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
      });

      // Fit the map to show all coordinates with some padding
      map.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    }

    previousCoordinatesLength.current = coordinates.length;
  }, [map, coordinates]);

  return (
    <GoogleMap
      center={config.center}
      zoom={config.zoom}
      gestureHandling="greedy"
      disableDefaultUI={false}
      onCameraChanged={handleCameraChange}
      mapId="heatmap-map"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
      }}
    >
      {coordinates.length > 0 && <HeatmapLayer data={coordinates} />}
    </GoogleMap>
  );
}

export function Map({ coordinates, config, onMapChange, apiKey }: MapProps) {
  return (
    <APIProvider apiKey={apiKey} libraries={['visualization']}>
      <div className="map-container">
        <MapContent
          coordinates={coordinates}
          config={config}
          onMapChange={onMapChange}
        />
      </div>
    </APIProvider>
  );
}
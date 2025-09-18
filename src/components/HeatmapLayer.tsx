import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { Coordinates } from '@/types';

interface HeatmapLayerProps {
  data: Coordinates[];
  options?: google.maps.visualization.HeatmapLayerOptions;
}

export function HeatmapLayer({ data, options = {} }: HeatmapLayerProps) {
  const map = useMap();
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map || !window.google?.maps?.visualization) return;

    // Create heatmap layer if it doesn't exist
    if (!heatmapRef.current) {
      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        map,
        ...options,
      });
    }

    // Convert coordinates to LatLng objects
    const heatmapData = data.map(
      coord => new google.maps.LatLng(coord.lat, coord.lng)
    );

    // Update heatmap data
    heatmapRef.current.setData(heatmapData);

    // Set default options if not provided
    if (!options.radius) {
      heatmapRef.current.set('radius', 20);
    }
    if (!options.opacity) {
      heatmapRef.current.set('opacity', 0.6);
    }

    return () => {
      // Clean up heatmap layer when component unmounts
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
    };
  }, [map, data, options]);

  // Return null since this component doesn't render JSX
  return null;
}
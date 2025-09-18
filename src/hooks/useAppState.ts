import { useState, useMemo, useCallback } from 'react';
import type { Coordinates, MapConfig } from '@/types';
import { calculateCenter, calculateZoom } from '@/utils/coordinates';

export interface UseAppStateReturn {
  coordinates: Coordinates[];
  mapConfig: MapConfig;
  addCoordinates: (newCoordinates: Coordinates[]) => void;
  clearCoordinates: () => void;
  setMapCenter: (center: Coordinates) => void;
  setMapZoom: (zoom: number) => void;
}

export function useAppState(): UseAppStateReturn {
  const [coordinates, setCoordinates] = useState<Coordinates[]>([]);
  const [manualCenter, setManualCenter] = useState<Coordinates | null>(null);
  const [manualZoom, setManualZoom] = useState<number | null>(null);

  // Calculate map configuration based on coordinates
  const mapConfig: MapConfig = useMemo(() => {
    const center = manualCenter || calculateCenter(coordinates);
    const zoom = manualZoom || calculateZoom(coordinates);

    return {
      center,
      zoom: Math.max(2, Math.min(18, zoom)),
    };
  }, [coordinates, manualCenter, manualZoom]);

  const addCoordinates = useCallback((newCoordinates: Coordinates[]) => {
    setCoordinates(prev => [...prev, ...newCoordinates]);
    setManualCenter(null);
    setManualZoom(null);
  }, []);

  const clearCoordinates = useCallback(() => {
    setCoordinates([]);
    setManualCenter(null);
    setManualZoom(null);
  }, []);

  const setMapCenter = useCallback((center: Coordinates) => {
    setManualCenter(center);
  }, []);

  const setMapZoom = useCallback((zoom: number) => {
    setManualZoom(zoom);
  }, []);

  return {
    coordinates,
    mapConfig,
    addCoordinates,
    clearCoordinates,
    setMapCenter,
    setMapZoom,
  };
}
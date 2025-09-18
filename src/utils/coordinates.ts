import type { ExifGPSCoordinate, Coordinates } from '@/types';

/**
 * Converts EXIF GPS coordinates from degrees/minutes/seconds format to decimal degrees
 */
export function convertExifCoordinateToDecimal(
  coordinate: ExifGPSCoordinate[]
): number | null {
  if (!coordinate || coordinate.length !== 3) {
    return null;
  }

  const isValid = coordinate.every(
    item =>
      typeof item.numerator === 'number' &&
      typeof item.denominator === 'number' &&
      item.denominator !== 0
  );

  if (!isValid) {
    return null;
  }

  const [degrees, minutes, seconds] = coordinate;

  return (
    degrees.numerator / degrees.denominator +
    minutes.numerator / (60 * minutes.denominator) +
    seconds.numerator / (3600 * seconds.denominator)
  );
}

/**
 * Validates that coordinates are within valid ranges
 */
export function validateCoordinates(coordinates: Coordinates): boolean {
  const { lat, lng } = coordinates;
  return (
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
}

/**
 * Calculates the center point of an array of coordinates
 */
export function calculateCenter(coordinates: Coordinates[]): Coordinates {
  if (coordinates.length === 0) {
    // Default to Austin, TX
    return { lat: 30.2672, lng: -97.7431 };
  }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / coordinates.length,
    lng: sum.lng / coordinates.length,
  };
}

/**
 * Calculates appropriate zoom level based on coordinate spread
 */
export function calculateZoom(coordinates: Coordinates[]): number {
  if (coordinates.length <= 1) {
    return 10;
  }

  const lats = coordinates.map(coord => coord.lat);
  const lngs = coordinates.map(coord => coord.lng);

  const latDiff = Math.max(...lats) - Math.min(...lats);
  const lngDiff = Math.max(...lngs) - Math.min(...lngs);

  const maxDiff = Math.max(latDiff, lngDiff);

  if (maxDiff > 10) return 2;
  if (maxDiff > 5) return 4;
  if (maxDiff > 2) return 6;
  if (maxDiff > 1) return 8;
  if (maxDiff > 0.5) return 10;
  if (maxDiff > 0.1) return 12;
  return 14;
}
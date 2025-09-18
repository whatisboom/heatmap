import { describe, it, expect } from 'vitest';
import {
  convertExifCoordinateToDecimal,
  validateCoordinates,
  calculateCenter,
  calculateZoom,
} from '../coordinates';
import type { ExifGPSCoordinate, Coordinates } from '../../types';

describe('coordinates utilities', () => {
  describe('convertExifCoordinateToDecimal', () => {
    it('should convert valid EXIF coordinates to decimal', () => {
      const exifCoord: ExifGPSCoordinate[] = [
        { numerator: 30, denominator: 1 }, // 30 degrees
        { numerator: 16, denominator: 1 }, // 16 minutes
        { numerator: 2, denominator: 1 }, // 2 seconds
      ];

      const result = convertExifCoordinateToDecimal(exifCoord);
      expect(result).toBeCloseTo(30.2672, 4);
    });

    it('should return null for invalid coordinates', () => {
      expect(convertExifCoordinateToDecimal([])).toBeNull();
      expect(convertExifCoordinateToDecimal([{ numerator: 30, denominator: 1 }])).toBeNull();

      const invalidCoord: ExifGPSCoordinate[] = [
        { numerator: 30, denominator: 0 }, // Invalid: division by zero
        { numerator: 16, denominator: 1 },
        { numerator: 2, denominator: 1 },
      ];
      expect(convertExifCoordinateToDecimal(invalidCoord)).toBeNull();
    });
  });

  describe('validateCoordinates', () => {
    it('should validate correct coordinates', () => {
      expect(validateCoordinates({ lat: 30.2672, lng: -97.7431 })).toBe(true);
      expect(validateCoordinates({ lat: 0, lng: 0 })).toBe(true);
      expect(validateCoordinates({ lat: 90, lng: 180 })).toBe(true);
      expect(validateCoordinates({ lat: -90, lng: -180 })).toBe(true);
    });

    it('should reject invalid coordinates', () => {
      expect(validateCoordinates({ lat: 91, lng: 0 })).toBe(false);
      expect(validateCoordinates({ lat: -91, lng: 0 })).toBe(false);
      expect(validateCoordinates({ lat: 0, lng: 181 })).toBe(false);
      expect(validateCoordinates({ lat: 0, lng: -181 })).toBe(false);
      expect(validateCoordinates({ lat: NaN, lng: 0 })).toBe(false);
      expect(validateCoordinates({ lat: 0, lng: NaN })).toBe(false);
    });
  });

  describe('calculateCenter', () => {
    it('should return default center for empty array', () => {
      const result = calculateCenter([]);
      expect(result).toEqual({ lat: 30.2672, lng: -97.7431 });
    });

    it('should calculate center of multiple coordinates', () => {
      const coords: Coordinates[] = [
        { lat: 30, lng: -90 },
        { lat: 40, lng: -100 },
      ];
      const result = calculateCenter(coords);
      expect(result).toEqual({ lat: 35, lng: -95 });
    });

    it('should return the same coordinate for single point', () => {
      const coords: Coordinates[] = [{ lat: 30.2672, lng: -97.7431 }];
      const result = calculateCenter(coords);
      expect(result).toEqual({ lat: 30.2672, lng: -97.7431 });
    });
  });

  describe('calculateZoom', () => {
    it('should return default zoom for empty or single coordinate', () => {
      expect(calculateZoom([])).toBe(10);
      expect(calculateZoom([{ lat: 30, lng: -90 }])).toBe(10);
    });

    it('should calculate appropriate zoom based on coordinate spread', () => {
      // Large spread
      const largeSpread: Coordinates[] = [
        { lat: 0, lng: 0 },
        { lat: 20, lng: 20 },
      ];
      expect(calculateZoom(largeSpread)).toBe(2);

      // Small spread
      const smallSpread: Coordinates[] = [
        { lat: 30.0, lng: -97.0 },
        { lat: 30.1, lng: -97.1 },
      ];
      expect(calculateZoom(smallSpread)).toBe(12);
    });
  });
});
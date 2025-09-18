import ExifReader from 'exifreader';
import type { Coordinates, ImageWithLocation, ProcessingError } from '@/types';
import { validateCoordinates } from './coordinates';

/**
 * Detects the image format based on file extension and MIME type
 */
export function detectImageFormat(file: File): 'JPEG' | 'HEIC' | 'HEIF' | 'Unknown' {
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  if (mimeType === 'image/heic' || fileName.endsWith('.heic')) {
    return 'HEIC';
  }
  if (mimeType === 'image/heif' || fileName.endsWith('.heif')) {
    return 'HEIF';
  }
  if (mimeType === 'image/jpeg' || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
    return 'JPEG';
  }

  return 'Unknown';
}

/**
 * Extracts GPS coordinates from a single image file (supports JPEG and HEIC)
 */
export function extractGPSFromImage(file: File): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = function(event) {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          reject(new Error(`Failed to read file: ${file.name}`));
          return;
        }

        // ExifReader supports both JPEG and HEIC formats
        const tags = ExifReader.load(arrayBuffer, { expanded: true });

        if (!tags.gps) {
          reject(new Error(`No GPS data found in ${file.name}`));
          return;
        }

        const { gps } = tags;

        // ExifReader provides GPS coordinates in a different format
        const lat = gps.Latitude;
        const lng = gps.Longitude;

        if (typeof lat !== 'number' || typeof lng !== 'number') {
          reject(new Error(`Invalid GPS coordinates in ${file.name}`));
          return;
        }

        const coordinates: Coordinates = {
          lat,
          lng,
        };

        if (!validateCoordinates(coordinates)) {
          reject(new Error(`Invalid coordinate values in ${file.name}: lat=${lat}, lng=${lng}`));
          return;
        }

        resolve(coordinates);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        reject(new Error(`Failed to process ${file.name}: ${errorMessage}`));
      }
    };

    fileReader.onerror = function() {
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    fileReader.readAsArrayBuffer(file);
  });
}

/**
 * Processes multiple image files and extracts GPS coordinates
 */
export async function processImageFiles(
  files: File[]
): Promise<{
  success: ImageWithLocation[];
  errors: ProcessingError[];
}> {
  const results: ImageWithLocation[] = [];
  const errors: ProcessingError[] = [];

  // Process files concurrently with a reasonable limit
  const concurrencyLimit = 5;
  const chunks = chunkArray(Array.from(files), concurrencyLimit);

  for (const chunk of chunks) {
    const promises = chunk.map(async (file, index) => {
      try {
        const coordinates = await extractGPSFromImage(file);

        const imageWithLocation: ImageWithLocation = {
          id: generateId(file, index),
          fileName: file.name,
          file,
          lat: coordinates.lat,
          lng: coordinates.lng,
          processed: true,
          format: detectImageFormat(file),
        };

        results.push(imageWithLocation);
      } catch (error) {
        errors.push({
          fileName: file.name,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    await Promise.all(promises);
  }

  return { success: results, errors };
}

/**
 * Validates that a file is a supported image type
 */
export function validateImageFile(file: File): boolean {
  const supportedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/heic',
    'image/heif'
  ];

  // Check MIME type
  if (supportedTypes.includes(file.type.toLowerCase())) {
    return true;
  }

  // Fallback to file extension check for HEIC files
  // Some browsers may not set correct MIME type for HEIC
  const fileName = file.name.toLowerCase();
  const supportedExtensions = ['.jpg', '.jpeg', '.heic', '.heif'];

  return supportedExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Filters files to only include supported image types
 */
export function filterSupportedImages(files: File[]): {
  supported: File[];
  unsupported: string[];
} {
  const supported: File[] = [];
  const unsupported: string[] = [];

  files.forEach(file => {
    if (validateImageFile(file)) {
      supported.push(file);
    } else {
      unsupported.push(`${file.name} (${file.type || 'unknown type'})`);
    }
  });

  return { supported, unsupported };
}

// Helper functions
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function generateId(file: File, index: number): string {
  return `${file.name}-${file.size}-${index}-${Date.now()}`;
}
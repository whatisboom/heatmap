export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ImageWithLocation extends Coordinates {
  id: string;
  fileName: string;
  file: File;
  processed: boolean;
  format: 'JPEG' | 'HEIC' | 'HEIF' | 'Unknown';
}

export interface ProcessingState {
  isProcessing: boolean;
  processedCount: number;
  totalCount: number;
  errors: ProcessingError[];
}

export interface ProcessingError {
  fileName: string;
  message: string;
}

export interface ExifGPSCoordinate {
  numerator: number;
  denominator: number;
}

export type FileProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface AppState {
  coordinates: Coordinates[];
  images: ImageWithLocation[];
  processingState: ProcessingState;
  mapCenter: Coordinates;
}

// Google Maps types
export interface MapConfig {
  zoom: number;
  center: Coordinates;
  mapTypeId?: string;
}

export interface MapCameraChangeEvent {
  detail: {
    center?: Coordinates;
    zoom?: number;
  };
}

// Google Maps global types
export interface GoogleMapsGlobal {
  maps: {
    Map: new (...args: unknown[]) => unknown;
    LatLng: new (lat: number, lng: number) => unknown;
    marker: {
      Marker: new (...args: unknown[]) => unknown;
    };
    visualization: {
      HeatmapLayer: new (...args: unknown[]) => unknown;
    };
  };
}

// EXIF File interface extending File with exif data
export interface ExifFile extends File {
  exifdata?: Record<string, unknown>;
  iptcdata?: Record<string, unknown>;
}



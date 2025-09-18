import { useMemo } from 'react';
import { Map } from './components/Map';
import { FileUpload } from './components/FileUpload';
import { DataSummary } from './components/DataSummary';
import { useFileProcessor } from './hooks/useFileProcessor';
import { useAppState } from './hooks/useAppState';
import type { Coordinates } from './types';
import './App.css';

// Get Google Maps API key from environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function App() {
  const {
    processingState,
    images,
    processFiles,
    clearImages,
    removeImage,
  } = useFileProcessor();

  const { coordinates, mapConfig, addCoordinates, clearCoordinates } =
    useAppState();

  // Extract coordinates from processed images
  const imageCoordinates: Coordinates[] = useMemo(
    () => images.map(img => ({ lat: img.lat, lng: img.lng })),
    [images]
  );

  // Update coordinates when images change
  useMemo(() => {
    if (imageCoordinates.length > coordinates.length) {
      const newCoords = imageCoordinates.slice(coordinates.length);
      addCoordinates(newCoords);
    }
  }, [imageCoordinates, coordinates, addCoordinates]);

  const handleClearAll = () => {
    clearImages();
    clearCoordinates();
  };

  const handleRemoveImage = (id: string) => {
    removeImage(id);
    // Recalculate coordinates after removing image
    const remainingImages = images.filter(img => img.id !== id);
    const remainingCoords = remainingImages.map(img => ({
      lat: img.lat,
      lng: img.lng,
    }));
    clearCoordinates();
    if (remainingCoords.length > 0) {
      addCoordinates(remainingCoords);
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="app error">
        <div className="error-container">
          <h1>Configuration Error</h1>
          <p>
            Google Maps API key is required. Please set the
            VITE_GOOGLE_MAPS_API_KEY environment variable.
          </p>
          <p>
            Create a <code>.env.local</code> file in the project root with:
          </p>
          <pre>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📍 GPS Heatmap Visualizer</h1>
        <p>Upload JPEG, HEIC, or HEIF images with GPS data to visualize them on a heatmap</p>
      </header>

      <main className="app-main">
        <div className="upload-section">
          <FileUpload
            onFilesSelected={processFiles}
            processingState={processingState}
            disabled={processingState.isProcessing}
          />

          <DataSummary
            images={images}
            processingState={processingState}
            onClearData={handleClearAll}
            onRemoveImage={handleRemoveImage}
          />
        </div>

        <div className="map-section">
          {coordinates.length > 0 ? (
            <Map
              coordinates={coordinates}
              config={mapConfig}
              apiKey={GOOGLE_MAPS_API_KEY}
            />
          ) : (
            <div className="map-placeholder">
              <div className="placeholder-content">
                <h3>🗺️ Your heatmap will appear here</h3>
                <p>Upload some images with GPS data to get started</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with React 19, TypeScript, and Google Maps • Supports JPEG, HEIC, and HEIF
          images with EXIF GPS data
        </p>
      </footer>
    </div>
  );
}

export default App;
import type { ImageWithLocation, ProcessingState } from '@/types';

interface DataSummaryProps {
  images: ImageWithLocation[];
  processingState: ProcessingState;
  onClearData: () => void;
  onRemoveImage?: (id: string) => void;
}

export function DataSummary({
  images,
  processingState,
  onClearData,
  onRemoveImage,
}: DataSummaryProps) {
  const { processedCount, totalCount, errors } = processingState;
  const hasData = images.length > 0;
  const hasErrors = errors.length > 0;

  if (!hasData && !hasErrors && processedCount === 0) {
    return null;
  }

  return (
    <div className="data-summary">
      <div className="summary-header">
        <h3>Data Summary</h3>
        {hasData && (
          <button
            onClick={onClearData}
            className="clear-button"
            aria-label="Clear all data"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="summary-stats">
        <div className="stat">
          <span className="stat-label">Images Processed:</span>
          <span className="stat-value">{images.length}</span>
        </div>

        {totalCount > 0 && (
          <div className="stat">
            <span className="stat-label">Success Rate:</span>
            <span className="stat-value">
              {Math.round((images.length / totalCount) * 100)}%
            </span>
          </div>
        )}

        {hasErrors && (
          <div className="stat error">
            <span className="stat-label">Errors:</span>
            <span className="stat-value">{errors.length}</span>
          </div>
        )}
      </div>

      {hasData && (
        <div className="image-list">
          <h4>Processed Images:</h4>
          <div className="image-grid">
            {images.map(image => (
              <div key={image.id} className="image-item">
                <div className="image-info">
                  <span className="image-name" title={image.fileName}>
                    {image.fileName} ({image.format})
                  </span>
                  <span className="image-coords">
                    {image.lat.toFixed(4)}, {image.lng.toFixed(4)}
                  </span>
                </div>
                {onRemoveImage && (
                  <button
                    onClick={() => onRemoveImage(image.id)}
                    className="remove-button"
                    aria-label={`Remove ${image.fileName}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasErrors && (
        <details className="error-details">
          <summary>View Errors ({errors.length})</summary>
          <div className="error-list">
            {errors.map((error, index) => (
              <div key={index} className="error-item">
                <strong>{error.fileName}:</strong> {error.message}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
import { useRef, useState, useCallback } from 'react';
import type { ProcessingState } from '@/types';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  processingState: ProcessingState;
  disabled?: boolean;
}

export function FileUpload({
  onFilesSelected,
  processingState,
  disabled = false,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFilesSelected(Array.from(files));
    },
    [onFilesSelected]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(event.target.files);
      // Reset input value so same files can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = event.dataTransfer.files;
      handleFileSelect(files);
    },
    [disabled, handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const { isProcessing, processedCount, totalCount, errors } = processingState;

  return (
    <div className="file-upload">
      <div
        className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${
          disabled ? 'disabled' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload images with GPS data"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.heic,.heif,image/jpeg,image/heic,image/heif"
          multiple
          onChange={handleInputChange}
          disabled={disabled}
          style={{ display: 'none' }}
          aria-label="Select image files"
        />

        <div className="drop-zone-content">
          {isProcessing ? (
            <div className="processing-indicator">
              <div className="spinner" />
              <p>Processing images...</p>
              <p className="progress">
                {processedCount} of {totalCount} processed
              </p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📷</div>
              <h3>Upload Images with GPS Data</h3>
              <p>
                Drag and drop images here, or click to select files
              </p>
              <p className="file-types">
                Supported formats: JPEG (.jpg, .jpeg), HEIC (.heic, .heif)
              </p>
            </>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="error-list">
          <h4>Processing Errors:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                <strong>{error.fileName}:</strong> {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
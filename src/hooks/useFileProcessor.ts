import { useState, useCallback } from 'react';
import type {
  ImageWithLocation,
  ProcessingState,
  ProcessingError,
  FileProcessingStatus,
} from '@/types';
import { processImageFiles, filterSupportedImages } from '@/utils/exif';

export interface UseFileProcessorReturn {
  status: FileProcessingStatus;
  processingState: ProcessingState;
  images: ImageWithLocation[];
  processFiles: (files: File[]) => Promise<void>;
  clearImages: () => void;
  removeImage: (id: string) => void;
}

export function useFileProcessor(): UseFileProcessorReturn {
  const [status, setStatus] = useState<FileProcessingStatus>('idle');
  const [images, setImages] = useState<ImageWithLocation[]>([]);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    processedCount: 0,
    totalCount: 0,
    errors: [],
  });

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setStatus('processing');
    setProcessingState({
      isProcessing: true,
      processedCount: 0,
      totalCount: files.length,
      errors: [],
    });

    try {
      // Filter to only supported image types
      const { supported, unsupported } = filterSupportedImages(files);

      // Add errors for unsupported files
      const unsupportedErrors: ProcessingError[] = unsupported.map(fileName => ({
        fileName,
        message: 'Unsupported file type. Supported formats: JPEG, HEIC, HEIF.',
      }));

      if (supported.length === 0) {
        setProcessingState(prev => ({
          ...prev,
          isProcessing: false,
          errors: unsupportedErrors,
        }));
        setStatus('error');
        return;
      }

      // Process the supported files
      const { success, errors } = await processImageFiles(supported);

      // Update images state
      setImages(prev => [...prev, ...success]);

      // Update processing state
      setProcessingState({
        isProcessing: false,
        processedCount: success.length,
        totalCount: files.length,
        errors: [...unsupportedErrors, ...errors],
      });

      setStatus(errors.length > 0 ? 'error' : 'completed');
    } catch (error) {
      setProcessingState(prev => ({
        ...prev,
        isProcessing: false,
        errors: [
          ...prev.errors,
          {
            fileName: 'Processing Error',
            message:
              error instanceof Error ? error.message : 'Unknown processing error',
          },
        ],
      }));
      setStatus('error');
    }
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setStatus('idle');
    setProcessingState({
      isProcessing: false,
      processedCount: 0,
      totalCount: 0,
      errors: [],
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  return {
    status,
    processingState,
    images,
    processFiles,
    clearImages,
    removeImage,
  };
}
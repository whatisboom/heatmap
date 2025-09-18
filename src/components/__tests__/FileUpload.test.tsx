import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '../FileUpload';
import type { ProcessingState } from '../../types';

describe('FileUpload', () => {
  const defaultProcessingState: ProcessingState = {
    isProcessing: false,
    processedCount: 0,
    totalCount: 0,
    errors: [],
  };

  it('should render upload interface', () => {
    const onFilesSelected = vi.fn();

    render(
      <FileUpload
        onFilesSelected={onFilesSelected}
        processingState={defaultProcessingState}
      />
    );

    expect(screen.getByText('Upload Images with GPS Data')).toBeInTheDocument();
    expect(screen.getByText(/Drag and drop JPEG images here/)).toBeInTheDocument();
    expect(screen.getByText(/Supported formats: JPEG/)).toBeInTheDocument();
  });

  it('should show processing state when processing', () => {
    const processingState: ProcessingState = {
      isProcessing: true,
      processedCount: 2,
      totalCount: 5,
      errors: [],
    };

    render(
      <FileUpload
        onFilesSelected={vi.fn()}
        processingState={processingState}
      />
    );

    expect(screen.getByText('Processing images...')).toBeInTheDocument();
    expect(screen.getByText('2 of 5 processed')).toBeInTheDocument();
  });

  it('should display errors when present', () => {
    const processingState: ProcessingState = {
      isProcessing: false,
      processedCount: 1,
      totalCount: 2,
      errors: [
        { fileName: 'test.jpg', message: 'No GPS data found' },
        { fileName: 'invalid.png', message: 'Unsupported file type' },
      ],
    };

    render(
      <FileUpload
        onFilesSelected={vi.fn()}
        processingState={processingState}
      />
    );

    expect(screen.getByText('Processing Errors:')).toBeInTheDocument();
    expect(screen.getByText('test.jpg:')).toBeInTheDocument();
    expect(screen.getByText('No GPS data found')).toBeInTheDocument();
    expect(screen.getByText('invalid.png:')).toBeInTheDocument();
    expect(screen.getByText('Unsupported file type')).toBeInTheDocument();
  });

  it('should handle file selection', async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();

    render(
      <FileUpload
        onFilesSelected={onFilesSelected}
        processingState={defaultProcessingState}
      />
    );

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Select image files');

    await user.upload(input, file);

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('should handle multiple file selection', async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();

    render(
      <FileUpload
        onFilesSelected={onFilesSelected}
        processingState={defaultProcessingState}
      />
    );

    const files = [
      new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['content2'], 'test2.jpg', { type: 'image/jpeg' }),
    ];
    const input = screen.getByLabelText('Select image files');

    await user.upload(input, files);

    expect(onFilesSelected).toHaveBeenCalledWith(files);
  });

  it('should be disabled when processing', () => {
    const processingState: ProcessingState = {
      isProcessing: true,
      processedCount: 0,
      totalCount: 1,
      errors: [],
    };

    render(
      <FileUpload
        onFilesSelected={vi.fn()}
        processingState={processingState}
        disabled={true}
      />
    );

    const dropZone = screen.getByRole('button');
    expect(dropZone).toHaveClass('disabled');
    expect(dropZone).toHaveAttribute('tabIndex', '-1');
  });

  it('should handle drag and drop', async () => {
    const onFilesSelected = vi.fn();

    render(
      <FileUpload
        onFilesSelected={onFilesSelected}
        processingState={defaultProcessingState}
      />
    );

    const dropZone = screen.getByRole('button');
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    // Simulate drag over
    fireEvent.dragOver(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(dropZone).toHaveClass('drag-over');

    // Simulate drop
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
    expect(dropZone).not.toHaveClass('drag-over');
  });

  it('should handle drag leave', () => {
    render(
      <FileUpload
        onFilesSelected={vi.fn()}
        processingState={defaultProcessingState}
      />
    );

    const dropZone = screen.getByRole('button');

    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveClass('drag-over');

    fireEvent.dragLeave(dropZone);
    expect(dropZone).not.toHaveClass('drag-over');
  });
});
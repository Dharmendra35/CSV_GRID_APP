import React, { useRef, useCallback, memo } from 'react';
import { validateCSVFile, parseCSVFile, generateColumnDefinitions } from '../utils/csvParser';
import { GridData, ColumnDefinition } from '../types';

interface FileUploadProps {
  onFileUpload: (data: GridData[], columns: ColumnDefinition[], error?: string | null) => void;
  isLoading: boolean;
  error: string | null;
}

const FileUploadComponent: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateCSVFile(file);
    if (!validation.valid) {
      onFileUpload([], [], validation.error);
      return;
    }

    try {
      const { data, headers } = await parseCSVFile(file);
      if (headers.length === 0) {
        onFileUpload([], [], 'CSV file appears to be empty or has no headers');
        return;
      }
      const columns = generateColumnDefinitions(headers, data);
      onFileUpload(data, columns, null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error while parsing CSV';
      onFileUpload([], [], errorMessage);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  }, []);

  return (
    <div className="w-full p-8 bg-white rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-8l-3.172-3.172a4 4 0 00-5.656 0L28 20m0 0l-3.172-3.172a4 4 0 00-5.656 0L12 28m16-8v8m0 0H12m16 0l4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        
        <p className="mt-4 text-lg font-medium text-gray-900">Upload CSV File</p>
        <p className="mt-2 text-sm text-gray-500">Drag and drop your CSV file here or click to select</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? 'Loading...' : 'Select CSV File'}
        </button>

        {error && <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>}
        <p className="mt-4 text-xs text-gray-400">Max file size: 10MB</p>
      </div>
    </div>
  );
};

export const FileUpload = memo(FileUploadComponent);

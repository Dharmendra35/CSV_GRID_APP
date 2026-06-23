import { useState, useCallback } from 'react';
import { FileUpload, ColumnSelector, DataGrid } from './components';
import { GridData, ColumnDefinition } from './types';

function App() {
  const [data, setData] = useState<GridData[]>([]);
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((
    uploadedData: GridData[],
    uploadedColumns: ColumnDefinition[],
    uploadError?: string | null
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (uploadError) {
        setError(uploadError);
        setData([]);
        setColumns([]);
        setSelectedColumns(new Set());
      } else if (uploadedData.length === 0 || uploadedColumns.length === 0) {
        setError('No data found in CSV file');
        setData([]);
        setColumns([]);
        setSelectedColumns(new Set());
      } else {
        setData(uploadedData);
        setColumns(uploadedColumns);
        
        // Select all columns by default
        const columnFields = new Set(uploadedColumns.map(col => col.field));
        setSelectedColumns(columnFields);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setColumns([]);
      setSelectedColumns(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleColumnToggle = useCallback((field: string) => {
    setSelectedColumns(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(field)) {
        newSelected.delete(field);
      } else {
        newSelected.add(field);
      }
      return newSelected;
    });
  }, []);

  const hasData = data.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Grid Application</h1>
              <p className="mt-1 text-sm text-gray-500">
                Upload, select, and analyze your CSV data with advanced features
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {hasData ? `${data.length} rows` : 'No data'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!hasData ? (
          // Upload Section
          <div className="max-w-2xl mx-auto">
            <FileUpload
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              error={error}
            />

            {/* Features Overview */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Easy Upload</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop or select CSV files up to 10MB
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Smart Selection</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Choose which columns to display and analyze
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Advanced Features</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Sorting, filtering, and conditional styling
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Data Display Section
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Column Selector */}
              <div className="lg:col-span-1">
                <ColumnSelector
                  columns={columns}
                  selectedColumns={selectedColumns}
                  onColumnToggle={handleColumnToggle}
                />
              </div>

              {/* Data Grid */}
              <div className="lg:col-span-2">
                <DataGrid
                  data={data}
                  columns={columns}
                  selectedColumns={selectedColumns}
                />
              </div>
            </div>

            {/* Upload New File */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload New File
              </h2>
              <div className="max-w-2xl">
                <FileUpload
                  onFileUpload={handleFileUpload}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-500">
            CSV Grid Application • Built with React, TypeScript, and AG Grid
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

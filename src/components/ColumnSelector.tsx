import React, { memo, useCallback } from 'react';
import { ColumnDefinition } from '../types';

interface ColumnSelectorProps {
  columns: ColumnDefinition[];
  selectedColumns: Set<string>;
  onColumnToggle: (field: string) => void;
}

const ColumnSelectorComponent: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumns,
  onColumnToggle,
}) => {
  const handleSelectAll = useCallback(() => {
    columns.forEach(col => {
      if (!selectedColumns.has(col.field)) {
        onColumnToggle(col.field);
      }
    });
  }, [columns, selectedColumns, onColumnToggle]);

  const handleDeselectAll = useCallback(() => {
    Array.from(selectedColumns).forEach(field => {
      if (selectedColumns.has(field)) {
        onColumnToggle(field);
      }
    });
  }, [selectedColumns, onColumnToggle]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Columns to Display</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {columns.map((column) => (
          <label
            key={column.field}
            className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedColumns.has(column.field)}
              onChange={() => onColumnToggle(column.field)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-sm text-gray-700 font-medium">{column.headerName}</span>
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{column.type}</span>
          </label>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>{selectedColumns.size}</strong> of <strong>{columns.length}</strong> columns selected
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSelectAll}
          className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Select All
        </button>
        <button
          onClick={handleDeselectAll}
          className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Deselect All
        </button>
      </div>
    </div>
  );
};

export const ColumnSelector = memo(ColumnSelectorComponent);

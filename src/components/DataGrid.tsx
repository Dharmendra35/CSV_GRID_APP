import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef } from 'ag-grid-community';
import { GridData, ColumnDefinition } from '../types';
import { applyConditionalStyling } from '../utils/gridFilters';

ModuleRegistry.registerModules([AllCommunityModule]);

interface DataGridProps {
  data: GridData[];
  columns: ColumnDefinition[];
  selectedColumns: Set<string>;
}

export const DataGrid: React.FC<DataGridProps> = ({ data, columns, selectedColumns }) => {
  const visibleColumns = columns.filter(col => selectedColumns.has(col.field));

  const columnDefs: ColDef[] = visibleColumns.map(column => {
    const colDef: ColDef = {
      field: column.field,
      headerName: column.headerName,
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
    };

    if (column.filterType === 'number') {
      colDef.filter = 'agNumberColumnFilter';
      colDef.filterParams = {
        filterOptions: ['equals', 'notEqual', 'greaterThan', 'lessThan', 'inRange'],
        suppressAndOrCondition: true,
        maxNumConditions: 1,
        buttons: ['apply', 'reset', 'clear'],
      };
    } else if (column.filterType === 'date') {
      colDef.filter = 'agDateColumnFilter';
      colDef.filterParams = {
        filterOptions: ['equals', 'notEqual', 'greaterThan', 'lessThan', 'inRange'],
        suppressAndOrCondition: true,
        maxNumConditions: 1,
        buttons: ['apply', 'reset', 'clear'],
      };
    } else {
      colDef.filter = 'agTextColumnFilter';
      colDef.filterParams = {
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        suppressAndOrCondition: true,
        maxNumConditions: 1,
        buttons: ['apply', 'reset', 'clear'],
      };
    }

    colDef.cellStyle = (params) => {
      const value = params.value;
      if (value === null || value === undefined || value === '') {
        return { backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 'bold' };
      }
      return applyConditionalStyling(params.data, column.field, value);
    };

    return colDef;
  });

  if (visibleColumns.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">Please select at least one column to display</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          defaultColDef={{
            flex: 1,
            minWidth: 150,
            sortable: true,
            filter: true,
            resizable: true,
          }}
          theme="legacy"
        />
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Total Rows: <strong>{data.length}</strong></span>
          <span>Visible Columns: <strong>{visibleColumns.length}</strong></span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-green-200 border border-green-600"></span>
            Values &gt; 1000
            <span className="inline-block w-4 h-4 bg-red-200 border border-red-600 ml-4"></span>
            Empty cells
            <span className="inline-block w-4 h-4 bg-blue-200 border border-blue-600 ml-4"></span>
            Excellent
            <span className="inline-block w-4 h-4 bg-yellow-200 border border-yellow-600 ml-4"></span>
            Fair/Poor
          </p>
        </div>
      </div>
    </div>
  );
};

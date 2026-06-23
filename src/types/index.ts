export interface ColumnDefinition {
  field: string;
  headerName: string;
  type?: string;
  width?: number;
  sortable?: boolean;
  filter?: boolean;
  filterType?: 'text' | 'number' | 'date';
}

export interface GridData {
  [key: string]: string | number | boolean;
}

export interface FileUploadState {
  data: GridData[];
  columns: ColumnDefinition[];
  selectedColumns: Set<string>;
  isLoading: boolean;
  error: string | null;
}

export interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: string | number | [number, number];
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

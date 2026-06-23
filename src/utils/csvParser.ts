import Papa from 'papaparse';
import { GridData, ColumnDefinition } from '../types';

export const parseCSVFile = (file: File): Promise<{
  data: GridData[];
  headers: string[];
}> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const data = (results.data as GridData[]).filter(row => Object.values(row).some(val => val !== ''));
        resolve({ data, headers });
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
};

export const detectColumnType = (values: (string | number)[]): 'number' | 'date' | 'text' => {
  const samples = values.filter(v => v !== '' && v !== null && v !== undefined);
  
  if (samples.length === 0) return 'text';

  // Check if all non-empty values are valid numbers
  const allNumbers = samples.every(v => {
    const num = Number(v);
    // Exclude values that parse but are actually date-like strings
    const str = String(v).trim();
    // Don't count pure number strings or scientific notation
    return !isNaN(num) && str !== '' && !isNaN(parseFloat(str));
  });
  
  if (allNumbers) return 'number';

  // Check if all non-empty values are dates (strict validation)
  // Use regex to validate ISO date format or common date patterns
  const dateRegex = /^\d{4}-\d{2}-\d{2}|^\d{1,2}\/\d{1,2}\/\d{2,4}|^\d{1,2}-\d{1,2}-\d{2,4}/;
  const allDates = samples.every(v => {
    const str = String(v).trim();
    // Only accept if matches date pattern AND parses as valid date
    if (!dateRegex.test(str)) return false;
    const time = Date.parse(str);
    return !isNaN(time);
  });
  
  if (allDates) return 'date';

  return 'text';
};

export const generateColumnDefinitions = (
  headers: string[],
  data: GridData[]
): ColumnDefinition[] => {
  return headers.map(header => {
    const values = data.map(row => row[header]);
    const type = detectColumnType(values as (string | number)[]);

    return {
      field: header,
      headerName: header,
      type,
      sortable: true,
      filter: true,
      filterType: type === 'number' ? 'number' : type === 'date' ? 'date' : 'text',
      width: Math.max(150, header.length * 15),
    };
  });
};

export const validateCSVFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
    return { valid: false, error: 'Only CSV files are supported' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  return { valid: true };
};

import { GridData, FilterConfig } from '../types';

export const applyFilters = (data: GridData[], filters: FilterConfig[]): GridData[] => {
  if (filters.length === 0) return data;

  return data.filter(row => {
    return filters.every(filter => {
      const value = row[filter.field];

      switch (filter.operator) {
        case 'equals':
          return String(value).toLowerCase() === String(filter.value).toLowerCase();
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'greater':
          return Number(value) > Number(filter.value);
        case 'less':
          return Number(value) < Number(filter.value);
        case 'between':
          if (Array.isArray(filter.value) && filter.value.length === 2) {
            const [min, max] = filter.value;
            const numValue = Number(value);
            return numValue >= min && numValue <= max;
          }
          return true;
        default:
          return true;
      }
    });
  });
};

export const applySorting = (
  data: GridData[],
  sortField: string,
  sortDirection: 'asc' | 'desc'
): GridData[] => {
  const sorted = [...data].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
      return sortDirection === 'asc'
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    }

    const dateA = new Date(String(valueA)).getTime();
    const dateB = new Date(String(valueB)).getTime();
    if (!isNaN(dateA) && !isNaN(dateB)) {
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    return sortDirection === 'asc'
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });

  return sorted;
};

export const applyConditionalStyling = (
  _row: GridData,
  _column: string,
  value: any
): { backgroundColor?: string; color?: string; fontWeight?: string } => {
  if (value === '' || value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return { backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 'bold' };
  }

  const numericValue = Number(value);
  if (!isNaN(numericValue) && numericValue > 1000) {
    return { backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' };
  }

  if (String(value).toLowerCase() === 'excellent') {
    return { backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' };
  }

  if (String(value).toLowerCase() === 'fair' || String(value).toLowerCase() === 'poor') {
    return { backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 'bold' };
  }

  return {};
};

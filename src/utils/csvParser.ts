import Papa from 'papaparse';
import type { CSVData, ColumnInfo } from '../types';

// Parse European number format (comma as decimal separator)
export const parseEuropeanNumber = (value: string): number => {
  if (!value || typeof value !== 'string') return NaN;
  
  const str = value.toString().trim();
  if (!str) return NaN;
  
  // Replace comma with dot for decimal separator
  const normalizedStr = str.replace(',', '.');
  
  return parseFloat(normalizedStr);
};

export const parseCSV = (file: File): Promise<CSVData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings for better control
      delimiter: ';', // European CSV format uses semicolon
      complete: (result: Papa.ParseResult<Record<string, any>>) => {
        if (result.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${result.errors[0].message}`));
          return;
        }

        const data: CSVData = {
          headers: result.meta.fields || [],
          rows: result.data as Record<string, any>[]
        };

        resolve(data);
      },
      error: (error: Error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      }
    });
  });
};

export const analyzeColumns = (csvData: CSVData): ColumnInfo[] => {
  return csvData.headers.map(header => {
    const values = csvData.rows.map(row => row[header]).filter(val => val != null && val !== '');
    
    if (values.length === 0) {
      return { name: header, type: 'string', values: [] };
    }

    const isNumeric = isNumericColumn(values);
    const isDate = isDateColumn(values);

    
    // Check numeric FIRST to avoid date misclassification
    if (isNumeric && !isDate) {
      return {
        name: header,
        type: 'number',
        values: values.map(val => parseEuropeanNumber(val.toString())).filter(num => !isNaN(num))
      };
    }
    
    // Then check if it's a date
    if (isDate) {
      return {
        name: header,
        type: 'date',
        values: values.map(val => parseDate(val)).filter(date => date !== null)
      };
    }

    // Default to string
    return {
      name: header,
      type: 'string',
      values: values
    };
  });
};

const isDateColumn = (values: any[]): boolean => {
  const sampleSize = Math.min(10, values.length);
  const samples = values.slice(0, sampleSize);
  
  let dateCount = 0;
  for (const sample of samples) {
    const str = sample?.toString().trim();
    if (!str) continue;
    
    // Only consider it a date if it contains date separators and matches common date patterns
    if (str.includes('-') || str.includes('/') || str.includes('.')) {
      if (parseDate(sample) !== null) {
        dateCount++;
      }
    }
  }
  
  return samples.length > 0 && (dateCount / samples.length) > 0.7; // 70% threshold
};

const isNumericColumn = (values: any[]): boolean => {
  if (values.length === 0) return false;
  
  const sampleSize = Math.min(values.length, 10);
  const samples = values.slice(0, sampleSize);
  
  let numericCount = 0;
  for (const sample of samples) {
    if (sample == null || sample === '') continue;
    
    const str = sample.toString().trim();
    if (!str) continue;
    
    // Check if it's purely numeric (no date separators like - or /)
    if (!str.includes('-') && !str.includes('/')) {
      const num = parseEuropeanNumber(str);
      if (!isNaN(num) && isFinite(num)) {
        numericCount++;
      }
    }
  }
  
  return samples.length > 0 && (numericCount / samples.length) >= 0.7; // 70% threshold
};

export const parseDate = (value: any): Date | null => {
  if (!value) return null;
  
  const dateStr = value.toString().trim();
  
  // Handle European format: DD.MM.YYYY HH:MM or DD.MM.YYYY
  const europeanWithTime = /^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/;
  const europeanDateOnly = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
  
  let match = dateStr.match(europeanWithTime);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
    const year = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const second = match[6] ? parseInt(match[6], 10) : 0;
    
    const date = new Date(year, month, day, hour, minute, second);
    return isNaN(date.getTime()) ? null : date;
  }
  
  match = dateStr.match(europeanDateOnly);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
    const year = parseInt(match[3], 10);
    
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }
  
  // Try other formats
  const formats = [
    // ISO format
    /^\d{4}-\d{2}-\d{2}$/,
    // US format
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    // With time
    /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/
  ];
  
  // Check if it matches any known format
  const matchesFormat = formats.some(format => format.test(dateStr));
  
  if (matchesFormat) {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }
  
  // Try parsing as timestamp
  const timestamp = parseFloat(dateStr);
  if (!isNaN(timestamp)) {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 3000) {
      return date;
    }
  }
  
  return null;
};
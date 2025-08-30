export interface CSVData {
  headers: string[];
  rows: Record<string, any>[];
}

export interface ColumnInfo {
  name: string;
  type: 'string' | 'number' | 'date';
  values: any[];
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface ChartDataset {
  label: string;
  data: { x: string | Date; y: number }[];
  borderColor: string;
  backgroundColor: string;
  tension?: number;
}

export interface AppState {
  csvData: CSVData | null;
  columns: ColumnInfo[];
  selectedXColumn: string | null;
  selectedYColumns: string[];
  dateRange: DateRange;
  isLoading: boolean;
  error: string | null;
}
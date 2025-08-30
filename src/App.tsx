import { useState, useCallback, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { ColumnSelector } from './components/ColumnSelector';
import { DateFilter } from './components/DateFilter';
import { GraphVisualization } from './components/GraphVisualization';
import { parseCSV, analyzeColumns } from './utils/csvParser';
import { getDateRange } from './utils/dateUtils';
import type { AppState } from './types';
import { BarChart3 } from 'lucide-react';

function App() {
  const [state, setState] = useState<AppState>({
    csvData: null,
    columns: [],
    selectedXColumn: null,
    selectedYColumns: [],
    dateRange: { start: null, end: null },
    isLoading: false,
    error: null
  });

  const handleFileSelect = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const csvData = await parseCSV(file);
      const columns = analyzeColumns(csvData);
      
      // Auto-select first date column if available
      const dateColumn = columns.find(col => col.type === 'date');
      
      setState(prev => ({
        ...prev,
        csvData,
        columns,
        selectedXColumn: dateColumn?.name || null,
        selectedYColumns: [],
        dateRange: { start: null, end: null },
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to parse CSV file'
      }));
    }
  }, []);

  const handleXColumnChange = useCallback((column: string | null) => {
    setState(prev => ({ ...prev, selectedXColumn: column }));
  }, []);

  const handleYColumnsChange = useCallback((columns: string[]) => {
    setState(prev => ({ ...prev, selectedYColumns: columns }));
  }, []);

  const handleDateRangeChange = useCallback((dateRange: AppState['dateRange']) => {
    setState(prev => ({ ...prev, dateRange }));
  }, []);

  const availableDateRange = useMemo(() => {
    if (!state.selectedXColumn || !state.csvData) return null;
    
    const xColumn = state.columns.find(col => col.name === state.selectedXColumn);
    if (!xColumn || xColumn.type !== 'date') return null;
    
    return getDateRange(xColumn.values as Date[]);
  }, [state.selectedXColumn, state.columns, state.csvData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">CSV Graph Visualizer</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Upload your CSV file and create interactive line charts from your data
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* File Upload */}
        <FileUpload
          onFileSelect={handleFileSelect}
          isLoading={state.isLoading}
          error={state.error}
        />

        {/* Column Selection */}
        {state.csvData && (
          <ColumnSelector
            columns={state.columns}
            selectedXColumn={state.selectedXColumn}
            selectedYColumns={state.selectedYColumns}
            onXColumnChange={handleXColumnChange}
            onYColumnsChange={handleYColumnsChange}
          />
        )}

        {/* Date Filter */}
        {state.selectedXColumn && availableDateRange && (
          <DateFilter
            dateRange={state.dateRange}
            onDateRangeChange={handleDateRangeChange}
            availableDateRange={availableDateRange}
          />
        )}

        {/* Graph */}
        {state.csvData && state.selectedXColumn && state.selectedYColumns.length > 0 && (
          <GraphVisualization
            csvData={state.csvData}
            columns={state.columns}
            selectedXColumn={state.selectedXColumn}
            selectedYColumns={state.selectedYColumns}
            dateRange={state.dateRange}
          />
        )}

        {/* Instructions */}
        {!state.csvData && !state.isLoading && (
          <div className="max-w-2xl mx-auto bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h2>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>1. Upload a CSV file with date and numeric columns</li>
              <li>2. Select a date column for the X-axis</li>
              <li>3. Choose one or more numeric columns for the Y-axis</li>
              <li>4. Optionally filter by date range</li>
              <li>5. View your interactive line chart!</li>
            </ol>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          CSV Graph Visualizer - Built with React, TypeScript, and Chart.js
        </div>
      </footer>
    </div>
  );
}

export default App;
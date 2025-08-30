import React from 'react';
import type { ColumnInfo } from '../types';

interface ColumnSelectorProps {
  columns: ColumnInfo[];
  selectedXColumn: string | null;
  selectedYColumns: string[];
  onXColumnChange: (column: string | null) => void;
  onYColumnsChange: (columns: string[]) => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedXColumn,
  selectedYColumns,
  onXColumnChange,
  onYColumnsChange
}) => {
  const dateColumns = columns.filter(col => col.type === 'date');
  const numericColumns = columns.filter(col => col.type === 'number');

  const handleYColumnToggle = (columnName: string) => {
    const isSelected = selectedYColumns.includes(columnName);
    if (isSelected) {
      onYColumnsChange(selectedYColumns.filter(col => col !== columnName));
    } else {
      onYColumnsChange([...selectedYColumns, columnName]);
    }
  };

  if (columns.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Columns</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* X-Axis (Date) Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            X-Axis (Date Column)
          </label>
          <select
            value={selectedXColumn || ''}
            onChange={(e) => onXColumnChange(e.target.value || null)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a date column...</option>
            {dateColumns.map(column => (
              <option key={column.name} value={column.name}>
                {column.name} ({column.values.length} values)
              </option>
            ))}
          </select>
          {dateColumns.length === 0 && (
            <p className="text-sm text-amber-600 mt-2">
              No date columns detected. Make sure your CSV has proper date formatting.
            </p>
          )}
        </div>

        {/* Y-Axis (Numeric) Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Y-Axis (Numeric Columns)
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
            {numericColumns.length > 0 ? (
              numericColumns.map(column => (
                <label key={column.name} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedYColumns.includes(column.name)}
                    onChange={() => handleYColumnToggle(column.name)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {column.name} ({column.values.length} values)
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-amber-600">
                No numeric columns detected. Make sure your CSV has numeric data.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Column Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Available Columns Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-medium">Date:</span> {dateColumns.length}
          </div>
          <div>
            <span className="font-medium">Numeric:</span> {numericColumns.length}
          </div>
          <div>
            <span className="font-medium">Text:</span> {columns.filter(col => col.type === 'string').length}
          </div>
        </div>
      </div>
    </div>
  );
};
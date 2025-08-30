import React from 'react';
import { Calendar } from 'lucide-react';
import type { DateRange } from '../types';
import { formatDate } from '../utils/dateUtils';

interface DateFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  availableDateRange: { min: Date; max: Date } | null;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  dateRange,
  onDateRangeChange,
  availableDateRange
}) => {
  const handleStartDateChange = (value: string) => {
    const date = value ? new Date(value) : null;
    onDateRangeChange({ ...dateRange, start: date });
  };

  const handleEndDateChange = (value: string) => {
    const date = value ? new Date(value) : null;
    onDateRangeChange({ ...dateRange, end: date });
  };

  const resetDateRange = () => {
    onDateRangeChange({ start: null, end: null });
  };

  if (!availableDateRange) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Date Range Filter
        </h2>
        <button
          onClick={resetDateRange}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Clear Filter
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start ? formatDate(dateRange.start) : ''}
            onChange={(e) => handleStartDateChange(e.target.value)}
            min={formatDate(availableDateRange.min)}
            max={formatDate(availableDateRange.max)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end ? formatDate(dateRange.end) : ''}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={formatDate(availableDateRange.min)}
            max={formatDate(availableDateRange.max)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Available data range:</span>{' '}
          {formatDate(availableDateRange.min)} to {formatDate(availableDateRange.max)}
        </p>
        {(dateRange.start || dateRange.end) && (
          <p className="text-sm text-blue-800 mt-1">
            <span className="font-medium">Current filter:</span>{' '}
            {dateRange.start ? formatDate(dateRange.start) : 'Beginning'} to{' '}
            {dateRange.end ? formatDate(dateRange.end) : 'End'}
          </p>
        )}
      </div>
    </div>
  );
};
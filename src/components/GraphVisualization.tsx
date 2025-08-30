import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import type { CSVData, DateRange, ColumnInfo } from '../types';
import { isDateInRange } from '../utils/dateUtils';
import { parseDate, parseEuropeanNumber } from '../utils/csvParser';
import { Download } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface GraphVisualizationProps {
  csvData: CSVData;
  columns: ColumnInfo[];
  selectedXColumn: string;
  selectedYColumns: string[];
  dateRange: DateRange;
}

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
];

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  csvData,
  columns,
  selectedXColumn,
  selectedYColumns,
  dateRange
}) => {
  const chartData = useMemo(() => {
    if (!selectedXColumn || selectedYColumns.length === 0) {
      return null;
    }

    const xColumn = columns.find(col => col.name === selectedXColumn);
    if (!xColumn || xColumn.type !== 'date') {
      return null;
    }

    // Filter data based on date range
    const filteredRows = csvData.rows.filter(row => {
      const dateValue = parseDate(row[selectedXColumn]);
      if (!dateValue) return false;
      return isDateInRange(dateValue, dateRange.start, dateRange.end);
    });

    // Sort by date
    const sortedRows = filteredRows.sort((a, b) => {
      const dateA = parseDate(a[selectedXColumn]);
      const dateB = parseDate(b[selectedXColumn]);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });

    const datasets = selectedYColumns.map((columnName, index) => {
      const data = sortedRows.map(row => {
        const xValue = parseDate(row[selectedXColumn]);
        const yValue = parseEuropeanNumber(row[columnName]);
        
        return {
          x: xValue,
          y: isNaN(yValue) ? null : yValue
        };
      }).filter(point => point.x && point.y !== null);

      return {
        label: columnName,
        data,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        tension: 0.1,
        fill: false,
      };
    });

    return {
      datasets
    };
  }, [csvData, columns, selectedXColumn, selectedYColumns, dateRange]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: `${selectedYColumns.join(', ')} over ${selectedXColumn}`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = typeof context.parsed.y === 'number' ? 
              context.parsed.y.toLocaleString(undefined, { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 10 
              }) : context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          displayFormats: {
            day: 'MMM dd',
            month: 'MMM yyyy',
            year: 'yyyy'
          },
          tooltipFormat: 'MMM dd, yyyy'
        },
        title: {
          display: true,
          text: selectedXColumn,
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          maxTicksLimit: 8,
          maxRotation: 45,
          minRotation: 0
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: selectedYColumns.length === 1 ? selectedYColumns[0] : 'Values',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          stepSize: undefined,
          precision: undefined,
          callback: function(value: any) {
            if (typeof value === 'number') {
              // Remove trailing zeros but keep significant decimals
              const formatted = value.toLocaleString(undefined, { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 10,
                useGrouping: true
              });
              return formatted;
            }
            return value;
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        // Prevent Chart.js from rounding values
        beginAtZero: false,
        grace: '5%'
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5,
        hitRadius: 10
      },
      line: {
        tension: 0.2
      }
    }
  }), [selectedXColumn, selectedYColumns]);

  const downloadChart = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `chart-${Date.now()}.png`;
      a.href = url;
      a.click();
    }
  };

  if (!chartData) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">
          Select a date column (X-axis) and at least one numeric column (Y-axis) to view the graph.
        </p>
      </div>
    );
  }

  if (chartData.datasets[0]?.data.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">
          No data available for the selected date range. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Graph Visualization</h2>
        <button
          onClick={downloadChart}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
      </div>
      
      <div className="h-[500px] w-full">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Data points:</span>{' '}
          {chartData.datasets.reduce((sum, dataset) => sum + dataset.data.length, 0)} total
        </p>
      </div>
    </div>
  );
};
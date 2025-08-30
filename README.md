# CSV Graph Visualizer

A modern web application for uploading CSV files and creating interactive line charts from your data. Built with React, TypeScript, and Chart.js.

## ✨ Features

- **📁 Drag & Drop Upload**: Easy CSV file upload with drag-and-drop interface
- **🔍 Smart Column Detection**: Automatically detects date, numeric, and text columns
- **📊 Interactive Charts**: Create beautiful line charts with Chart.js
- **📅 Date Range Filtering**: Filter data by custom date ranges
- **📈 Multiple Data Series**: Plot multiple numeric columns on the same chart
- **💾 Export Charts**: Download charts as high-quality PNG images
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **⚡ Real-time Updates**: Charts update instantly as you change selections

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Krowy123/csv-graph-visualizer.git
cd csv-graph-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## 📊 How to Use

1. **Upload CSV File**: Drag and drop your CSV file or click to select
2. **Select X-Axis**: Choose a date column for the X-axis
3. **Select Y-Axis**: Pick one or more numeric columns for the Y-axis
4. **Filter Dates** (Optional): Set a custom date range to focus on specific periods
5. **View Chart**: Your interactive line chart will appear automatically
6. **Export** (Optional): Download your chart as a PNG image

## 📋 CSV Format Requirements

Your CSV file should have:
- **Header row**: Column names in the first row
- **Date column**: At least one column with dates in formats like:
  - `2024-01-01` (ISO format)
  - `01/01/2024` (US format)  
  - `01.01.2024` (European format)
- **Numeric columns**: One or more columns with numeric data

### Example CSV:
```csv
date,revenue,users,orders
2024-01-01,12500,450,89
2024-01-02,13200,467,92
2024-01-03,11800,423,85
```

## 🛠️ Built With

- **React 19** - UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and development server
- **Chart.js** - Interactive charting library
- **Tailwind CSS** - Utility-first CSS framework
- **PapaParse** - CSV parsing library
- **Lucide React** - Beautiful icons

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Chart.js** with react-chartjs-2 wrapper
- **Date-fns** for date handling

### Development
- **Vite** for fast development and building
- **ESLint** for code quality
- **PostCSS** with Autoprefixer

## 🔧 Project Structure

```
src/
├── components/          # React components
│   ├── FileUpload.tsx   # File upload interface
│   ├── ColumnSelector.tsx # Column selection UI
│   ├── DateFilter.tsx   # Date range filtering
│   └── GraphVisualization.tsx # Chart rendering
├── utils/              # Utility functions
│   ├── csvParser.ts    # CSV parsing logic
│   └── dateUtils.ts    # Date handling helpers
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
└── App.tsx             # Main application component
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Roadmap

- [ ] Support for additional chart types (bar, area, scatter)
- [ ] Data export functionality (filtered CSV, JSON)
- [ ] Multiple file comparison
- [ ] Statistical analysis features
- [ ] Dashboard mode with multiple charts
- [ ] User accounts and saved configurations

---

**Built with ❤️ for data visualization**
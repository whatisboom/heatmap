# 📍 GPS Heatmap Visualizer

A modern React application that extracts GPS coordinates from image EXIF data (JPEG, HEIC, HEIF) and visualizes them as an interactive heatmap on Google Maps.

## ✨ Features

- **📸 Image Processing**: Upload multiple images (JPEG, HEIC, HEIF) with GPS EXIF data
- **🗺️ Interactive Heatmap**: Visualize location data on Google Maps with heatmap overlay
- **🎯 Smart Centering**: Automatically centers and zooms map based on data points
- **📊 Data Management**: View processed images, coordinates, and manage your dataset
- **🚫 Error Handling**: Comprehensive error reporting for failed uploads
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Modern Performance**: Built with React 19, TypeScript, and Vite for optimal speed

## 🚀 Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Maps**: Google Maps JavaScript API with @vis.gl/react-google-maps
- **Image Processing**: ExifReader for GPS coordinate extraction (supports JPEG, HEIC, HEIF)
- **Testing**: Vitest + React Testing Library
- **Styling**: Modern CSS with responsive design
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Maps JavaScript API key with Visualization library enabled

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd heatmap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Maps API key**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Google Maps API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## 🔧 Configuration

### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key to your domain
6. Add the key to `.env.local`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

## 📖 Usage

1. **Upload Images**: Drag and drop or click to select JPEG images with GPS data
2. **View Processing**: Monitor upload progress and see any errors
3. **Explore Map**: Interactive heatmap shows your location data
4. **Manage Data**: Remove individual images or clear all data
5. **Export**: View coordinates and file information in the data summary

## 🏗️ Architecture

### Component Structure
```
src/
├── components/          # React components
│   ├── Map.tsx         # Google Maps integration
│   ├── HeatmapLayer.tsx # Heatmap visualization
│   ├── FileUpload.tsx  # File upload with drag-drop
│   ├── DataSummary.tsx # Data management
│   └── ErrorBoundary.tsx # Error handling
├── hooks/              # Custom React hooks
│   ├── useFileProcessor.ts # File processing logic
│   └── useAppState.ts     # Application state
├── utils/              # Utility functions
│   ├── coordinates.ts  # GPS coordinate utilities
│   └── exif.ts        # EXIF data processing
└── types/              # TypeScript definitions
```

### Key Features

- **Custom Hooks**: State management with React 19 hooks instead of Redux
- **TypeScript**: Full type safety throughout the application
- **Modern Testing**: Vitest + React Testing Library for fast, reliable tests
- **Error Boundaries**: Graceful error handling and recovery
- **Responsive Design**: Mobile-first CSS with flexible layouts

## 🧪 Testing

The application includes comprehensive tests:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Test coverage includes:
- Utility functions (coordinate conversion, validation)
- Component rendering and interaction
- Custom hooks behavior
- Error handling scenarios

## 🔍 Supported File Formats

- **JPEG/JPG**: Images with EXIF GPS data
- **GPS Requirements**: Latitude and longitude coordinates in EXIF data
- **Multiple Files**: Batch upload and processing

## 🚨 Error Handling

The application provides detailed error feedback for:
- Missing GPS data in images
- Invalid coordinate values
- Unsupported file formats
- Network or processing errors
- Application crashes (Error Boundary)

## 🎯 Performance

- **Fast Development**: Vite's esbuild for instant hot reload
- **Optimized Builds**: Tree shaking and code splitting
- **Efficient Processing**: Concurrent image processing with limits
- **Memory Management**: Proper cleanup of map layers and event listeners

## 📄 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## 📞 Support

For issues and questions, please check the error messages in the application or review the browser console for detailed debugging information.
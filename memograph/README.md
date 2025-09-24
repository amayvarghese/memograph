# Memograph

A mobile-first web application that allows users to capture a series of 12 images in a 360° circle, guided by their phone's orientation sensors, and then displays them in a 360° panorama viewer.

## Features

- **360° Image Capture**: Capture 12 images at 30° intervals using device orientation
- **Real-time Compass**: Visual compass showing current heading and target angles
- **Mobile-First Design**: Optimized for mobile devices with responsive UI
- **360° Viewer**: Interactive panorama viewer using Pannellum
- **Permission Handling**: Proper handling of camera and orientation permissions

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **360° Viewer**: Pannellum React
- **Device APIs**: Camera API, Device Orientation API

## Project Structure

```
src/
├── app/
│   ├── api/upload/route.ts      # API endpoint for image processing
│   ├── viewer/page.tsx          # 360° panorama viewer page
│   └── page.tsx                 # Main capture page
├── components/
│   ├── CameraFeed.tsx           # Camera preview component
│   ├── CompassUI.tsx            # SVG compass component
│   └── PanoramaViewer.tsx       # 360° viewer component
└── hooks/
    ├── useCamera.ts             # Camera access and capture hook
    └── useOrientation.ts         # Device orientation tracking hook
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## Usage

### Capturing Images

1. **Grant Permissions**: Allow camera and orientation access when prompted
2. **Follow the Compass**: Rotate your device to align with the orange target dot
3. **Capture**: Tap the capture button when aligned (green state)
4. **Repeat**: Continue for all 12 positions (30° intervals)
5. **View**: Automatically redirects to 360° viewer when complete

### 360° Viewer

- **Navigation**: Drag to look around, pinch to zoom
- **Controls**: Use on-screen controls for fullscreen, zoom, etc.
- **Auto-rotation**: Panorama auto-rotates for demonstration

## Key Components

### useCamera Hook
- Manages camera access and video stream
- Handles image capture to canvas
- Returns base64 image data

### useOrientation Hook
- Tracks device compass heading
- Handles iOS permission requests
- Provides real-time orientation data

### CompassUI Component
- SVG-based compass visualization
- Shows current heading, target angle, and captured positions
- Color-coded status indicators

### PanoramaViewer Component
- Integrates Pannellum for 360° viewing
- Handles panorama loading and navigation
- Responsive full-screen experience

## API Endpoints

### POST /api/upload
Processes captured images and returns panorama URL.

**Request Body:**
```json
{
  "images": ["data:image/jpeg;base64,...", ...]
}
```

**Response:**
```json
{
  "success": true,
  "url": "/placeholder-360.jpg",
  "message": "Panorama processing completed successfully"
}
```

## Browser Compatibility

- **Camera API**: Modern browsers with getUserMedia support
- **Device Orientation**: iOS 13+ (requires permission), Android Chrome
- **Mobile Recommended**: Best experience on mobile devices

## Development Notes

- Uses `'use client'` directive for client-side components
- Implements proper error handling for camera/orientation access
- Responsive design with Tailwind CSS
- TypeScript for type safety

## Future Enhancements

- Real panorama stitching integration
- Cloud storage for images
- Social sharing features
- Advanced panorama editing tools
- VR headset support
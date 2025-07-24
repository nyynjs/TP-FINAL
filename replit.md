# TourPlanner PWA Proxy Server

## Overview

This repository contains a Progressive Web Application (PWA) that serves as a proxy server for the TourPlanner API. The application enables users to quickly create actions in TourPlanner through a mobile-friendly interface, bypassing CORS restrictions by routing API calls through a Node.js proxy server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture with the following key components:

### Frontend Architecture
- **Progressive Web App (PWA)**: Built with vanilla HTML, CSS, and JavaScript
- **Mobile-first design**: Responsive interface optimized for mobile devices
- **Service Worker**: Implements caching for offline functionality
- **Web App Manifest**: Enables installation on mobile devices

### Backend Architecture
- **Node.js Express Server**: Acts as a proxy between the frontend and TourPlanner API
- **CORS-enabled**: Handles cross-origin requests from the PWA
- **Request forwarding**: Proxies API calls to the TourPlanner service
- **Static file serving**: Serves the PWA files

## Key Components

### 1. Proxy Server (`server.js`)
- **Purpose**: Acts as an intermediary between the PWA and TourPlanner API
- **Technology**: Express.js with CORS middleware
- **Features**:
  - Health check endpoint (`/health`)
  - Dynamic API path forwarding (`/api/tourplanner/*`)
  - Bearer token authentication handling
  - Request/response logging

### 2. PWA Frontend (`public/`)
- **Main Application** (`app.js`): Core application logic with TourPlannerApp class
- **User Interface** (`index.html`): Main application interface
- **Styling** (`style.css`): CSS with CSS custom properties for theming
- **Debug Panel** (`debug.html`): Development tool for API testing
- **Service Worker** (`sw.js`): Handles caching and offline functionality
- **Web Manifest** (`manifest.json`): PWA configuration and metadata

### 3. Configuration Management
- **Token Storage**: Bearer tokens stored in localStorage
- **Proxy URL Configuration**: Configurable proxy server endpoint
- **Auto-detection**: Automatic proxy URL detection based on current origin

## Data Flow

1. **User Authentication**: Users input Bearer token for TourPlanner API authentication
2. **Configuration**: Proxy server URL is configured (defaults to current origin)
3. **API Requests**: Frontend makes requests to `/api/tourplanner/*` endpoints
4. **Proxy Forwarding**: Server forwards requests to actual TourPlanner API with authentication
5. **Response Handling**: API responses are returned through the proxy to the frontend
6. **Data Management**: Application manages territories, events, and points data locally

## External Dependencies

### Runtime Dependencies
- **express**: Web framework for Node.js proxy server
- **cors**: CORS middleware for handling cross-origin requests
- **node-fetch**: HTTP client for making API requests to TourPlanner
- **nodemon**: Development tool for automatic server restart

### Frontend Dependencies
- **No external frameworks**: Pure vanilla JavaScript implementation
- **Service Worker API**: Browser native PWA functionality
- **LocalStorage API**: Client-side data persistence

## Deployment Strategy

### Development
- Uses nodemon for automatic server restart during development
- Static file serving from `public/` directory
- Health check endpoint for monitoring server status

### Production Considerations
- **Port Configuration**: Uses environment variable `PORT` or defaults to 5000
- **Static Assets**: All frontend assets served from `public/` directory
- **PWA Features**: Installable on mobile devices with offline capabilities
- **Caching Strategy**: Service worker implements cache-first strategy for static assets

### Architecture Decisions

1. **Proxy Server Approach**
   - **Problem**: CORS restrictions preventing direct API calls from browser
   - **Solution**: Node.js proxy server to forward requests
   - **Benefits**: Bypasses CORS, centralizes authentication, enables request logging

2. **PWA Implementation**
   - **Problem**: Need for mobile-friendly, installable application
   - **Solution**: Progressive Web App with service worker and manifest
   - **Benefits**: App-like experience, offline capabilities, easy installation

3. **Vanilla JavaScript Frontend**
   - **Problem**: Need for lightweight, fast-loading interface
   - **Solution**: No frontend frameworks, pure JavaScript
   - **Benefits**: Minimal bundle size, fast loading, no dependency management complexity

4. **Token-based Authentication**
   - **Problem**: Secure API access to TourPlanner
   - **Solution**: Bearer token storage and forwarding through proxy
   - **Benefits**: Secure authentication, user-specific data access
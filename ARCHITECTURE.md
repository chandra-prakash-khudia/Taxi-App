# Taxi App - Complete System Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack Analysis](#technology-stack-analysis)
3. [System Architecture](#system-architecture)
4. [Data Models](#data-models)
5. [API Endpoints](#api-endpoints)
6. [Real-time Communication](#real-time-communication)
7. [Authentication & Authorization](#authentication--authorization)
8. [Complete User Workflow](#complete-user-workflow)
9. [Technology Tradeoffs](#technology-tradeoffs)
10. [Deployment Architecture](#deployment-architecture)
11. [Development Setup](#development-setup)

## System Overview

The Taxi App is a full-stack ride-hailing application similar to Uber/Lyft, built with modern web technologies. It enables passengers to book rides and drivers (captains) to accept and fulfill ride requests in real-time.

### Key Features
- **Dual User Types**: Passengers (users) and drivers (captains)
- **Real-time Ride Matching**: Live location tracking and ride assignment
- **Google Maps Integration**: Geocoding, routing, and distance calculation
- **Real-time Communication**: WebSocket-based updates
- **Secure Authentication**: JWT-based with token blacklisting
- **Complete Ride Lifecycle**: From booking to payment completion

## Technology Stack Analysis

### Backend Technologies

#### Core Framework: Node.js + Express.js
- **Use Case**: RESTful API server for handling HTTP requests
- **Advantages**: 
  - High performance for I/O intensive operations
  - JavaScript across full stack
  - Large ecosystem (npm)
  - Non-blocking event-driven architecture
- **Tradeoffs**: 
  - Single-threaded (CPU intensive tasks can block)
  - Callback complexity (mitigated with async/await)

#### Database: MongoDB with Mongoose
- **Use Case**: Document-based storage for user profiles, ride data, and geospatial queries
- **Advantages**:
  - Flexible schema for evolving requirements
  - Built-in geospatial indexing for location-based queries
  - JSON-like document structure matches JavaScript objects
  - Horizontal scaling capabilities
- **Tradeoffs**:
  - Eventual consistency vs ACID transactions
  - Memory usage can be higher than relational DBs
  - Complex joins are less efficient

#### Real-time Communication: Socket.IO
- **Use Case**: Live ride updates, location tracking, real-time notifications
- **Advantages**:
  - Automatic fallback mechanisms (WebSocket → polling)
  - Room-based communication for targeted messaging
  - Built-in reconnection handling
  - Cross-platform compatibility
- **Tradeoffs**:
  - Additional server resources for maintaining connections
  - Complexity in handling connection states
  - Potential scaling challenges with many concurrent connections

#### Authentication: JSON Web Tokens (JWT)
- **Use Case**: Stateless authentication for API endpoints
- **Advantages**:
  - Stateless (no server-side session storage)
  - Self-contained tokens
  - Scalable across multiple servers
  - Industry standard
- **Tradeoffs**:
  - Token size larger than session IDs
  - Difficult to revoke before expiration (mitigated with blacklist)
  - Sensitive to secret key exposure

#### External APIs: Google Maps Platform
- **Use Case**: Geocoding, distance calculation, route planning, address autocomplete
- **Advantages**:
  - Comprehensive and accurate mapping data
  - Rich feature set (geocoding, routing, places)
  - Reliable service with high availability
- **Tradeoffs**:
  - Cost considerations for high usage
  - External dependency
  - API rate limits

### Frontend Technologies

#### Framework: React 18
- **Use Case**: Component-based UI for ride booking interface
- **Advantages**:
  - Component reusability and modularity
  - Virtual DOM for performance
  - Large ecosystem and community
  - Excellent developer tools
- **Tradeoffs**:
  - Learning curve for beginners
  - Requires additional libraries for complete functionality
  - Bundle size considerations

#### Build Tool: Vite
- **Use Case**: Fast development server and optimized production builds
- **Advantages**:
  - Extremely fast cold start times
  - Hot Module Replacement (HMR)
  - Modern ES modules support
  - Optimized production builds
- **Tradeoffs**:
  - Newer ecosystem compared to Webpack
  - Some plugins may not be available yet

#### Styling: TailwindCSS
- **Use Case**: Utility-first CSS framework for rapid UI development
- **Advantages**:
  - Rapid prototyping and development
  - Consistent design system
  - Small production bundle (purged unused styles)
  - Highly customizable
- **Tradeoffs**:
  - Learning curve for utility-first approach
  - Can lead to verbose HTML classes
  - Design system limitations without customization

#### Animations: GSAP (GreenSock)
- **Use Case**: High-performance animations for enhanced user experience
- **Advantages**:
  - Superior performance compared to CSS animations
  - Complex animation sequencing
  - Cross-browser compatibility
  - Timeline controls
- **Tradeoffs**:
  - Additional bundle size
  - License considerations for commercial use
  - Overkill for simple animations

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile/Web    │    │   Mobile/Web    │    │   Admin Panel   │
│     Client      │    │     Client      │    │   (Future)      │
│   (Passenger)   │    │   (Captain)     │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │                         │
                    │    Load Balancer        │
                    │    (Future/Production)  │
                    │                         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │                         │
                    │   Express.js Server     │
                    │   ┌─────────────────┐   │
                    │   │  REST API       │   │
                    │   │  - Auth         │   │
                    │   │  - Users        │   │
                    │   │  - Rides        │   │
                    │   │  - Maps         │   │
                    │   └─────────────────┘   │
                    │   ┌─────────────────┐   │
                    │   │  Socket.IO      │   │
                    │   │  - Real-time    │   │
                    │   │  - Location     │   │
                    │   │  - Notifications│   │
                    │   └─────────────────┘   │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼───────┐    ┌─────────▼───────┐    ┌─────────▼───────┐
│                 │    │                 │    │                 │
│   MongoDB       │    │  Google Maps    │    │   Redis         │
│   - Users       │    │  - Geocoding    │    │   (Future)      │
│   - Captains    │    │  - Routing      │    │   - Caching     │
│   - Rides       │    │  - Places API   │    │   - Sessions    │
│   - Tokens      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Architecture Layers

#### 1. Presentation Layer (Frontend)
- **React Components**: Modular UI components for different user flows
- **State Management**: Context API for global state (User, Captain, Socket)
- **Routing**: React Router for SPA navigation
- **Real-time Updates**: Socket.IO client for live data

#### 2. API Layer (Backend)
- **Express.js Routes**: RESTful endpoints for CRUD operations
- **Middleware**: Authentication, validation, error handling
- **Controllers**: Business logic orchestration
- **Services**: Reusable business logic modules

#### 3. Real-time Layer
- **Socket.IO Server**: WebSocket management
- **Event Handling**: Custom events for ride lifecycle
- **Room Management**: Targeted messaging to specific users

#### 4. Data Layer
- **MongoDB**: Primary data storage
- **Mongoose ODM**: Object modeling and validation
- **Geospatial Indexing**: Location-based queries

#### 5. External Services Layer
- **Google Maps APIs**: Location and routing services
- **Future Integrations**: Payment gateways, SMS services

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  fullname: {
    firstname: String (required, min: 3),
    lastname: String (min: 3)
  },
  email: String (required, unique, validated),
  password: String (hashed, not selected),
  socketId: String, // For real-time communication
  createdAt: Date,
  updatedAt: Date
}
```

### Captain Model
```javascript
{
  _id: ObjectId,
  fullname: {
    firstname: String (required, min: 3),
    lastname: String (min: 3)
  },
  email: String (required, unique, validated),
  password: String (hashed, not selected),
  socketId: String,
  status: String (enum: ['active', 'inactive'], default: 'inactive'),
  vehicle: {
    color: String (required, min: 3),
    plate: String (required, min: 3),
    capacity: Number (required, min: 1),
    vehicleType: String (enum: ['car', 'motorcycle', 'auto'])
  },
  location: {
    ltd: Number, // Latitude
    lng: Number  // Longitude
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Ride Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'user', required),
  captain: ObjectId (ref: 'captain'),
  pickup: String (required),
  destination: String (required),
  fare: Number (required),
  status: String (enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending'),
  duration: Number, // in seconds
  distance: Number, // in meters
  paymentID: String,
  orderId: String,
  signature: String,
  otp: String (required, not selected),
  createdAt: Date,
  updatedAt: Date
}
```

### BlacklistToken Model
```javascript
{
  _id: ObjectId,
  token: String (required),
  createdAt: Date (expires after 24h)
}
```

## API Endpoints

### Authentication Endpoints

#### User Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile (protected)
- `GET /users/logout` - User logout (protected)

#### Captain Authentication
- `POST /captains/register` - Captain registration
- `POST /captains/login` - Captain login
- `GET /captains/profile` - Get captain profile (protected)
- `GET /captains/logout` - Captain logout (protected)

### Ride Management
- `POST /rides/create` - Create new ride request (user)
- `GET /rides/get-fare` - Calculate ride fare
- `POST /rides/confirm` - Confirm ride (captain)
- `GET /rides/start-ride` - Start ride with OTP verification (captain)
- `POST /rides/end-ride` - End ride (captain)

### Maps & Location
- `GET /maps/get-coordinates` - Get coordinates from address
- `GET /maps/get-distance-time` - Get distance and time between locations
- `GET /maps/get-suggestions` - Get address autocomplete suggestions

## Real-time Communication

### Socket.IO Events

#### Connection Management
```javascript
// Client connects
socket.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
});

// User/Captain joins with identification
socket.on('join', (data) => {
  const { userId, userType } = data;
  // Update user/captain with socketId
});
```

#### Location Updates
```javascript
// Captain location updates
socket.on('update-location-captain', (data) => {
  const { userId, location } = data;
  // Update captain location in database
});
```

#### Ride Lifecycle Events
```javascript
// New ride notification to nearby captains
socket.emit('new-ride', rideData);

// Ride confirmation to user
socket.emit('ride-confirmed', rideData);

// Ride started notification
socket.emit('ride-started', rideData);

// Ride ended notification
socket.emit('ride-ended', rideData);
```

### Event Flow Architecture
```
User Action → API Endpoint → Business Logic → Database Update → Socket Event → Real-time Update
```

## Authentication & Authorization

### JWT Token Flow
1. **Login**: User/Captain provides credentials
2. **Validation**: Server validates and generates JWT
3. **Token Storage**: Frontend stores token (localStorage/cookies)
4. **Request Authentication**: Token sent in Authorization header
5. **Token Verification**: Middleware validates JWT on protected routes
6. **Token Blacklisting**: Logout adds token to blacklist

### Security Measures
- **Password Hashing**: bcrypt with salt rounds (10)
- **Token Expiration**: 24-hour token lifetime
- **Token Blacklisting**: Prevents reuse of logged-out tokens
- **Input Validation**: express-validator for request validation
- **CORS Configuration**: Controlled cross-origin access

## Complete User Workflow

### Passenger Journey

#### 1. Registration & Authentication
```
User Registration → Email Validation → Password Hashing → JWT Generation → Profile Creation
```

#### 2. Ride Booking
```
Login → Home Page → Location Selection → Destination Input → 
Vehicle Type Selection → Fare Calculation → Ride Request → 
Captain Matching → Real-time Updates
```

#### 3. Ride Experience
```
Captain Acceptance → OTP Generation → Captain Details Display → 
Live Tracking → Ride Start (OTP Verification) → Ongoing Ride → 
Ride Completion → Payment Processing
```

### Captain Journey

#### 1. Registration & Onboarding
```
Captain Registration → Vehicle Information → Document Verification → 
Profile Approval → Status: Active
```

#### 2. Availability & Ride Acceptance
```
Login → Location Updates → Ride Notifications → 
Ride Details Review → Accept/Reject → 
Navigation to Pickup → OTP Verification → Ride Start
```

#### 3. Ride Fulfillment
```
Pickup Passenger → Start Ride → Navigate to Destination → 
Complete Ride → Payment Collection → Next Ride
```

### Technical Data Flow

#### Ride Request Flow
```
1. User Input (Pickup/Destination) → Frontend Validation
2. API Call (/rides/create) → Backend Validation
3. Geocoding Service → Coordinate Conversion
4. Database Storage → Ride Record Creation
5. Captain Search → Geospatial Query
6. Socket Notifications → Real-time Updates
7. Captain Response → Ride Confirmation
```

#### Real-time Updates Flow
```
Database Change → Service Layer → Socket.IO Server → 
Event Emission → Client Reception → UI Update
```

## Technology Tradeoffs

### Architecture Decisions

#### Monolithic vs Microservices
**Current Choice**: Monolithic
- **Pros**: Simpler deployment, easier development, lower latency
- **Cons**: Scaling limitations, technology lock-in
- **Alternative**: Microservices for better scalability and team autonomy

#### SQL vs NoSQL
**Current Choice**: MongoDB (NoSQL)
- **Pros**: Geospatial queries, flexible schema, JSON compatibility
- **Cons**: Limited ACID transactions, complex relationships
- **Alternative**: PostgreSQL with PostGIS for relational data with geospatial support

#### Server-Side Rendering vs Client-Side Rendering
**Current Choice**: CSR (Single Page Application)
- **Pros**: Rich interactivity, offline capabilities, reduced server load
- **Cons**: SEO challenges, slower initial load
- **Alternative**: Next.js for SSR/SSG hybrid approach

#### Real-time Communication
**Current Choice**: Socket.IO
- **Pros**: Automatic fallback, room management, ease of use
- **Cons**: Resource intensive, scaling challenges
- **Alternative**: Server-Sent Events for simpler one-way communication

### Performance Considerations

#### Current Limitations
1. **Database Queries**: No connection pooling, missing indexes
2. **Caching**: No caching layer for frequently accessed data
3. **Asset Optimization**: Large bundle sizes without code splitting
4. **API Rate Limiting**: No protection against abuse

#### Recommended Improvements
1. **Database**: Add connection pooling, proper indexing, query optimization
2. **Caching**: Implement Redis for session storage and frequently accessed data
3. **CDN**: Use CDN for static assets and images
4. **Load Balancing**: Implement load balancer for high availability
5. **Code Splitting**: Implement lazy loading for better performance

## Deployment Architecture

### Current Development Setup
```
Frontend (Vite Dev Server) ← → Backend (Node.js) ← → MongoDB (Local/Atlas)
                                      ↓
                              Google Maps APIs
```

### Recommended Production Architecture
```
                      ┌─────────────────┐
                      │       CDN       │
                      │   (Static Assets) │
                      └─────────┬───────┘
                                │
                      ┌─────────▼───────┐
                      │ Load Balancer   │
                      │   (Nginx/AWS)   │
                      └─────────┬───────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
      ┌─────────▼───────┐ ┌─────▼─────┐ ┌─────▼─────┐
      │ App Server 1    │ │App Server │ │App Server │
      │   (Node.js)     │ │     2     │ │     3     │
      └─────────┬───────┘ └─────┬─────┘ └─────┬─────┘
                │               │             │
                └───────────────┼─────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼───────┐ ┌─────▼─────┐ ┌─────▼─────┐
        │   MongoDB     │ │   Redis   │ │  External │
        │   Cluster     │ │  (Cache)  │ │    APIs   │
        │              │ │           │ │           │
        └───────────────┘ └───────────┘ └───────────┘
```

### Deployment Strategies

#### Container Deployment (Recommended)
```dockerfile
# Multi-stage Docker build
FROM node:18-alpine AS builder
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
COPY --from=builder /node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### Environment Configuration
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_BASE_URL=${API_URL}
      
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - DB_CONNECT=${DB_CONNECTION_STRING}
      - GOOGLE_MAPS_API=${GOOGLE_MAPS_API_KEY}
    depends_on:
      - mongodb
      - redis
      
  mongodb:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db
      
  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
```

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google Maps API key

### Installation Steps

#### Backend Setup
```bash
cd backend
npm install
```

#### Environment Variables (.env)
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret_here
DB_CONNECT=mongodb://localhost:27017/taxi-app
GOOGLE_MAPS_API=your_google_maps_api_key
```

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Environment Variables (.env)
```env
VITE_BASE_URL=http://localhost:3000
```

### Development Commands
```bash
# Backend
npm run dev        # Start with nodemon
npm start          # Production start

# Frontend  
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint check
```

### Database Setup
```javascript
// MongoDB indexes for optimization
db.captains.createIndex({ "location": "2dsphere" }) // Geospatial queries
db.users.createIndex({ "email": 1 }, { unique: true })
db.captains.createIndex({ "email": 1 }, { unique: true })
db.rides.createIndex({ "status": 1, "createdAt": -1 })
```

### Google Maps API Setup
Required APIs:
- Geocoding API
- Distance Matrix API
- Places API (Autocomplete)
- Maps JavaScript API (future map display)

## Future Enhancements

### Technical Improvements
1. **Performance Optimization**
   - Implement caching layer (Redis)
   - Database query optimization
   - Code splitting and lazy loading
   - Image optimization and CDN

2. **Scalability Features**
   - Microservices architecture
   - Message queue for async processing
   - Database sharding
   - Auto-scaling infrastructure

3. **Security Enhancements**
   - Rate limiting and DDoS protection
   - Input sanitization and XSS protection
   - API security headers
   - Encryption at rest

### Feature Additions
1. **Payment Integration**
   - Multiple payment gateways
   - Wallet functionality
   - Dynamic pricing

2. **Enhanced Mapping**
   - Real-time traffic updates
   - Route optimization
   - Offline map support

3. **Advanced Features**
   - Ride scheduling
   - Ride sharing/carpooling
   - Driver performance analytics
   - Customer support chat

---

This architecture documentation provides a comprehensive overview of the Taxi App system, including detailed technical analysis, workflow descriptions, and future enhancement recommendations. The system is designed to be scalable, maintainable, and user-friendly while leveraging modern web technologies effectively.
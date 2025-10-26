# Taxi App - UML Diagram Documentation

## Overview

This document provides comprehensive documentation for the Taxi App UML class diagram. The diagram illustrates the complete system architecture including data models, services, controllers, routes, middleware, and their relationships.

## UML Diagram File

The complete UML class diagram is available in PlantUML format:
- **File**: `UML_DIAGRAM.puml`
- **Format**: PlantUML (.puml)

## How to View the UML Diagram

### Option 1: Online PlantUML Viewer
1. Visit [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. Copy the contents of `UML_DIAGRAM.puml`
3. Paste into the editor to view the diagram

### Option 2: VS Code Extension
1. Install the "PlantUML" extension in VS Code
2. Open `UML_DIAGRAM.puml`
3. Press `Alt+D` to preview the diagram

### Option 3: Command Line
```bash
# Install PlantUML
brew install plantuml  # macOS
# or
apt-get install plantuml  # Linux

# Generate PNG image
plantuml UML_DIAGRAM.puml
```

## System Components

### 1. Data Models Layer

#### User Model
- **Purpose**: Represents passengers who book rides
- **Key Attributes**:
  - Personal information (fullname, email)
  - Authentication (hashed password)
  - Real-time connection (socketId)
- **Key Methods**:
  - `generateAuthToken()`: Creates JWT token
  - `comparePassword()`: Validates login credentials
  - `hashPassword()`: Static method to hash passwords

#### Captain Model
- **Purpose**: Represents drivers who provide rides
- **Key Attributes**:
  - Personal information (fullname, email)
  - Authentication (hashed password)
  - Vehicle details (color, plate, capacity, type)
  - Location tracking (latitude, longitude)
  - Status management (active/inactive)
- **Key Methods**:
  - `generateAuthToken()`: Creates JWT token
  - `comparePassword()`: Validates login credentials
  - `hashPassword()`: Static method to hash passwords

#### Ride Model
- **Purpose**: Represents a ride request and its lifecycle
- **Key Attributes**:
  - References to User and Captain
  - Trip details (pickup, destination, fare)
  - Status tracking (pending → accepted → ongoing → completed)
  - Payment information
  - OTP for security
- **Relationships**:
  - One Ride has exactly one User
  - One Ride has zero or one Captain (null when pending)

#### BlacklistToken Model
- **Purpose**: Security mechanism for logout functionality
- **Key Attributes**:
  - Token string (JWT that has been invalidated)
  - Expiration timestamp (TTL: 24 hours)

### 2. Services Layer

#### UserService
- **Responsibility**: Business logic for user operations
- **Methods**:
  - `createUser()`: Register new user
  - `loginUser()`: Authenticate user
  - `getUserProfile()`: Retrieve user information

#### CaptainService
- **Responsibility**: Business logic for captain operations
- **Methods**:
  - `createCaptain()`: Register new captain
  - `loginCaptain()`: Authenticate captain

#### RideService
- **Responsibility**: Core business logic for ride management
- **Methods**:
  - `createRide()`: Initialize new ride request
  - `getFare()`: Calculate ride cost
  - `confirmRide()`: Assign captain to ride
  - `startRide()`: Begin ride with OTP verification
  - `endRide()`: Complete ride
  - `getIncompletedRides()`: Fetch active rides for captain

#### MapsService
- **Responsibility**: Location and mapping operations
- **Methods**:
  - `getAddressCoordinate()`: Convert address to coordinates
  - `getDistanceTime()`: Calculate trip metrics
  - `getAutoCompleteSuggestions()`: Address autocomplete
  - `getCaptainsInTheRadius()`: Find nearby captains
- **Integration**: Uses Google Maps API

### 3. Controllers Layer

#### UserController
- **Responsibility**: Handle HTTP requests for user operations
- **Endpoints**:
  - `registerUser()`: POST /users/register
  - `loginUser()`: POST /users/login
  - `getUserProfile()`: GET /users/profile (protected)
  - `logoutUser()`: GET /users/logout (protected)

#### CaptainController
- **Responsibility**: Handle HTTP requests for captain operations
- **Endpoints**:
  - `registerCaptain()`: POST /captains/register
  - `loginCaptain()`: POST /captains/login
  - `getCaptainProfile()`: GET /captains/profile (protected)
  - `logoutCaptain()`: GET /captains/logout (protected)

#### RideController
- **Responsibility**: Handle HTTP requests for ride operations
- **Endpoints**:
  - `createRide()`: POST /rides/create
  - `getFare()`: GET /rides/get-fare
  - `confirmRide()`: POST /rides/confirm
  - `startRide()`: GET /rides/start-ride
  - `endRide()`: POST /rides/end-ride

#### MapController
- **Responsibility**: Handle HTTP requests for location services
- **Endpoints**:
  - `getCoordinates()`: GET /maps/get-coordinates
  - `getDistanceTime()`: GET /maps/get-distance-time
  - `getAutoCompleteSuggestions()`: GET /maps/get-suggestions

### 4. Middleware

#### AuthMiddleware
- **Responsibility**: Authentication and authorization
- **Methods**:
  - `authUser()`: Verify user JWT token
  - `authCaptain()`: Verify captain JWT token
- **Functionality**:
  - Validates JWT tokens
  - Checks token blacklist
  - Attaches user/captain to request object

### 5. Routes Layer

Defines the API endpoints and connects them to controllers with appropriate middleware:
- **UserRoutes**: User authentication and profile routes
- **CaptainRoutes**: Captain authentication and profile routes
- **RideRoutes**: Ride management routes
- **MapRoutes**: Location and mapping routes

### 6. External Services

#### GoogleMapsAPI
- **Purpose**: External API integration for location services
- **Services**:
  - Geocoding: Address to coordinates conversion
  - Distance Matrix: Calculate distance and time
  - Places Autocomplete: Address suggestions

## Key Relationships

### Data Model Relationships
1. **Ride ↔ User**: One-to-One
   - Each ride belongs to exactly one user
2. **Ride ↔ Captain**: One-to-Zero-or-One
   - Pending rides have no captain assigned
   - Accepted/ongoing/completed rides have one captain

### Component Relationships
1. **Routes → Controllers**: Routes direct HTTP requests to controllers
2. **Controllers → Services**: Controllers delegate business logic to services
3. **Services → Models**: Services interact with database models
4. **Middleware ↔ Routes**: Middleware protects routes requiring authentication
5. **Services → External APIs**: Services integrate with Google Maps API

## Architecture Patterns

### 1. Layered Architecture
```
Routes Layer → Controllers Layer → Services Layer → Data Access Layer
```

### 2. MVC Pattern
- **Model**: Mongoose schemas (User, Captain, Ride)
- **View**: Frontend React application (separate)
- **Controller**: Express route handlers

### 3. Service Layer Pattern
- Business logic separated from controllers
- Reusable service methods
- Clear separation of concerns

### 4. Middleware Pattern
- Request processing pipeline
- Authentication/authorization
- Input validation
- Error handling

## Data Flow Examples

### Example 1: User Registration
```
POST /users/register
  ↓
UserRoutes
  ↓
UserController.registerUser()
  ↓
UserService.createUser()
  ↓
User.hashPassword() (static)
  ↓
User Model (MongoDB)
  ↓
User.generateAuthToken()
  ↓
Response with JWT token
```

### Example 2: Ride Creation
```
POST /rides/create (with JWT)
  ↓
AuthMiddleware.authUser()
  ↓
RideRoutes
  ↓
RideController.createRide()
  ↓
RideService.createRide()
  ↓
MapsService.getAddressCoordinate()
  ↓
GoogleMapsAPI.geocode()
  ↓
Ride Model (MongoDB)
  ↓
MapsService.getCaptainsInTheRadius()
  ↓
Socket.IO notification to captains
  ↓
Response with ride details
```

### Example 3: Captain Accepts Ride
```
POST /rides/confirm (with JWT)
  ↓
AuthMiddleware.authCaptain()
  ↓
RideRoutes
  ↓
RideController.confirmRide()
  ↓
RideService.confirmRide()
  ↓
Update Ride Model (status: accepted, captain: captainId)
  ↓
Socket.IO notification to user
  ↓
Response with updated ride
```

## Security Features

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Passwords never stored in plain text
   - Select: false on password fields

2. **JWT Authentication**
   - Stateless token-based auth
   - 24-hour expiration
   - Token blacklisting on logout

3. **Protected Routes**
   - AuthMiddleware validates tokens
   - User/Captain-specific authorization
   - Role-based access control

4. **OTP Verification**
   - Secure ride start mechanism
   - OTP not exposed in API responses
   - Select: false on OTP field

## Real-time Communication

While not fully represented in the class diagram, the system includes Socket.IO for real-time features:

- **User socketId**: Stored in User and Captain models
- **Events**:
  - New ride notifications to captains
  - Ride confirmation to users
  - Location updates
  - Ride status changes

## Database Considerations

### MongoDB Collections
- `users`: User documents
- `captains`: Captain documents
- `rides`: Ride documents
- `blacklisttokens`: Blacklisted JWT tokens

### Indexes (Recommended)
```javascript
// Geospatial index for captain location
db.captains.createIndex({ "location": "2dsphere" })

// Unique email indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.captains.createIndex({ "email": 1 }, { unique: true })

// Ride status index for queries
db.rides.createIndex({ "status": 1, "createdAt": -1 })

// TTL index for token expiration
db.blacklisttokens.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 86400 })
```

## Future Enhancements (Not in Current UML)

Based on the architecture, potential additions include:
1. **Payment Model**: For transaction handling
2. **Rating Model**: User and captain ratings
3. **TripHistory Service**: Historical data analysis
4. **NotificationService**: Push notifications
5. **AnalyticsService**: Business intelligence

## Conclusion

This UML diagram provides a comprehensive view of the Taxi App architecture. It demonstrates:
- Clear separation of concerns
- Well-defined relationships between components
- Scalable and maintainable design
- Security-first approach
- Integration with external services

The diagram serves as a blueprint for understanding the system and can be used for:
- Onboarding new developers
- System documentation
- Architecture discussions
- Future enhancements planning

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Maintained By**: Taxi App Development Team

# Taxi App - Technical Workflows & System Diagrams

## System Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT LAYER                                   │
├─────────────────────────────────┬───────────────────────────────────────────────┤
│         Passenger App           │              Captain App                      │
│  ┌─────────────────────────┐    │    ┌─────────────────────────────────────┐   │
│  │  React Components       │    │    │  React Components                   │   │
│  │  • Home                 │    │    │  • CaptainHome                      │   │
│  │  • RideBooking          │    │    │  • RideAcceptance                   │   │
│  │  • RideTracking         │    │    │  • NavigationView                   │   │
│  │  • PaymentView          │    │    │  • EarningsView                     │   │
│  └─────────────────────────┘    │    └─────────────────────────────────────┘   │
│  ┌─────────────────────────┐    │    ┌─────────────────────────────────────┐   │
│  │  State Management       │    │    │  State Management                   │   │
│  │  • UserContext          │    │    │  • CaptainContext                   │   │
│  │  • SocketContext        │    │    │  • SocketContext                    │   │
│  │  • RideContext          │    │    │  • RideContext                      │   │
│  └─────────────────────────┘    │    └─────────────────────────────────────┘   │
└─────────────────────────────────┼───────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────────┐
│                           API GATEWAY LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      Express.js Application                             │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │  │
│  │  │   Middleware    │  │     Routes      │  │      Controllers        │  │  │
│  │  │  • CORS         │  │  • /users       │  │  • UserController       │  │  │
│  │  │  • Body Parser  │  │  • /captains    │  │  • CaptainController    │  │  │
│  │  │  • Auth Check   │  │  • /rides       │  │  • RideController       │  │  │
│  │  │  • Validation   │  │  • /maps        │  │  • MapController        │  │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┼───────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────────┐
│                          BUSINESS LOGIC LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                           Services Layer                                │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │  │
│  │  │  UserService    │  │  RideService    │  │    MapService           │  │  │
│  │  │  • Registration │  │  • CreateRide   │  │  • Geocoding            │  │  │
│  │  │  • Login        │  │  • ConfirmRide  │  │  • DistanceCalculation  │  │  │
│  │  │  • Profile      │  │  • StartRide    │  │  • AutoComplete         │  │  │
│  │  │  • Logout       │  │  • EndRide      │  │  • CaptainMatching      │  │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │  │
│  │  │ CaptainService  │  │  AuthService    │  │   SocketService         │  │  │
│  │  │  • Registration │  │  • JWT Generate │  │  • Connection Mgmt      │  │  │
│  │  │  • Login        │  │  • JWT Verify   │  │  • Event Broadcasting   │  │  │
│  │  │  • StatusUpdate │  │  • Token Blacklist│ │  • Room Management     │  │  │
│  │  │  • Location     │  │  • Password Hash│  │  • Real-time Updates    │  │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┼───────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────────┐
│                            DATA ACCESS LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                           Mongoose ODM                                  │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │  │
│  │  │   User Model    │  │  Captain Model  │  │      Ride Model         │  │  │
│  │  │  • Schema       │  │  • Schema       │  │  • Schema               │  │  │
│  │  │  • Validation   │  │  • Validation   │  │  • Validation           │  │  │
│  │  │  • Middleware   │  │  • Middleware   │  │  • Relationships        │  │  │
│  │  │  • Methods      │  │  • Methods      │  │  • Status Management    │  │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │  │
│  │  ┌─────────────────┐                       ┌─────────────────────────┐  │  │
│  │  │BlacklistToken   │                       │    Future Models        │  │  │
│  │  │    Model        │                       │  • Payment              │  │  │
│  │  │  • Schema       │                       │  • Rating               │  │  │
│  │  │  • TTL Index    │                       │  • Trip History         │  │  │
│  │  └─────────────────┘                       └─────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┼───────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────────┐
│                           PERSISTENCE LAYER                                    │
│  ┌──────────────────────┐      ┌────────────────────┐     ┌─────────────────┐  │
│  │     MongoDB          │      │   External APIs    │     │     Future      │  │
│  │  ┌──────────────┐    │      │ ┌────────────────┐ │     │ ┌─────────────┐ │  │
│  │  │ Collections  │    │      │ │ Google Maps    │ │     │ │   Redis     │ │  │
│  │  │ • users      │    │      │ │ • Geocoding    │ │     │ │ • Cache     │ │  │
│  │  │ • captains   │    │      │ │ • Distance     │ │     │ │ • Sessions  │ │  │
│  │  │ • rides      │    │      │ │ • Places       │ │     │ │ • Pub/Sub   │ │  │
│  │  │ • blacklist  │    │      │ └────────────────┘ │     │ └─────────────┘ │  │
│  │  └──────────────┘    │      │ ┌────────────────┐ │     │ ┌─────────────┐ │  │
│  │  ┌──────────────┐    │      │ │ Payment APIs   │ │     │ │   Message   │ │  │
│  │  │   Indexes    │    │      │ │ • Stripe       │ │     │ │   Queue     │ │  │
│  │  │ • Geospatial │    │      │ │ • PayPal       │ │     │ │ • RabbitMQ  │ │  │
│  │  │ • Email      │    │      │ │ • Razorpay     │ │     │ │ • AWS SQS   │ │  │
│  │  │ • Status     │    │      │ └────────────────┘ │     │ └─────────────┘ │  │
│  │  └──────────────┘    │      └────────────────────┘     └─────────────────┘  │
│  └──────────────────────┘                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Workflow Diagrams

### 1. User Registration & Authentication Flow

```
Start → User Opens App → Registration Page
         ↓
    User Fills Form (Name, Email, Password)
         ↓
    Frontend Validation
         ↓
    POST /users/register
         ↓
    Backend Validation (express-validator)
         ↓
    Check Email Uniqueness
         ↓
    Hash Password (bcrypt)
         ↓
    Create User Document in MongoDB
         ↓
    Generate JWT Token
         ↓
    Return Token + User Data
         ↓
    Store Token in Frontend (localStorage)
         ↓
    Redirect to Home → End
```

### 2. Ride Request & Matching Flow

```
User Login → Home Page → Location Input
     ↓
Enter Pickup Location (Autocomplete via Google Places API)
     ↓
Enter Destination (Autocomplete via Google Places API)
     ↓
Select Vehicle Type (car/motorcycle/auto)
     ↓
Calculate Fare (Google Distance Matrix API)
     ↓
Display Fare & Confirm Booking
     ↓
POST /rides/create
     ↓
Backend: Create Ride Document
     ↓
Geocode Pickup Location
     ↓
Find Nearby Captains (MongoDB Geospatial Query)
     ↓
Generate OTP for Ride
     ↓
Socket Broadcast to Nearby Captains
     ↓
Display "Looking for Driver" to User
     ↓
Captain Accepts → POST /rides/confirm
     ↓
Update Ride Status to "accepted"
     ↓
Socket Notification to User "Ride Confirmed"
     ↓
Display Captain Details & ETA
     ↓
Real-time Location Updates via Socket
     ↓
Captain Arrives → Start Ride with OTP
     ↓
GET /rides/start-ride?rideId=X&otp=Y
     ↓
Verify OTP & Update Status to "ongoing"
     ↓
Real-time Navigation & Tracking
     ↓
Reach Destination → POST /rides/end-ride
     ↓
Update Status to "completed"
     ↓
Payment Processing (Future)
     ↓
Rate Captain (Future)
     ↓
End
```

### 3. Captain Onboarding & Ride Acceptance Flow

```
Captain Registration → Provide Vehicle Details
     ↓
Account Verification (Manual/Automated)
     ↓
Login → Captain Home Dashboard
     ↓
Set Status to "active"
     ↓
Start Location Updates (Socket: update-location-captain)
     ↓
Listen for Ride Notifications
     ↓
Receive New Ride Request (Socket: new-ride)
     ↓
Display Ride Details (Pickup, Destination, Fare, User Info)
     ↓
Decision: Accept or Decline
     ↓
If Accept: POST /rides/confirm
     ↓
Navigate to Pickup Location
     ↓
Reach Pickup → Request OTP from User
     ↓
Start Ride: GET /rides/start-ride
     ↓
Navigate to Destination
     ↓
Complete Ride: POST /rides/end-ride
     ↓
Collect Payment
     ↓
Return to Available Status
     ↓
End
```

### 4. Real-time Communication Flow

```
User/Captain Login
     ↓
Socket Connection Established
     ↓
Emit 'join' event with userId & userType
     ↓
Server Updates User/Captain socketId in DB
     ↓
Connection Active & Listening for Events
     ↓
Ride Event Occurs (create/confirm/start/end)
     ↓
Server Business Logic Updates Database
     ↓
Server Identifies Target Socket(s)
     ↓
Server Emits Specific Event to Socket(s)
     ↓
Client Receives Event
     ↓
Frontend Updates UI State
     ↓
User Sees Real-time Update
     ↓
Continue Listening for More Events
```

### 5. Location & Mapping Service Integration

```
Address Input → Frontend Autocomplete Component
     ↓
Call GET /maps/get-suggestions?input=userQuery
     ↓
Backend: Google Places Autocomplete API
     ↓
Return Suggested Addresses
     ↓
User Selects Address
     ↓
Call GET /maps/get-coordinates?address=selectedAddress
     ↓
Backend: Google Geocoding API
     ↓
Return Latitude & Longitude
     ↓
For Ride Fare Calculation:
     ↓
Call GET /maps/get-distance-time?origin=pickup&destination=dest
     ↓
Backend: Google Distance Matrix API
     ↓
Return Distance & Duration
     ↓
Calculate Fare Based on Distance/Time
     ↓
For Captain Matching:
     ↓
Use Pickup Coordinates in MongoDB Query
     ↓
db.captains.find({ location: { $geoWithin: { $centerSphere: [[lat, lng], radius] }}})
     ↓
Return Nearby Active Captains
```

## Data Flow Patterns

### 1. Request-Response Pattern (REST API)
```
Client Request → Middleware → Controller → Service → Database → Response
```

### 2. Event-Driven Pattern (Socket.IO)
```
Event Trigger → Service Layer → Socket Emission → Client Handler → UI Update
```

### 3. Middleware Chain Pattern
```
Request → CORS → Body Parser → Auth Validation → Route Handler → Response
```

### 4. Service Layer Pattern
```
Controller → Service (Business Logic) → Model (Data Access) → Database
```

## Error Handling Patterns

### 1. API Error Handling
```javascript
try {
  // Business logic
  const result = await service.performOperation();
  res.status(200).json(result);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: error.message });
}
```

### 2. Validation Error Handling
```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```

### 3. Socket Error Handling
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
  socket.emit('error', { message: 'Something went wrong' });
});
```

### 4. Frontend Error Handling
```javascript
try {
  const response = await api.call();
  setData(response.data);
} catch (error) {
  setError(error.message);
  // Show user-friendly error message
}
```

## Security Implementation Details

### 1. Authentication Middleware
```javascript
const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const isBlacklisted = await blackListTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Token blacklisted' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### 2. Input Validation
```javascript
const validateRideCreation = [
  body('pickup').notEmpty().withMessage('Pickup location required'),
  body('destination').notEmpty().withMessage('Destination required'),
  body('vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type')
];
```

### 3. Password Security
```javascript
// Hashing
userSchema.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

// Comparison
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
```

This technical workflow documentation provides detailed insights into the internal workings of the Taxi App system, showing how different components interact and how data flows through the application layers.
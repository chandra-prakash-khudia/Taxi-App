# Taxi App - Complete API Documentation

## Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com/api`

## Authentication
All protected endpoints require a JWT token sent via:
- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `token=<jwt_token>`

## Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": {}, // Response data
  "message": "Success message",
  "errors": [] // Validation errors (if any)
}
```

## Error Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Invalid/Missing token)
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## User Endpoints

### Register User
**POST** `/users/register`

Creates a new user account.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
- `email`: Must be valid email format
- `fullname.firstname`: Minimum 3 characters
- `password`: Minimum 6 characters

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64f5b1234567890abcdef123",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "createdAt": "2023-09-04T10:30:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Login User
**POST** `/users/login`

Authenticates a user and returns JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64f5b1234567890abcdef123",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  },
  "message": "Login successful"
}
```

### Get User Profile
**GET** `/users/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f5b1234567890abcdef123",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "createdAt": "2023-09-04T10:30:00.000Z"
    }
  }
}
```

### Logout User
**GET** `/users/logout`

**Headers:** `Authorization: Bearer <token>`

Invalidates the JWT token by adding it to blacklist.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Captain Endpoints

### Register Captain
**POST** `/captains/register`

Creates a new captain account with vehicle information.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "Mike",
    "lastname": "Driver"
  },
  "email": "mike.driver@example.com",
  "password": "securePassword123",
  "vehicle": {
    "color": "Blue",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Validation Rules:**
- `email`: Must be valid email format
- `fullname.firstname`: Minimum 3 characters
- `password`: Minimum 6 characters
- `vehicle.color`: Minimum 3 characters
- `vehicle.plate`: Minimum 3 characters
- `vehicle.capacity`: Minimum 1
- `vehicle.vehicleType`: Must be one of ['car', 'motorcycle', 'auto']

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "captain": {
      "_id": "64f5b1234567890abcdef124",
      "fullname": {
        "firstname": "Mike",
        "lastname": "Driver"
      },
      "email": "mike.driver@example.com",
      "status": "inactive",
      "vehicle": {
        "color": "Blue",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      },
      "createdAt": "2023-09-04T10:30:00.000Z"
    }
  },
  "message": "Captain registered successfully"
}
```

### Login Captain
**POST** `/captains/login`

**Request Body:**
```json
{
  "email": "mike.driver@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "captain": {
      "_id": "64f5b1234567890abcdef124",
      "fullname": {
        "firstname": "Mike",
        "lastname": "Driver"
      },
      "email": "mike.driver@example.com",
      "status": "inactive",
      "vehicle": {
        "color": "Blue",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  },
  "message": "Login successful"
}
```

### Get Captain Profile
**GET** `/captains/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "captain": {
      "_id": "64f5b1234567890abcdef124",
      "fullname": {
        "firstname": "Mike",
        "lastname": "Driver"
      },
      "email": "mike.driver@example.com",
      "status": "active",
      "vehicle": {
        "color": "Blue",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      },
      "location": {
        "ltd": 40.7128,
        "lng": -74.0060
      }
    }
  }
}
```

### Logout Captain
**GET** `/captains/logout`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Ride Endpoints

### Create Ride
**POST** `/rides/create`

**Headers:** `Authorization: Bearer <user_token>`

Creates a new ride request from authenticated user.

**Request Body:**
```json
{
  "pickup": "123 Main St, New York, NY",
  "destination": "456 Broadway, New York, NY",
  "vehicleType": "car"
}
```

**Validation Rules:**
- `pickup`: Required, non-empty string
- `destination`: Required, non-empty string
- `vehicleType`: Must be one of ['car', 'motorcycle', 'auto']

**Response (201):**
```json
{
  "success": true,
  "data": {
    "ride": {
      "_id": "64f5b1234567890abcdef125",
      "user": "64f5b1234567890abcdef123",
      "pickup": "123 Main St, New York, NY",
      "destination": "456 Broadway, New York, NY",
      "fare": 25.50,
      "status": "pending",
      "duration": 1200,
      "distance": 5000,
      "createdAt": "2023-09-04T10:30:00.000Z"
    }
  },
  "message": "Ride created successfully"
}
```

### Get Fare Estimate
**GET** `/rides/get-fare?pickup=<pickup>&destination=<destination>`

**Headers:** `Authorization: Bearer <user_token>`

Calculates fare estimate for a potential ride.

**Query Parameters:**
- `pickup`: Pickup address (required)
- `destination`: Destination address (required)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "fare": {
      "car": 25.50,
      "motorcycle": 15.30,
      "auto": 18.75
    },
    "distance": {
      "text": "3.1 mi",
      "value": 5000
    },
    "duration": {
      "text": "12 mins",
      "value": 720
    }
  }
}
```

### Confirm Ride
**POST** `/rides/confirm`

**Headers:** `Authorization: Bearer <captain_token>`

Allows captain to accept a ride request.

**Request Body:**
```json
{
  "rideId": "64f5b1234567890abcdef125"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ride": {
      "_id": "64f5b1234567890abcdef125",
      "user": {
        "_id": "64f5b1234567890abcdef123",
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com"
      },
      "captain": "64f5b1234567890abcdef124",
      "pickup": "123 Main St, New York, NY",
      "destination": "456 Broadway, New York, NY",
      "fare": 25.50,
      "status": "accepted",
      "otp": "1234"
    }
  },
  "message": "Ride confirmed successfully"
}
```

### Start Ride
**GET** `/rides/start-ride?rideId=<rideId>&otp=<otp>`

**Headers:** `Authorization: Bearer <captain_token>`

Starts a ride after OTP verification.

**Query Parameters:**
- `rideId`: Ride ID (required)
- `otp`: OTP provided by user (required)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ride": {
      "_id": "64f5b1234567890abcdef125",
      "user": {
        "_id": "64f5b1234567890abcdef123",
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        }
      },
      "captain": "64f5b1234567890abcdef124",
      "status": "ongoing",
      "startedAt": "2023-09-04T10:45:00.000Z"
    }
  },
  "message": "Ride started successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

### End Ride
**POST** `/rides/end-ride`

**Headers:** `Authorization: Bearer <captain_token>`

Completes a ride.

**Request Body:**
```json
{
  "rideId": "64f5b1234567890abcdef125"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ride": {
      "_id": "64f5b1234567890abcdef125",
      "status": "completed",
      "endedAt": "2023-09-04T11:00:00.000Z",
      "totalAmount": 25.50
    }
  },
  "message": "Ride completed successfully"
}
```

---

## Maps & Location Endpoints

### Get Coordinates
**GET** `/maps/get-coordinates?address=<address>`

**Headers:** `Authorization: Bearer <token>`

Converts address to latitude/longitude coordinates.

**Query Parameters:**
- `address`: Address to geocode (required)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "coordinates": {
      "ltd": 40.7128,
      "lng": -74.0060
    },
    "address": "123 Main St, New York, NY 10001, USA"
  }
}
```

### Get Distance and Time
**GET** `/maps/get-distance-time?origin=<origin>&destination=<destination>`

**Headers:** `Authorization: Bearer <token>`

Calculates distance and travel time between two locations.

**Query Parameters:**
- `origin`: Starting address (required)
- `destination`: Ending address (required)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "distance": {
      "text": "3.1 mi",
      "value": 5000
    },
    "duration": {
      "text": "12 mins",
      "value": 720
    },
    "status": "OK"
  }
}
```

### Get Address Suggestions
**GET** `/maps/get-suggestions?input=<input>`

**Headers:** `Authorization: Bearer <token>`

Returns address autocomplete suggestions.

**Query Parameters:**
- `input`: Partial address for autocomplete (required)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "123 Main Street, New York, NY, USA",
      "123 Main Avenue, Brooklyn, NY, USA",
      "123 Main Road, Queens, NY, USA"
    ]
  }
}
```

---

## Socket.IO Events

### Connection Events

#### Join Room
**Event:** `join`

**Client → Server:**
```json
{
  "userId": "64f5b1234567890abcdef123",
  "userType": "user" // or "captain"
}
```

**Description:** Associates socket connection with user/captain for targeted messaging.

#### Disconnect
**Event:** `disconnect`

**Client → Server:** (Automatic)

**Description:** Handles cleanup when client disconnects.

### Location Events

#### Update Captain Location
**Event:** `update-location-captain`

**Client → Server:**
```json
{
  "userId": "64f5b1234567890abcdef124",
  "location": {
    "ltd": 40.7128,
    "lng": -74.0060
  }
}
```

**Description:** Updates captain's current location for ride matching.

### Ride Events

#### New Ride Notification
**Event:** `new-ride`

**Server → Captain:**
```json
{
  "ride": {
    "_id": "64f5b1234567890abcdef125",
    "user": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      }
    },
    "pickup": "123 Main St, New York, NY",
    "destination": "456 Broadway, New York, NY",
    "fare": 25.50,
    "distance": 5000,
    "duration": 720
  }
}
```

**Description:** Notifies nearby captains of new ride requests.

#### Ride Confirmed
**Event:** `ride-confirmed`

**Server → User:**
```json
{
  "ride": {
    "_id": "64f5b1234567890abcdef125",
    "captain": {
      "fullname": {
        "firstname": "Mike",
        "lastname": "Driver"
      },
      "vehicle": {
        "color": "Blue",
        "plate": "ABC123",
        "vehicleType": "car"
      }
    },
    "status": "accepted",
    "otp": "1234",
    "estimatedArrival": "5 mins"
  }
}
```

**Description:** Notifies user that a captain has accepted their ride.

#### Ride Started
**Event:** `ride-started`

**Server → User:**
```json
{
  "ride": {
    "_id": "64f5b1234567890abcdef125",
    "status": "ongoing",
    "startedAt": "2023-09-04T10:45:00.000Z"
  }
}
```

**Description:** Notifies user that the ride has started.

#### Ride Ended
**Event:** `ride-ended`

**Server → User:**
```json
{
  "ride": {
    "_id": "64f5b1234567890abcdef125",
    "status": "completed",
    "endedAt": "2023-09-04T11:00:00.000Z",
    "totalAmount": 25.50,
    "distance": 5000,
    "duration": 900
  }
}
```

**Description:** Notifies user that the ride has been completed.

#### Error Events
**Event:** `error`

**Server → Client:**
```json
{
  "message": "Invalid location data",
  "code": "INVALID_LOCATION"
}
```

**Description:** Sends error notifications for invalid operations.

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **Location updates**: 60 requests per minute per captain

## CORS Configuration

CORS is configured to allow:
- **Origins**: Frontend domain(s)
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, Cookie
- **Credentials**: true (for cookie support)

## Environment Variables

Required environment variables for API functionality:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
DB_CONNECT=mongodb://localhost:27017/taxi-app

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Google Maps
GOOGLE_MAPS_API=your-google-maps-api-key

# Socket.IO
SOCKET_CORS_ORIGIN=http://localhost:5173
```

## Future API Enhancements

### Planned Endpoints
- **Payment Processing**: `/payments/process`, `/payments/history`
- **Rating System**: `/ratings/submit`, `/ratings/get`
- **Trip History**: `/trips/history`, `/trips/details/:id`
- **Admin Panel**: `/admin/users`, `/admin/captains`, `/admin/analytics`
- **Notifications**: `/notifications/send`, `/notifications/history`

### Planned Features
- **File Upload**: Profile pictures, vehicle documents
- **Real-time Chat**: Between user and captain during ride
- **Push Notifications**: Mobile app notifications
- **Analytics**: Trip analytics and reporting
- **Multi-language**: Internationalization support

This API documentation provides comprehensive information about all available endpoints, request/response formats, authentication requirements, and real-time communication patterns used in the Taxi App system.
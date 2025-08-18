# Smart Bus Portal API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Protected routes require a JWT token in the header:
```
Authorization: Bearer your_jwt_token
```

## Driver Endpoints

### 1. Register Driver
Register a new driver with their details and NID image.

```
POST /driver/register
Content-Type: multipart/form-data
```

**Request Body:**
| Field    | Type   | Required | Description                          |
|----------|--------|----------|--------------------------------------|
| name     | text   | Yes      | Driver's full name (alphabets only) |
| email    | text   | Yes      | Driver's email address              |
| password | text   | Yes      | Password (min 6 characters)         |
| nid      | text   | Yes      | NID number (10-17 digits)          |
| nidImage | file   | Yes      | Driver's NID image (< 2MB)         |

**Response:**
```json
{
    "message": "Driver created successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "nid": "1234567890",
        "nidImage": "1753624198642-nid.png",
        "isActive": true
    }
}
```

### 2. Driver Login
Authenticate a driver and receive a JWT token.

```
POST /driver/login
Content-Type: application/json
```

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "yourpassword"
}
```

**Response:**
```json
{
    "message": "Login successful",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "nid": "1234567890",
        "nidImage": "1753624198642-nid.png",
        "isActive": true
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get All Drivers
Retrieve a list of all drivers with their assigned buses. Requires authentication.

```
GET /driver
Authorization: Bearer your_jwt_token
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "nid": "1234567890",
        "nidImage": "1753624198642-nid.png",
        "isActive": true,
        "buses": [
            {
                "id": 1,
                "busNumber": "BUS-001",
                "route": "Route 1",
                "capacity": 40
            }
        ]
    }
]
```

### 4. Get Driver by ID
Retrieve a specific driver by their ID with assigned buses. Requires authentication.

```
GET /driver/:id
Authorization: Bearer your_jwt_token
```

**Parameters:**
- `id`: Driver's ID (number)

**Response:**
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "nid": "1234567890",
    "nidImage": "1753624198642-nid.png",
    "isActive": true,
    "buses": [
        {
            "id": 1,
            "busNumber": "BUS-001",
            "route": "Route 1",
            "capacity": 40
        }
    ]
}
```

### 5. Update Driver
Update a driver's information. Requires authentication.

```
PATCH /driver/:id
Content-Type: multipart/form-data
Authorization: Bearer your_jwt_token
```

**Parameters:**
- `id`: Driver's ID (number)

**Request Body (all fields optional):**
| Field    | Type   | Description                          |
|----------|--------|--------------------------------------|
| name     | text   | Driver's full name (alphabets only) |
| email    | text   | Driver's email address              |
| password | text   | Password (min 6 characters)         |
| nid      | text   | NID number (10-17 digits)          |
| nidImage | file   | Driver's NID image (< 2MB)         |

**Response:**
```json
{
    "message": "Driver updated successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "nid": "1234567890",
        "nidImage": "1753624198642-nid.png",
        "isActive": true
    }
}
```

### 6. Delete Driver
Delete a driver by their ID. Requires authentication.

```
DELETE /driver/:id
Authorization: Bearer your_jwt_token
```

**Parameters:**
- `id`: Driver's ID (number)

**Response:**
```json
{
    "message": "Driver deleted successfully"
}
```

### 7. Get NID Image
Retrieve a driver's NID image.

```
GET /driver/nid/:name
```

**Parameters:**
- `name`: Image filename

## File Upload Requirements
- Supported formats: JPG, JPEG, PNG
- Maximum file size: 2MB
- Files are stored in: `./uploads/nid/`

## Error Responses

### Validation Error
```json
{
    "statusCode": 400,
    "message": [
        "Name must contain only alphabets",
        "Password must be at least 6 characters long",
        "NID must be between 10 to 17 digits"
    ],
    "error": "Bad Request"
}
```

### Conflict Error (Email Already Exists)
```json
{
    "statusCode": 409,
    "message": "Email already registered"
}
```

### File Upload Error
```json
{
    "statusCode": 400,
    "message": "NID image is required and must be under 2MB",
    "error": "Bad Request"
}
```

### Authentication Error
```json
{
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
}
```

### Not Found Error
```json
{
    "statusCode": 404,
    "message": "Driver not found",
    "error": "Not Found"
}
```

## Testing with Postman

1. Set up a new environment in Postman
   - Create a variable called `baseUrl` with value `http://localhost:3000`
   - Create a variable called `token` (this will store the JWT token)

2. Register a new driver
   - Use `POST {{baseUrl}}/driver/register`
   - Set Content-Type to `multipart/form-data`
   - Add required fields (name, email, password, nid)
   - Upload NID image file

3. Login with the registered credentials
   - Use `POST {{baseUrl}}/driver/login`
   - Set Content-Type to `application/json`
   - Send email and password
   - Store the received token in the environment variable

4. For protected routes
   - Add Authorization header: `Bearer {{token}}`
   - Test GET /driver to list all drivers
   - Test GET /driver/:id to get a specific driver
   - Test PATCH /driver/:id to update driver info
   - Test DELETE /driver/:id to remove a driver

5. Tips for testing
   - Use valid email format
   - Password must be at least 6 characters
   - NID must be 10-17 digits
   - Name must contain only alphabets
   - Image files must be JPG, JPEG, or PNG under 2MB
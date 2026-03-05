# Handyman.za Jobs Module

The Jobs Module is the heart of the Handyman.za platform.
It manages the complete job lifecycle from creation to completion, 
with role-based access control and proper state management.

## 📋 Job Schema

### Core Fields

```
|        Field        |   Type   | Description                  | Required                 |
|---------------------|----------|------------------------------|--------------------------|
|       `title`       |  String  | Short job title              | ✅                      |
|    `description`    |  String  | Detailed job description     | ✅                      |
|  `serviceCategory`  |   Enum   | Type of service needed       | ✅                      |
|      `images`       | [String] | Array of image URLs          | ❌                      |
|     `location`      |  Object  | Address and coordinates      | ✅                      |
|      `budget`       |  Number  | Proposed budget              | ❌                      |
|    `isNegotiable`   | Boolean  | Whether price is negotiable  | ❌ (default: false)     |
|      `client`       | ObjectId | Reference to User (handyman) | ❌                      |
|      `status`       |   Enum   | Current job status           | ✅ (default: "pending") |
```

### Location Object

```javascript
location: {
    address: "123 Main St",
    city: "Cape Town",
    province: "Western Cape",
    suburb: "Gardens",
    postalCode: "8001",
    coordinates: {
        type: "Point",
        coordinates: [18.4241, -33.9249]
    }
}
```

### Job Schema Enum

```
| Status      |            Description            |
|-------------|-----------------------------------|
| pending     | Job created, waiting for handyman |
| accepted    |     Handyman accepted the job     |
| in_progress |         Work has started          |
| completed   |      Job finished successfully    |
| cancelled   |       Job cancelled by client     |
```

## 🔐 Access Control Rules

### Who can Do What?

```
|       Action        | Client | Handyman | Admin |
|---------------------|--------|----------|-------|
| Create Job          |   ✅   |   ❌    |  ✅   |
| View own jobs       |   ✅   |   ✅    |  ✅   |
| View all jobs       |   ❌   |   ❌    |  ✅   |
| View available jobs |   ❌   |   ✅    |  ✅   |
| Update pending job  |   ✅   |   ❌    |  ✅   |
| Cancel pending job  |   ✅   |   ❌    |  ✅   |
| Accept job          |   ❌   |   ✅    |  ✅   |
| Start accepted job  |   ❌   |   ✅    |  ✅   |
| Complete job        |   ❌   |   ✅    |  ✅   |
| View other's jobs   |   ❌   |   ❌    |  ✅   |
```

## 🔁 Job Lifecycle
```
    +-----------+                       +-------------+
    |  PENDING  | -- (Client cancels) → |  CANCELLED  |
    +-----------+                       +-------------+
          |
  (handyman accepts)
          ↓
    +------------+
    |  ACCEPTED  |
    +------------+
          |
  (handyman starts)
          ↓
   +---------------+
   |  IN_PROGRESS  |
   +---------------+
          |
  (handyman completes)
          ↓
    +-------------+
    |  COMPLETED  |
    +-------------+
```

## 🛣️ API Routes

All job routes are mounted under /api/v1/jobs 
and require authentication

### Client Routes

POST /api/v1/jobs

Create a new job (client only)

#### Request Body:
```json
{
    "title": "Fix leaking faucet",
    "description": "Kitchen faucet leaking continuously",
    "serviceCategory": "plumbing",
    "location": {
        "address": "123 Main Str",
        "city": "Cape Town",
        "province": "Western Cape"
    },
    "budget": 500,
    "isNegotiable": true
}
```

#### Response: 201 Created
```json
{
    "success": true,
    "data": {
        "job": { ... }
    }
}
```

PATCH /api/v1/jobs/:jobId

Update pending job (client only)

DELETE /api/v1/jobs/:jobId

Cancel pending job (client only)

### Handyman Routes

GET /api/v1/jobs/available

Get all pending jobs available for acceptance

POST /api/v1/jobs/:jobId/accept

Accept a pending job

#### Rules

- Job must be in pending status
- Job must not have a handyman assigned
- Only handymen can accept

POST /api/v1/jobs/:jobId/start

Start working on an accepted job

#### Rules

- Job must be in accepted status
- Only the assigned handyman can start

POST /api/v1/jobs/:jobId/complete

Mark job as completed

#### Rules

- Job must be in accepted or in_progress status
- Only the assigned handyman can complete

### Shared Routes (Client + Handyman)

GET /api/v1/jobs/my-jobs

Get all jobs for the authenticated user

- Clients see jobs they created
- Handymen see jobs they accepted

GET /api/v1/jobs/:jobId

Get specific job by ID

#### Visibility Rules:

- Clients can only view their own jobs
- Handymen can view:
    - Pending jobs (available to accept)
    - Jobs assigned to them
- Admins can view everything

## Testing

The jobs module includes comprehensive tests 
covering the entire lifecycle:

```bash
    node tests/job-lifecycle.test.js
```

### Test Coverage

```
|   Test    |          Description             |
|-----------|----------------------------------|
| SECTION 1 | Create client and handyman users |
| SECTION 2 | Client creates a job             |
| SECTION 3 | Handyman views available jobs    |
| SECTION 4 | Handyman accepts the job         |
| SECTION 5 | Client forbidden from accepting  |
| SECTION 6 | Handyman starts the job          |
| SECTION 7 | Handyman completes the job       |
| SECTION 8 | Access control tests             |
| SECTION 9 | Get user's jobs with filters     |
```

## 🏗️ Architecture

The jobs module follows clean architecture principles:
```txt
route/              → HTTP layer, route definitions
controller/         → Request handling, response formatting
service/            → Business logic, rules enforcement
model/              → Data schema, database interactions
constants/          → Enums and shared constants
```

### Key Files

```
|       File        |             Purpose               |
|-------------------|-----------------------------------|
| job.model.js      | MongoDB schema with validation    |
| job.constants.js  | Shared enums (status, categories) |
| job.controller.js | Request/response handling         |
| job.service.js    | Business logic and rules          |
| job.routes.js     | Route definitions with middleware |
```

### 🔒 Error Handling

The module uses custom ApiError class with appropriate 
HTTP status codes:

```
| Status |                When                   |
|--------|---------------------------------------|
|  400   | Invalid input or state transition     |
|  401   | Missing or invalid authentication     |
|  403   | Insufficient permissions              |
|  404   | Job not found                         |
|  409   | Conflict (e.g., job already accepted) |
```

### 📊 Example Status Transitions
```javascript
// Valid transitions
pending → accepted          // Handyman accepts 
accepted → in_progress      // Handyman starts work
accepted → completed        // Handyman completes (if allowed)
in_progress → completed     // Handyman completes

// Invalid transitions
pending → completed         // Must be accepted first
accepted → pending          // Cannot go backwards
completed → any             // Final state
cancelled → any             // Final state
```

## 🚀 Future Enhancements
- **Reviews & Ratings** - Allow clients to rate handymen after completion
- **Geolocation Search** - Find jobs near a location
- **Categories & Subcategories** - More detailed service categorization
- **Scheduled Jobs** - Book jobs for future dates
- **Recurring Jobs** - Regular maintenance schedules
- **Job Templates** - Save common job types
- **Bidding System** - Handymen can propose different prices
- **Emergency Jobs** - Priority handling for urgent requests
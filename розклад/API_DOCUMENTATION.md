# Rozklad API Documentation

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication.

### Login

```http
POST /auth/login
Content-Type: multipart/form-data

username=admin&password=admin123
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "full_name": "User Name",
  "password": "password123",
  "role": "student",
  "institution_id": 1
}
```

### Using the Token

Include the token in the Authorization header:

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## User Roles

- `super_admin`: Full system access
- `admin`: Manage schedules and users
- `teacher`: View schedule, submit change requests
- `student`: View group schedule
- `parent`: View child's schedule

## Endpoints

### Groups

#### List Groups
```http
GET /groups?institution_id=1
```

#### Create Group
```http
POST /groups
Content-Type: application/json

{
  "name": "CS-101",
  "profile": "Computer Science",
  "student_count": 30,
  "year": 1,
  "institution_id": 1
}
```

#### Update Group
```http
PUT /groups/{group_id}
Content-Type: application/json

{
  "name": "CS-101A",
  "student_count": 32
}
```

#### Delete Group
```http
DELETE /groups/{group_id}
```

### Teachers

#### List Teachers
```http
GET /teachers?institution_id=1
```

#### Create Teacher
```http
POST /teachers
Content-Type: application/json

{
  "full_name": "John Doe",
  "specialization": "Mathematics",
  "contact_email": "john@example.com",
  "contact_phone": "+1234567890",
  "preferences": {
    "no_classes_before": "10:00",
    "preferred_days": ["monday", "wednesday"]
  },
  "institution_id": 1
}
```

### Subjects

#### List Subjects
```http
GET /subjects?institution_id=1
```

#### Create Subject
```http
POST /subjects
Content-Type: application/json

{
  "name": "Calculus I",
  "type": "lecture",
  "description": "Introduction to calculus",
  "institution_id": 1
}
```

Subject types: `lecture`, `seminar`, `practical`, `lab`, `gym`

### Classrooms

#### List Classrooms
```http
GET /classrooms?institution_id=1&type=lecture_hall
```

#### Create Classroom
```http
POST /classrooms
Content-Type: application/json

{
  "name": "Room 205",
  "type": "regular",
  "capacity": 30,
  "equipment": ["projector", "whiteboard"],
  "building": "Main Building",
  "floor": 2,
  "institution_id": 1
}
```

Classroom types: `regular`, `lecture_hall`, `computer_lab`, `lab`, `gym`

### Time Slots

#### List Time Slots
```http
GET /time-slots?institution_id=1
```

#### Create Time Slot
```http
POST /time-slots
Content-Type: application/json

{
  "name": "1st Period",
  "period_number": 1,
  "start_time": "08:00:00",
  "end_time": "09:20:00",
  "institution_id": 1
}
```

### Schedule

#### Get Schedule
```http
GET /schedule?group_id=1
GET /schedule?teacher_id=1
GET /schedule?classroom_id=1
GET /schedule?specific_date=2024-01-15
```

#### Create Schedule Entry
```http
POST /schedule
Content-Type: application/json

{
  "day_of_week": "monday",
  "group_id": 1,
  "subject_id": 1,
  "teacher_id": 1,
  "classroom_id": 1,
  "time_slot_id": 1,
  "notes": "Optional notes"
}
```

Days of week: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`

#### Update Schedule Entry
```http
PUT /schedule/{entry_id}
Content-Type: application/json

{
  "status": "cancelled",
  "notes": "Teacher is sick"
}
```

Status options: `scheduled`, `cancelled`, `rescheduled`, `substituted`

#### Delete Schedule Entry
```http
DELETE /schedule/{entry_id}
```

### Change Requests

#### List Change Requests
```http
GET /change-requests?status=pending
```

#### Create Change Request
```http
POST /change-requests
Content-Type: application/json

{
  "change_type": "cancellation",
  "reason": "Teacher is ill",
  "requested_date": "2024-01-15",
  "schedule_entry_id": 1
}
```

Change types: `cancellation`, `substitution`, `reschedule`, `classroom_change`

#### For Substitution:
```json
{
  "change_type": "substitution",
  "reason": "Teacher unavailable",
  "requested_date": "2024-01-15",
  "schedule_entry_id": 1,
  "new_teacher_id": 2
}
```

#### For Reschedule:
```json
{
  "change_type": "reschedule",
  "reason": "Room conflict",
  "requested_date": "2024-01-15",
  "schedule_entry_id": 1,
  "new_time_slot_id": 3,
  "new_date": "2024-01-16"
}
```

#### Update Change Request (Admin only)
```http
PUT /change-requests/{request_id}
Content-Type: application/json

{
  "status": "approved",
  "admin_comment": "Approved. Substitute teacher assigned."
}
```

Status options: `pending`, `approved`, `rejected`

### Notifications

#### Get Notifications
```http
GET /notifications?unread_only=true
```

#### Mark as Read
```http
PUT /notifications/{notification_id}/read
```

#### Mark All as Read
```http
PUT /notifications/mark-all-read
```

#### Delete Notification
```http
DELETE /notifications/{notification_id}
```

## Response Formats

### Success Response
```json
{
  "id": 1,
  "name": "CS-101",
  "created_at": "2024-01-01T10:00:00",
  ...
}
```

### Error Response
```json
{
  "detail": "Error message here"
}
```

### Common HTTP Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

## Pagination

For endpoints that return lists, pagination is available:

```http
GET /schedule?skip=0&limit=20
```

## Filtering

Most list endpoints support filtering:

```http
GET /schedule?group_id=1&day_of_week=monday
GET /classrooms?type=lecture_hall&capacity_gte=50
```

## Interactive API Documentation

Visit these URLs when the backend is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide interactive documentation where you can test all endpoints directly from the browser.

## Rate Limiting

API rate limits (if configured):
- Authenticated users: 1000 requests/hour
- Unauthenticated: 100 requests/hour

## Webhooks (Future Feature)

Webhooks for real-time schedule updates will be available in a future release.

## SDK Libraries

Official SDKs:
- JavaScript/TypeScript: Available in frontend/src/services/api.ts
- Python: Coming soon
- Mobile: Available in mobile/src/services/api.ts

## Support

For API support:
- GitHub Issues: <repository-url>/issues
- Email: api-support@rozklad.com


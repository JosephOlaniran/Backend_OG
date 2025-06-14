# API Endpoints Documentation

This document lists all the API endpoints implemented in the Ideation Platform backend that conform to the OpenAPI specification.

## Base URL
- Development: `http://localhost:3000`
- Production: `https://backendtesting-production.up.railway.app/`

## Authentication
Most endpoints require JWT Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Admin Authentication
Admin-only endpoints require a JWT token from a user with admin role. Access is controlled by the AdminGuard.

## Endpoints

### Root
- **GET /** - Root Hello Message
  - Returns: "Hello World!" (plain text)

### User Management
- **POST /user/login** - User login
  - Body: `{ "employeeId": "string", "password": "string" }`
  - Returns: `{ "token": "string", "user": {...} }`

- **GET /user/me** - Get current user profile (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: User object without password

- **GET /user/{id}/activity** - Get user activity stats
  - Returns: `{ "ideasSubmitted": number }`

### Categories
- **GET /categories** - Get all idea categories
  - Returns: Array of category strings

### Ideas
- **POST /idea** - Create a new idea (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Content-Type: `multipart/form-data`
  - Form fields:
    - title (string, required)
    - description (string, required)
    - category (string, required)
    - impactLevel (string, required)
    - hashtags (array of strings, optional)
    - requiredResources (string, optional)
    - attachments (files, optional, max 5 files, 5MB each)

- **GET /idea** - Get all ideas
  - Query parameters:
    - employeeId (optional)
    - category (optional)
    - sortBy (optional): "recent" | "popular"
    - search (optional): Search in title and description
    - offset (optional): Number of records to skip for pagination
    - limit (optional): Maximum number of records to return
  - Returns: Array of IdeaResponseDto objects with comment counts, vote counts, and user information

- **GET /idea/{id}** - Get an idea by ID
  - Returns: IdeaResponseDto object with comment count, vote counts, and user information

- **PATCH /idea/{id}** - Update an idea
  - Body: Partial idea object with updateable fields
  - Returns: Updated IdeaResponseDto object

- **DELETE /idea/{id}** - Delete an idea
  - Returns: 204 No Content

- **PATCH /idea/{id}/approve** - Approve an idea (Admin)
  - Returns: Updated IdeaResponseDto with approved status

- **PATCH /idea/{id}/reject** - Reject an idea (Admin)
  - Returns: Updated IdeaResponseDto with rejected status

- **PATCH /idea/{id}/implemented** - Implement an idea (Admin)
  - Returns: Updated IdeaResponseDto with implemented status

### Comments
- **POST /comment/{ideaId}** - Post a comment on an idea (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "text": "string" }`
  - Returns: Created comment with user information

- **GET /comment/{ideaId}** - Get comments for an idea
  - Returns: Array of comments for the idea with user information

### Voting
- **POST /vote/{ideaId}** - Vote on an idea (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "isUpvote": boolean }`
  - Returns: Vote confirmation with toggle behavior (same vote removes it, different vote updates it)

- **GET /vote/{ideaId}** - Get all votes for an idea
  - Returns: Array of votes with user information

- **GET /vote/{ideaId}/count** - Get vote count for an idea
  - Returns: `{ "upvotes": number, "downvotes": number, "total": number }`

- **GET /vote/{ideaId}/user** - Get current user's vote for an idea (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: User's vote or null if not voted

### Dashboard
- **GET /dashboard/progress** - Get user submission progress (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "submitted": number, "goal": number }`

- **GET /dashboard/metrics** - Get dashboard innovation metrics (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "topIdeasPercentage": number, "engagementRate": number, "communityPoints": number, "ideasImplemented": number }`

### Admin Endpoints
- **GET /admin/ideas** - Admin - get all ideas (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Query parameters:
    - includeData (optional): Set to 'false' to return only count, defaults to true
  - Returns: `{ "data": Array of all ideas with relations and comment counts, "count": number }` or `{ "count": number }` if includeData=false

- **GET /admin/votes** - Admin - get all votes (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Query parameters:
    - includeData (optional): Set to 'false' to return only count, defaults to true
  - Returns: `{ "data": Array of all votes with relations, "count": number }` or `{ "count": number }` if includeData=false

- **GET /admin/comments** - Admin - get all comments (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Query parameters:
    - includeData (optional): Set to 'false' to return only count, defaults to true
  - Returns: `{ "data": Array of all comments with relations, "count": number }` or `{ "count": number }` if includeData=false

- **GET /admin/users** - Admin - get all users (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Query parameters:
    - includeData (optional): Set to 'false' to return only count, defaults to true
  - Returns: `{ "data": Array of all users without passwords, "count": number }` or `{ "count": number }` if includeData=false

- **GET /admin/counts** - Admin - get total entity counts (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Returns: `{ "ideas": number, "votes": number, "comments": number, "users": number }`

- **GET /admin/stats** - Admin - get detailed entity statistics (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Returns: Detailed breakdown of entity statistics including idea status counts, vote types, and user roles

- **GET /admin/activity** - Admin - get recent activities (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Query parameters:
    - limit (optional): Number of activities to return (default: 50)
  - Returns: Array of recent activities with user and idea information

- **GET /admin/activity/user/{userId}** - Admin - get activities by user (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Query parameters:
    - limit (optional): Number of activities to return (default: 20)
  - Returns: Array of activities for specific user

- **GET /admin/activity/idea/{ideaId}** - Admin - get activities by idea (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Query parameters:
    - limit (optional): Number of activities to return (default: 20)
  - Returns: Array of activities for specific idea

- **GET /admin/activity/type/{type}** - Admin - get activities by type (requires admin auth)
  - Headers: `Authorization: Bearer <admin-token>`
  - Parameters:
    - type: Activity type (idea_submitted, idea_voted, idea_commented, idea_approved, idea_rejected, idea_implemented)
  - Query parameters:
    - limit (optional): Number of activities to return (default: 20)
  - Returns: Array of activities of specific type

## Data Models

### IdeaResponseDto
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "category": "string",
  "impactLevel": "string",
  "hashtags": "string[]",
  "attachmentUrls": "string[]",
  "requiredResources": "string",
  "anonymousId": "string",
  "status": "pending | approved | implmented | rejected",
  "createdAt": "date",
  "updatedAt": "date",
  "commentCount": "number",
  "upVotes": "number",
  "downVotes": "number",
  "user": "User object (without password)"
}
```

### ErrorResponse
```json
{
  "statusCode": "number",
  "message": "string",
  "error": "string",
  "timestamp": "ISO date string",
  "path": "string"
}
```

### User
```json
{
  "id": "string (uuid)",
  "name": "string",
  "employeeId": "string",
  "email": "string",
  "role": "admin | employee",
  "gender": "male | female | other"
}
```

### Idea
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "category": "string",
  "impactLevel": "string",
  "hashtags": "string[]",
  "attachmentUrls": "string[]",
  "requiredResources": "string",
  "anonymousId": "string",
  "status": "pending | approved | implmented | rejected",
  "createdAt": "date",
  "updatedAt": "date",
  "commentCount": "number",
  "upVotes": "number",
  "downVotes": "number",
  "user": "User object (without password)"
}
```

### Comment
```json
{
  "id": "number",
  "text": "string",
  "ideaId": "number",
  "userId": "string",
  "createdAt": "date",
  "user": "User object"
}
```

### Vote
```json
{
  "id": "number",
  "isUpvote": "boolean",
  "ideaId": "number",
  "userId": "string",
  "user": "User object"
}
```

### Activity
```json
{
  "id": "number",
  "type": "idea_submitted | idea_voted | idea_commented | idea_approved | idea_rejected | idea_implemented",
  "userId": "string",
  "ideaId": "number",
  "metadata": "object",
  "createdAt": "date",
  "user": "User object",
  "idea": "Idea object"
}
```

**Note**: All error responses across the API follow the standardized ErrorResponse format above, including validation errors, authentication failures, and not found errors.

## File Upload
- Endpoint: POST /idea
- Max file size: 5MB per file
- Max files: 5 files per request
- Supported formats: All file types
- Upload directory: `./uploads/`

## Database Schema
The application uses MySQL database with the following tables:
- `user` - User accounts and profiles
- `idea` - Innovation ideas and submissions (linked to users)
- `comment` - Comments on ideas (linked to users and ideas)
- `vote` - Votes (upvotes/downvotes) on ideas (linked to users and ideas)
- `activity` - Activity logs for all user actions

## Environment Variables
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 3000)
- Database connection details are configured in `app.module.ts`

## CORS Configuration
The application is configured to accept requests from any origin with the following methods:
- GET, POST, PUT, DELETE, PATCH
- Headers: Content-Type, Authorization
- Credentials: enabled

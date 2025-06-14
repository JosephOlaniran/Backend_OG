# Ideation Platform API Overview

## 🎯 API Summary

The Ideation Platform API is a comprehensive NestJS-based backend service designed for innovation management within organizations. It provides secure, role-based access to idea submission, voting, commenting, and administrative functions.

**Version**: 1.2.0  
**Base URL**: `https://backendtesting-production.up.railway.app/`  
**Authentication**: JWT Bearer Token  

## 📋 Quick Reference

### Core Entities
- **Ideas**: Innovation submissions with voting and comment support
- **Users**: Employee accounts with role-based permissions
- **Votes**: Upvote/downvote system for ideas
- **Comments**: Discussion threads on ideas
- **Activities**: Audit trail of all user actions

### Response Formats
- **IdeaResponseDto**: Enhanced idea object with computed fields (vote counts, comment counts, user info)
- **Standard Entities**: User, Comment, Vote, Activity objects
- **Admin Responses**: Results with optional data inclusion
- **ErrorResponse**: Standardized error format with statusCode, message, error, timestamp, and path

## 🔐 Authentication Flow

```
1. POST /user/login → { token, user }
2. Include "Authorization: Bearer <token>" in subsequent requests
3. Admin endpoints require admin role in JWT payload
```

## 🚀 Endpoint Categories

### 1. Authentication & Users
| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/user/login` | User authentication | No |
| GET | `/user/me` | Current user profile | Yes |
| GET | `/user/{id}/activity` | User activity stats | No |

### 2. Ideas Management
| Method | Endpoint | Purpose | Auth Required | Returns |
|--------|----------|---------|---------------|---------|
| POST | `/idea` | Create idea with files | Yes | IdeaResponseDto |
| GET | `/idea` | List ideas (filtered) | No | IdeaResponseDto[] |
| GET | `/idea/{id}` | Get idea details | No | IdeaResponseDto |
| PATCH | `/idea/{id}` | Update idea | Yes | IdeaResponseDto |
| DELETE | `/idea/{id}` | Delete idea | Yes | 204 No Content |

### 3. Admin Actions (Ideas)
| Method | Endpoint | Purpose | Auth Required | Returns |
|--------|----------|---------|---------------|---------|
| PATCH | `/idea/{id}/approve` | Approve idea | Admin | IdeaResponseDto |
| PATCH | `/idea/{id}/reject` | Reject idea | Admin | IdeaResponseDto |
| PATCH | `/idea/{id}/implement` | Mark implemented | Admin | IdeaResponseDto |

### 4. Interactions
| Method | Endpoint | Purpose | Auth Required | Returns |
|--------|----------|---------|---------------|---------|
| POST | `/comment/{ideaId}` | Add comment | Yes | Comment |
| GET | `/comment/{ideaId}` | Get comments | No | Comment[] |
| POST | `/vote/{ideaId}` | Vote on idea | Yes | Vote |

### 5. Platform Features
| Method | Endpoint | Purpose | Auth Required | Returns |
|--------|----------|---------|---------------|---------|
| GET | `/categories` | Available categories | No | string[] |
| GET | `/dashboard/progress` | User progress | Yes | ProgressStats |
| GET | `/dashboard/metrics` | Innovation metrics | Yes | MetricsData |

## 🚨 Error Response Format

All API endpoints return standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request", 
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/idea"
}
```

**Error Fields:**
- **statusCode**: HTTP status code
- **message**: Human-readable error description
- **error**: Error type or HTTP status name
- **timestamp**: ISO timestamp when error occurred
- **path**: API endpoint where error happened

### 6. Admin Dashboard
| Method | Endpoint | Purpose | Returns |
|--------|----------|---------|---------|
| GET | `/admin/ideas` | All ideas | IdeaResponseDto[] or count |
| GET | `/admin/votes` | All votes | Vote[] or count |
| GET | `/admin/comments` | All comments | Comment[] or count |
| GET | `/admin/users` | All users | User[] or count |
| GET | `/admin/counts` | Entity totals | CountStats |
| GET | `/admin/stats` | Detailed stats | DetailedStats |

### 7. Activity Tracking
| Method | Endpoint | Purpose | Returns |
|--------|----------|---------|---------|
| GET | `/admin/activity` | Recent activities | Activity[] |
| GET | `/admin/activity/user/{userId}` | User activities | Activity[] |
| GET | `/admin/activity/idea/{ideaId}` | Idea activities | Activity[] |
| GET | `/admin/activity/type/{type}` | Type-filtered activities | Activity[] |

## 📊 Data Structures

### IdeaResponseDto (Primary Response Format)
```json
{
  "id": 1,
  "title": "Innovation Title",
  "description": "Detailed description...",
  "category": "Technology",
  "impactLevel": "high",
  "hashtags": ["innovation", "tech"],
  "attachmentUrls": ["file1.pdf"],
  "requiredResources": "Dev team, 2 months",
  "anonymousId": "anon-abc123",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "commentCount": 3,
  "upVotes": 12,
  "downVotes": 2,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "employeeId": "EMP001",
    "email": "john@company.com",
    "role": "employee",
    "gender": "male"
  }
}
```

### Key Computed Fields
- **commentCount**: Real-time count via database aggregation
- **upVotes/downVotes**: Live vote tallies
- **user**: Submitter info (password excluded)

## 🔍 Query Parameters

### GET /idea (Filtering & Sorting)
- `employeeId`: Filter by submitter
- `category`: Filter by category
- `sortBy`: "recent" | "popular"
- `search`: Text search in title/description
- `offset`: Skip number of records
- `limit`: Max results (1-100)
- `status`: Filter by idea status

### Admin Endpoints
- `includeData`: "true" | "false" (return data or count only)
- `limit`: Result limit for activity endpoints

## 📁 File Upload

### POST /idea (Multipart Form Data)
- **Max files**: 5 per request
- **Max size**: 5MB per file
- **Storage**: Local filesystem (`./uploads/`)
- **Field name**: `attachments`

## 🔒 Security Features

### JWT Authentication
- Bearer token format
- Role-based access control
- User context in protected routes

### Admin Protection
- Admin-only endpoints use AdminGuard
- Role verification in JWT payload
- Unauthorized access returns 403

### Data Privacy
- Passwords excluded from all responses
- Anonymous submission support
- User data sanitization

## 📈 Status Codes

### Success Responses
- **200 OK**: Successful GET/PATCH operations
- **201 Created**: Successful POST operations
- **204 No Content**: Successful DELETE operations

### Error Responses
- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Missing/invalid JWT
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

All errors follow the standardized ErrorResponse format shown above.

## 🔧 Development Information

### Database
- **Type**: MySQL with TypeORM
- **Schema**: Auto-sync enabled (development)
- **Relationships**: Full foreign key constraints

### Activity Logging
All user actions are automatically logged:
- `idea_submitted`, `idea_voted`, `idea_commented`
- `idea_approved`, `idea_rejected`, `idea_implemented`

### Performance Optimizations
- Single-query data retrieval for IdeaResponseDto
- Efficient JOIN operations for computed fields
- Batch processing for list operations
- Custom error handling with HttpExceptionFilter

## 📚 Documentation Files

- **API_ENDPOINTS.md**: Detailed endpoint documentation
- **ideation-openapi-spec.yml**: OpenAPI 3.0.3 specification
- **README.md**: Setup and deployment guide
- **API_OVERVIEW.md**: This comprehensive overview

## 🚀 Getting Started

1. **Authentication**: POST to `/user/login` with employeeId/password
2. **Create Ideas**: POST to `/idea` with multipart form data
3. **Interact**: Vote and comment on ideas
4. **Track Progress**: Use dashboard endpoints
5. **Admin Functions**: Access admin endpoints with admin role

For detailed implementation examples and request/response schemas, refer to the OpenAPI specification and endpoint documentation.
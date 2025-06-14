# Ideation Platform Backend

A NestJS-based backend API for an innovation ideation platform that allows employees to submit, vote on, and comment on ideas. This implementation conforms to the provided OpenAPI specification.

## Overview

The Ideation Platform is designed to foster innovation within organizations by providing a digital space where employees can:
- Submit innovative ideas with attachments
- Vote on ideas (upvote/downvote)
- Comment on ideas
- Track submission progress and metrics
- Admin management of ideas, votes, and comments

## Features Implemented

### ✅ Complete OpenAPI Spec Compliance
All endpoints from the `ideation-openapi-spec.yml` have been implemented:

- **Authentication**: JWT-based login system with role-based access control
- **User Management**: Profile management and activity tracking
- **Idea Management**: CRUD operations with file uploads and user tracking
- **Voting System**: User-authenticated upvote/downvote with toggle functionality
- **Comment System**: User-authenticated comments linked to authors
- **Categories**: Predefined and database-driven unique categories
- **Dashboard**: Real-time progress tracking and metrics calculation
- **Admin Panel**: Comprehensive administrative oversight with detailed statistics
- **Activity Logging**: Complete audit trail of all user actions

### 🚀 Key Technical Features

- **File Upload Support**: Multipart form-data handling with 5MB file limit
- **Database Integration**: MySQL with TypeORM for robust data management
- **JWT Authentication**: Secure token-based authentication with role-based guards
- **Activity Logging**: Comprehensive audit trail across all user interactions
- **Optimized Queries**: Smart service/repository usage for performance
- **CORS Enabled**: Cross-origin requests supported
- **Auto-sync Database**: Automatic schema synchronization
- **Input Validation**: Class-validator for request validation
- **Enum Support**: Type-safe enums for user roles, gender, idea status, and activities

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL database (configured for Railway deployment)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

### Environment Variables

Create a `.env` file with:
```env
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
```

Database configuration is currently hardcoded in `app.module.ts` for Railway deployment.

## API Endpoints

### Authentication
- `POST /user/login` - User login with employeeId and password
- `GET /user/me` - Get current user profile (requires auth)
- `GET /user/{id}/activity` - Get user activity statistics

### Ideas
- `POST /idea` - Create new idea with file attachments (requires auth)
- `GET /idea` - List ideas with filtering (employeeId, category, sortBy, search, offset, limit) - Returns array of IdeaResponseDto
- `GET /idea/{id}` - Get specific idea details - Returns IdeaResponseDto with vote counts and user info
- `PATCH /idea/{id}` - Update idea - Returns updated IdeaResponseDto
- `DELETE /idea/{id}` - Delete idea
- `PATCH /idea/{id}/approve` - Approve idea (Admin) - Returns IdeaResponseDto with approved status
- `PATCH /idea/{id}/reject` - Reject idea (Admin) - Returns IdeaResponseDto with rejected status
- `PATCH /idea/{id}/implement` - Mark idea as implemented (Admin) - Returns IdeaResponseDto with implemented status

### Interactions
- `POST /comment/{ideaId}` - Add comment to idea (requires auth)
- `GET /comment/{ideaId}` - Get comments for idea with user information
- `POST /vote/{ideaId}` - Vote on idea (requires auth)

### Platform
- `GET /categories` - Get available idea categories
- `GET /categories/unique` - Get unique categories from actual ideas in database
- `GET /dashboard/progress` - Get submission progress (requires auth)
- `GET /dashboard/metrics` - Get innovation metrics (requires auth)

### Admin
- `GET /admin/ideas` - Get all ideas (requires admin auth, supports includeData param)
- `GET /admin/votes` - Get all votes (requires admin auth, supports includeData param)
- `GET /admin/comments` - Get all comments (requires admin auth, supports includeData param)
- `GET /admin/users` - Get all users (requires admin auth, supports includeData param)
- `GET /admin/counts` - Get total entity counts (requires admin auth)
- `GET /admin/stats` - Get detailed entity statistics (requires admin auth)
- `GET /admin/activity` - Get recent activities (requires admin auth)
- `GET /admin/activity/user/{userId}` - Get activities by user (requires admin auth)
- `GET /admin/activity/idea/{ideaId}` - Get activities by idea (requires admin auth)
- `GET /admin/activity/type/{type}` - Get activities by type (requires admin auth)

## Database Schema

### User Entity
- UUID-based primary key
- Employee ID (unique identifier)
- Name, email, password
- Role (admin/employee) and gender enums
- Password hashing (recommended for production)

### Idea Entity
- Auto-increment ID
- Title, description, category, impact level
- Hashtags (array), required resources
- File attachment URLs
- Anonymous ID for privacy
- Status tracking (pending/approved/implmented/rejected)
- User relationship (optional for anonymous submissions)
- Timestamps (createdAt, updatedAt)

### IdeaResponseDto (API Response Format)
- All Idea entity fields plus computed fields:
- commentCount: Number of comments on the idea
- upVotes: Number of upvotes received
- downVotes: Number of downvotes received  
- user: User object (without password) who submitted the idea

### Comment Entity
- Auto-increment ID
- Text content and timestamps
- Relationship to ideas and users (tracks comment authors)
- User authentication required for creation

### Vote Entity
- Auto-increment ID
- Boolean upvote/downvote flag
- Relationship to ideas

### Activity Entity
- Auto-increment ID
- Activity type enum (idea_submitted, idea_voted, idea_commented, idea_approved, idea_rejected, idea_implemented)
- User and Idea relationships
- Metadata for additional context
- Timestamps for audit trail

## Data Transfer Objects (DTOs)

### IdeaResponseDto
The main response format for all idea-related endpoints. Combines entity data with computed fields:

```typescript
{
  id: number;                    // Unique identifier
  title: string;                 // Idea title
  description: string;           // Detailed description
  category: string;              // Idea category
  impactLevel: string;           // Expected impact level
  hashtags: string[];            // Associated hashtags
  attachmentUrls: string[];      // File attachment URLs
  requiredResources: string;     // Required resources
  anonymousId: string;           // Anonymous identifier
  status: IdeaStatus;            // Current status (pending/approved/implmented/rejected)
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
  commentCount: number;          // Computed: Number of comments
  upVotes: number;               // Computed: Number of upvotes
  downVotes: number;             // Computed: Number of downvotes
  user: Omit<User, 'password'>;  // Submitter info (without password)
}
```

**Key Features:**
- **Computed Fields**: Vote counts and comment counts are calculated via optimized database queries
- **User Safety**: User data excludes sensitive information (password)
- **Single Query**: All data retrieved efficiently in one database operation
- **Consistent Structure**: Same format across all idea endpoints (findOne, findAll, create, update)

### Other DTOs
- **CreateIdeaDto**: For creating new ideas with validation
- **UpdateIdeaDto**: For updating existing ideas
- **IdeaResponseDto**: Complete idea information for API responses

## File Upload System
</edits>

- **Storage**: Local filesystem (`./uploads/` directory)
- **Limits**: 5MB per file, maximum 5 files per request
- **Formats**: All file types supported
- **Naming**: Timestamped with random suffixes to prevent conflicts

## Security Considerations

⚠️ **Important for Production**:
- Implement proper password hashing (bcrypt)
- Add rate limiting
- Use environment variables for database credentials
- Add input sanitization
- Implement file type validation for uploads
- Configure proper CORS settings for production domains
- Set up proper logging and monitoring for activity logs

## Error Response Format

The API uses a standardized error response format across all endpoints:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/idea"
}
```

**Error Response Fields:**
- **statusCode**: HTTP status code (400, 401, 403, 404, 500, etc.)
- **message**: Human-readable error description or validation details
- **error**: Error type or HTTP status name
- **timestamp**: ISO timestamp when the error occurred
- **path**: API endpoint where the error happened

This format is implemented via a custom `HttpExceptionFilter` and applies to all error responses including validation errors, authentication failures, and not found errors.

## Development Notes

### Database Connection
Currently configured for Railway MySQL deployment. Update `app.module.ts` with your database credentials:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'your-host',
  port: 3306,
  username: 'your-username',
  password: 'your-password',
  database: 'your-database',
  // ... other options
})
```

### Auto-sync Enabled
The application automatically synchronizes database schema on startup. Disable `synchronize: true` in production and use migrations instead.

## Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── activity/        # Activity logging system
├── admin/           # Admin management endpoints
├── auth/            # JWT authentication strategy
├── categories/      # Idea categories management
├── comment/         # Comment system
├── common/          # Shared utilities and filters
│   ├── dto/         # Common DTOs (ErrorResponseDto)
│   └── filters/     # Custom exception filters
├── config/          # Configuration (multer, etc.)
├── dashboard/       # Dashboard metrics and progress
├── idea/            # Core idea management
│   ├── dto/         # Data Transfer Objects including IdeaResponseDto
│   └── ...
├── user/            # User management and authentication
├── vote/            # Voting system
├── app.module.ts    # Main application module
└── main.ts          # Application bootstrap
```

## API Documentation

See `API_ENDPOINTS.md` for detailed endpoint documentation and examples.

## License

This project is licensed under the UNLICENSED license.

## Production Deployment

The application is configured for deployment on Railway with the following production URL:
`https://backendtesting-production.up.railway.app/`

For other deployment platforms, ensure:
- Environment variables are properly set
- Database connection is configured
- File upload directory permissions are correct
- CORS settings match your frontend domain
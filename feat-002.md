# Feat: 002 - Enhanced Title Deed Application Matching System

## Overview

Enhanced the title deed application matching system to support multiple identification methods, allowing users to find their applications using either their username or secondary ID number. This improves user experience by providing more flexible search capabilities.

## Problem Statement

The previous implementation only matched title deed applications by the user's secondary ID (if available). This limitation caused issues when:

- Users didn't have a secondary ID configured
- Users wanted to find applications they created directly (by username)
- The matching logic was too restrictive

## Solution

Modified the `findMyApplications()` method in `TitleDeedApplicationService` to support dual matching criteria:

1. **Username-based matching**: Find applications where the user is the direct creator (`user_id` relationship)
2. **Secondary ID matching**: Find applications where the user is listed as an owner with matching secondary ID

## Code Changes

### Updated Query Logic (`src/models/title-deed-application/title-deed-application.service.ts`)

**Before:**

```typescript
const where: any = {
  titleDeedApplicationOwners: {
    some: {
      OR: [
        // Match by secondary ID if available
        ...(user.secondary_id_type && user.secondary_id
          ? [
              {
                id_type: user.secondary_id_type,
                id_number: user.secondary_id,
              },
            ]
          : []),
      ],
    },
  },
};
```

**After:**

```typescript
const where: any = {
  OR: [
    // Match by user_id (username)
    { user_id: user.id },
    // Match by secondary ID if available
    ...(user.secondary_id_type && user.secondary_id
      ? [
          {
            titleDeedApplicationOwners: {
              some: {
                id_type: user.secondary_id_type,
                id_number: user.secondary_id,
              },
            },
          },
        ]
      : []),
  ],
};
```

### Enhanced User Data Retrieval

Updated the user query to include the `id` field for username-based matching:

```typescript
const user = await this.prisma.user.findUnique({
  where: { id: request.user.sub },
  select: {
    id: true, // Added for username matching
    id_type: true,
    secondary_id_type: true,
    secondary_id: true,
    username: true,
    phone_number: true,
  },
});
```

## Database Relationships

The solution leverages existing database relationships:

- **TitleDeedApplication.user_id** → **User.id**: Direct relationship for username-based matching
- **TitleDeedApplication.titleDeedApplicationOwners** → **TitleDeedApplicationOwner**: Relationship for secondary ID matching

## Business Logic

### Matching Priority

1. **Primary Match**: Applications where the user is the direct creator (by `user_id`)
2. **Secondary Match**: Applications where the user is listed as an owner with matching secondary ID

### Fallback Behavior

- If user has no secondary ID, only username-based matching is used
- If user has secondary ID, both matching methods are applied
- Results are combined and deduplicated automatically by the database

## API Endpoint

### Updated Endpoint

- `GET /title-deed-application/my-applications` - Now supports dual matching

**Authentication**: Regular User Token (not Employee Token)

**Query Parameters:**

- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `search` (optional): Search term to filter applications

**Response:**
Returns paginated list of applications that match either:

- Applications created by the authenticated user
- Applications where the user is listed as an owner with matching secondary ID

## Benefits

1. **Improved User Experience**: Users can now find their applications regardless of how they were associated
2. **Flexible Matching**: Supports both direct creation and ownership relationships
3. **Backward Compatibility**: Existing secondary ID matching still works
4. **No Database Changes**: Leverages existing schema and relationships
5. **Performance**: Uses efficient database queries with proper indexing

## Testing Scenarios

1. **User with Secondary ID**: Should find applications by both username and secondary ID
2. **User without Secondary ID**: Should find applications by username only
3. **User with Multiple Applications**: Should find all relevant applications
4. **No Matching Applications**: Should return empty result set

## Migration Impact

- **No database migrations required**
- **No breaking changes to existing API**
- **Backward compatible with existing functionality**

## Future Enhancements

Potential improvements for future iterations:

- Add support for primary ID matching
- Implement fuzzy matching for ID numbers
- Add filtering by application status
- Support for organization-based matching

# JWT Security Improvements - Claim Minimization & PII Hygiene

## Overview

This document outlines the JWT security improvements implemented to follow JWT Best Current Practices (BCP) and ensure proper claim minimization and PII hygiene.

## Changes Implemented

### 1. Minimal JWT Claims

**Before:**

- JWT tokens contained roles, permissions, and PII
- Large payloads with embedded authorization data
- No standard JWT claims validation

**After:**

- JWT tokens contain only essential claims: `sub`, `username`, `username_verified`, `language`
- Standard JWT claims: `iss`, `aud`, `exp`, `iat`, `jti`
- No roles or permissions embedded in tokens

### 2. Strict JWT Validation

**Implemented:**

- Algorithm pinning to HS256 only
- Required claims validation: `sub`, `iss`, `aud`, `exp`, `iat`
- Clock skew tolerance of 30 seconds
- Proper issuer and audience validation
- Rejection of tokens with `alg=none`

### 3. Authorization Resolution at Request Time

**New Authorization Service:**

- `AuthorizationService` resolves permissions from database
- `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()` methods
- Support for both regular users and employees
- Proper error handling and logging

### 4. Updated Guards

**AuthGuard (Regular Users):**

- Strict JWT validation with logging
- Minimal token claim structure
- Proper error messages

**EmployeeAuthGuard:**

- Same strict validation as regular auth
- Employee-specific audience validation
- Enhanced logging for security events

**RolesGuard:**

- Now uses AuthorizationService instead of embedded roles
- Async permission checking
- Better error handling and logging

## Configuration

### Environment Variables

```env
# JWT Configuration
AUTH_JWT_SECRET=your-secret-key
AUTH_JWT_TOKEN_EXPIRES_IN=1145m
JWT_ISSUER=land-backend
JWT_AUDIENCE=land-backend-users  # for regular users
JWT_AUDIENCE=land-backend-employees  # for employees
```

### JWT Payload Structure

**Access Token:**

```json
{
  "sub": "user-id",
  "username": "username",
  "username_verified": true,
  "language": "en",
  "iss": "land-backend",
  "jti": "user-id-timestamp"
}
```

**Refresh Token:**

```json
{
  "sub": "user-id",
  "username": "username",
  "iss": "land-backend",
  "jti": "refresh-user-id-timestamp"
}
```

**Note:** The `aud`, `iat`, and `exp` claims are automatically added by the JWT service based on the configuration options.

## Security Benefits

1. **Reduced Token Size**: Smaller tokens reduce bandwidth and storage
2. **PII Protection**: No sensitive data in tokens
3. **Fresh Permissions**: Always up-to-date authorization data
4. **Algorithm Security**: Prevents algorithm confusion attacks
5. **Proper Validation**: All standard JWT claims validated
6. **Audit Trail**: Comprehensive logging for security events

## Migration Notes

### Breaking Changes

1. **Token Structure**: Existing tokens will be invalid after deployment
2. **Permission Resolution**: Permissions now resolved at request time
3. **Guard Behavior**: Enhanced validation may reject previously valid tokens

### Required Actions

1. **Client Applications**: Must handle new token structure
2. **Token Refresh**: Implement proper token refresh flow
3. **Error Handling**: Handle new validation error messages
4. **Testing**: Test with new minimal token structure

## Usage Examples

### Checking Permissions

```typescript
// In a service
constructor(private authService: AuthorizationService) {}

async someMethod(userId: string, resource: string, action: string) {
  const hasPermission = await this.authService.hasPermission(
    userId,
    resource,
    action,
    false // isEmployee
  );

  if (!hasPermission) {
    throw new UnauthorizedException('Insufficient permissions');
  }
}
```

### Getting User Roles

```typescript
// In auth service
async me(token: TokenClaim) {
  const user = await this.getLoginDetail(token.user.username);
  const userRoles = await this.authorizationService.getUserRoles(token.user.sub);

  return {
    ...user,
    userRoles,
    server_time: new Date()
  };
}
```

## Monitoring and Logging

### Security Events Logged

- Token validation failures
- Missing required claims
- Expired tokens
- Algorithm violations
- Permission check failures

### Log Format

```json
{
  "level": "warn",
  "message": "Token validation failed: Token expired",
  "error": "TokenExpiredError",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Compliance

This implementation follows:

- JWT RFC 7519
- JWT Best Current Practices (BCP)
- OAuth 2.0 Security Best Practices
- OWASP JWT Security Guidelines

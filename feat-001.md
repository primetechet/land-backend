# Feat: 001 - Title Deed Application Owner Verification System

## Overview

Implemented a comprehensive verification system for title deed application owners with business logic constraints to ensure data integrity and proper workflow management.

## Database Changes

### Schema Updates (`prisma/schema.prisma`)

Added verification fields to `TitleDeedApplicationOwner` model:

- `verified` (Boolean) - indicates if owner is verified
- `verified_at` (DateTime) - verification timestamp
- `verified_by_id` (String) - employee who verified
- `verifier_note` (String) - verification notes
- `rejected` (Boolean) - indicates if owner was rejected
- `rejected_at` (DateTime) - rejection timestamp
- `rejected_by_id` (String) - employee who rejected
- `rejecter_note` (String) - rejection notes
- `rejection_reason_id` (String) - reason for rejection

Added relations to `Employee` and `RejectionReason` models for audit trail.

## Business Logic Implementation

### Owner States

1. **Pending**: `verified = false` AND `rejected = false` (awaiting verification)
2. **Verified**: `verified = true` AND `rejected = false` (approved)
3. **Rejected**: `verified = false` AND `rejected = true` (rejected)

### Constraints (Code-Level)

1. **Same Person Constraint**: Only one person (by ID number) can be verified per application
2. **Pending Owner Constraint**: Only one owner can be in pending state per application
3. **Rejection Retry**: Rejected owners can be recreated (allowing retry)

## API Endpoints

### New Endpoints

- `POST /title-deed-application-owner/:id/verify` - Verify an owner
- `POST /title-deed-application-owner/:id/reject` - Reject an owner
- `GET /title-deed-application-owner/application/:applicationId/verified` - Get verified owner

### Updated Endpoints

- `POST /title-deed-application-owner` - Now includes verification checks

## Service Methods

### `create()` Method

- Checks for existing owners with same ID number
- Rejects if person is already verified
- Rejects if person is in pending state
- Allows creation if person was previously rejected

### `verify()` Method

- Prevents verification if same person already verified
- Prevents verification if another owner is pending
- Updates verification status with audit trail

### `reject()` Method

- Rejects owner with reason and notes
- Updates rejection status with audit trail

### `findVerifiedOwnerByApplicationId()` Method

- Returns the verified owner for a specific application

## DTOs Added

- `VerifyTitleDeedApplicationOwnerDto` - for verification requests
- `RejectTitleDeedApplicationOwnerDto` - for rejection requests

## Migration

- Created migration: `20250829180356_add_verification_to_title_deed_application_owner`
- Applied database schema changes

## Key Features

1. **Audit Trail**: All verification/rejection actions tracked with timestamps and employee IDs
2. **Status Tracking**: Verification and rejection status included in all queries
3. **Business Rules**: Enforced at code level to prevent data inconsistencies
4. **Workflow Management**: Proper state transitions from pending → verified/rejected
5. **Retry Mechanism**: Rejected owners can try again by creating new records

## Usage

- Employees can verify or reject owners through API endpoints
- System maintains data integrity by preventing duplicate verified owners
- All actions are logged for audit purposes
- Status information is available in all owner queries

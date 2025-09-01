# Feat: 004 - Title Deed Application Appointment System

## Overview

Implemented a comprehensive appointment scheduling system for title deed applications with slot-based booking, availability management, and employee off-day handling. The system provides real-time availability computation without pre-generated rows and enforces business rules for booking limits and double-booking prevention.

## Database Changes

### Schema Updates (`prisma/schema.prisma`)

#### New Models

**Slot Model**

- `id` (String) - Primary key
- `start_time` (String) - Slot start time (e.g., "09:00")
- `end_time` (String) - Slot end time (e.g., "10:00")
- `label` (String) - Optional human-readable label
- Unique constraint on `(start_time, end_time)`

**EmployeeOffSlot Model**

- `id` (String) - Primary key
- `employee_id` (String) - Reference to Employee
- `date` (DateTime @db.Date) - Date of unavailability
- `slot_id` (String) - Reference to Slot
- `reason` (String) - Optional reason for unavailability
- Unique constraint on `(employee_id, date, slot_id)`

#### Updated Models

**TitleDeedApplicationAppointment Model** (Complete Redesign)

- `id` (String) - Primary key
- `title_deed_application_id` (String) - Reference to application
- `employee_id` (String) - Reference to assigned employee
- `scheduled_date` (DateTime @db.Date) - Appointment date
- `slot_id` (String) - Reference to time slot
- `created_at` (DateTime) - Creation timestamp
- Unique constraint on `(employee_id, scheduled_date, slot_id)` - Prevents double booking

**TitleDeedApplication Model**

- Added `appointment_reschedule_count` (Int @db.SmallInt) - Tracks reschedule attempts (max 3)

#### Relations Added

- Employee ↔ TitleDeedApplicationAppointment (appointmentEmployee)
- Employee ↔ EmployeeOffSlot (employeeOffSlotEmployee)
- Slot ↔ TitleDeedApplicationAppointment
- Slot ↔ EmployeeOffSlot

## Business Logic Implementation

### Appointment States

1. **Available**: No EmployeeOffSlot AND no existing appointment for (employee, date, slot)
2. **Unavailable**: EmployeeOffSlot exists OR appointment already booked
3. **Booked**: Active TitleDeedApplicationAppointment exists

### Availability Algorithm

Real-time computation without pre-generated rows:

1. Check EmployeeOffSlot for conflicts
2. Check existing TitleDeedApplicationAppointment for conflicts
3. Return first 4 available slots across 60-day horizon

### Business Rules

1. **One Active Appointment**: Only one future appointment per application
2. **Reschedule Limit**: Maximum 3 reschedules per application
3. **Double Booking Prevention**: Unique constraint on (employee, date, slot)
4. **Employee Resolution**: Always uses `appointment_required_by_id` from application

## API Endpoints

### New Module: `TitleDeedApplicationAppointmentModule`

#### Endpoints

**Get Next 4 Options**

- `GET /title-deed-application-appointments/options?title_deed_application_id=X`
- Returns next 4 available appointment slots
- Input: `title_deed_application_id`
- Output: Array of `{ date, slot_id, human_time }`

**Book Appointment**

- `POST /title-deed-application-appointments/book`
- Books an appointment slot
- Input: `{ title_deed_application_id, scheduled_date, slot_id }`
- Validation: Checks availability, prevents double booking
- Error handling: Re-offers options if slot taken

**Reschedule Appointment**

- `POST /title-deed-application-appointments/reschedule`
- Reschedules existing appointment
- Input: `{ appointment_id?, title_deed_application_id?, scheduled_date, slot_id }`
- Transaction: Delete old + Create new + Increment counter
- Limit: Max 3 reschedules per application

**Set Employee Off Days**

- `POST /title-deed-application-appointments/off-days`
- Marks employee unavailable for specific date/slots
- Input: `{ employee_id, date, slot_ids[] }`
- Returns: Conflicting appointments for manual reschedule

## Service Methods

### Core Methods

#### `getNextOptions(dto: GetOptionsDto)`

- Resolves employee from application
- Scans 60-day horizon for availability
- Returns first 4 available slots chronologically

#### `book(dto: BookDto)`

- Validates single active appointment rule
- Checks real-time availability
- Creates appointment with unique constraint protection
- Re-offers options on race condition

#### `reschedule(dto: RescheduleDto)`

- Validates reschedule count limit
- Uses transaction for atomic operation
- Deletes old appointment, creates new, increments counter

#### `setOffDays(dto: SetOffDayDto)`

- Creates EmployeeOffSlot records (ignores duplicates)
- Lists conflicting appointments for staff action

### Helper Methods

#### `resolveEmployeeIdForApplication(applicationId)`

- Always uses `appointment_required_by_id` from application
- Throws error if not set

#### `isAvailable(employeeId, dateISO, slotId)`

- Checks EmployeeOffSlot conflicts
- Checks existing appointment conflicts
- Returns boolean availability

## DTOs

### Request DTOs

- `GetOptionsDto` - `{ title_deed_application_id }`
- `BookDto` - `{ title_deed_application_id, scheduled_date, slot_id }`
- `RescheduleDto` - `{ appointment_id?, title_deed_application_id?, scheduled_date, slot_id }`
- `SetOffDayDto` - `{ employee_id, date, slot_ids[] }`

## Seeding

### Default Slots (`prisma/seed.ts`)

Added 4 daily appointment windows:

1. Morning 1: 09:00 - 10:00
2. Morning 2: 10:00 - 11:00
3. Afternoon 1: 14:00 - 15:00
4. Afternoon 2: 15:00 - 16:00

## Migration

- Created migration: `20250901074631_appointment_slots_flow`
- Applied schema changes for new appointment system
- Seeded default slots successfully

## Key Features

1. **Real-time Availability**: No pre-generated availability rows, computed on demand
2. **Double Booking Prevention**: Database-level unique constraints
3. **Reschedule Management**: Transaction-safe with attempt counting
4. **Employee Off-day Support**: Flexible slot-level unavailability
5. **Conflict Detection**: Lists affected appointments when setting off days
6. **Automatic Employee Resolution**: Uses application's appointment_required_by_id
7. **Race Condition Handling**: Re-offers options on booking conflicts
8. **Audit Trail**: Timestamps and employee tracking on all appointments

## Architecture Decisions

1. **Slot-based Design**: Reusable daily time templates vs. absolute datetimes
2. **Computed Availability**: Real-time calculation vs. pre-generated availability table
3. **Unique Constraints**: Database-level prevention vs. application-level checks
4. **Transaction Safety**: Atomic reschedule operations
5. **Employee Binding**: Always resolve from application vs. user input

## Usage

- Applications with `appointment_required = true` can book appointments
- System offers next 4 available slots automatically
- Employees can set off days through staff interface
- Reschedule limit prevents abuse while allowing flexibility
- All booking conflicts handled gracefully with user feedback

## Integration

- Module wired into `AppModule`
- Uses existing `DatabaseService` for Prisma access
- Follows established controller/service/dto patterns
- Compatible with existing authentication and authorization

# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

Phase 2 continued — Notification Bell, Preferences, SubmitButton:

### Notification Bell in Header
- [x] Created NotificationBell client component with popover dropdown (5 recent, unread badge)
- [x] Wired into dashboard layout header with server-side data fetch
- [x] Shows relative time formatting and unread highlighting

### Notification Preferences
- [x] Created NotificationPreference Prisma model with (company, user, type) unique constraint
- [x] Created notification-preference query module (list, upsert, get)
- [x] Built /settings/notifications page with per-type in-app/email toggles
- [x] Added updateNotificationPreferenceAction server action
- [x] Added link to preferences from /settings page

### SubmitButton Adoption
- [x] Fixed SubmitButton component: added "use client" directive, fixed ButtonProps import
- [x] Replaced plain Button type="submit" with SubmitButton in 6 pages: leave, employees, departments, payroll, settings, ai-credits
- [x] All forms now show loading spinner during server action execution

Next: Tenant Onboarding Improvements, Multi-page website support, or further notification wiring.

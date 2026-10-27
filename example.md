# Clinic Appointment Platform

## Product Requirements Document (PRD)

| Field             | Value                               |
| ----------------- | ----------------------------------- |
| Document version  | 0.1.0                               |
| Status            | Draft — stakeholder review required |
| Product owner     | Founder / Product Owner             |
| Engineering owner | Full-Stack Developer                |
| Target release    | MVP — date TBD                      |
| Last updated      | 26 October 2026                     |

## 1. Purpose

The Clinic Appointment Platform is a web application that enables patients to discover doctors and request appointments, doctors to manage availability and appointment requests, and administrators to manage user accounts and oversee appointment operations.

This document defines the initial product scope, user roles, functional requirements, business rules, acceptance criteria, non-functional requirements, and unresolved decisions for the MVP.

This document is a proposed baseline. Assumptions must be confirmed with the product owner before the affected features are considered finalized.

## 2. Problem Statement

Small clinics may rely on telephone calls, messaging applications, or manual records to coordinate appointments. These processes can make availability difficult to communicate and appointment changes difficult to track.

The product aims to provide a centralized system for appointment discovery, booking, approval, and management.

## 3. Goals and Success Criteria

### 3.1 Product goals

- Allow patients to discover approved doctors and request appointments online.
- Allow doctors to publish availability and manage appointment requests.
- Prevent conflicting bookings for the same doctor and time slot.
- Give patients and doctors an accurate view of appointment status.
- Give administrators controlled tools for managing accounts and appointments.

### 3.2 Proposed MVP success metrics

The product owner must confirm targets before release.

- At least 95% of valid booking attempts complete successfully when the requested slot is available and the service is healthy.
- Zero duplicate confirmed bookings for the same doctor and slot in concurrency tests.
- All critical authorization tests pass.
- A new user can complete the main booking workflow without developer assistance.
- No unresolved critical or high-severity defects at release.

These metrics measure application behavior. They do not imply that real clinics have adopted the product.

## 4. Scope

### 4.1 In scope for MVP

- Patient account registration and login.
- Doctor account creation and administrative approval.
- Role-based access control.
- Doctor directory and basic search.
- Doctor availability management.
- Appointment booking and doctor approval/rejection.
- Patient appointment cancellation.
- Appointment rescheduling, subject to confirmed business rules.
- Appointment history and status visibility.
- Basic administrative account and appointment management.
- Server-side validation and error handling.
- Automated tests for critical business rules.
- Deployment, configuration, and project documentation.

### 4.2 Out of scope for MVP

- Online payments and refunds.
- Prescriptions and electronic medical records.
- Video consultations.
- Insurance claims.
- SMS and WhatsApp notifications.
- Integration with hospital information systems.
- Automated verification against professional licensing databases.
- Advanced analytics and multi-branch clinic management.
- Mobile applications.

Email notifications may be introduced after the core booking workflow is stable.

## 5. User Roles

### 5.1 Patient

A registered patient can:

- Manage their own account.
- Browse approved doctors.
- View available appointment slots.
- Book appointments.
- View their own upcoming and past appointments.
- Cancel eligible appointments.
- Request appointment changes if rescheduling is enabled.

Patients must not access another patient's private account or appointment information.

### 5.2 Doctor

An approved doctor can:

- Manage permitted profile information.
- Publish and modify availability.
- View appointments assigned to them.
- Accept or reject pending requests.
- Propose appointment changes.
- Mark eligible appointments as completed.

Doctors must not access another doctor's private appointment records unless an explicitly authorized administrative workflow permits it.

### 5.3 Administrator

An administrator can:

- Review doctor registration requests.
- Approve, reject, or deactivate accounts.
- Manage patient and doctor account status.
- View and update appointments when operationally necessary.
- Review relevant administrative activity.

Administrative permissions must be explicitly defined and enforced on the server. Administrative access does not automatically authorize access to every category of sensitive information.

## 6. Functional Requirements

Priority definitions:

- P0: Required for the MVP to function safely.
- P1: Important, but may follow the initial release.
- P2: Optional future enhancement.

### 6.1 Authentication and Accounts

#### FR-AUTH-001 — Patient registration (P0)

The system shall allow a patient to register using the approved required fields.

Proposed fields:

- Email address.
- Password.
- Full name.
- Phone number.

Username, date of birth, and address require product-owner confirmation. Blood group is excluded from the initial registration form unless a justified use case is approved.

Acceptance criteria:

- Required fields are validated on the server.
- Duplicate email addresses are rejected.
- Passwords are stored using an appropriate password-hashing algorithm.
- Password confirmation is validated but never persisted.
- Validation errors are communicated clearly.

#### FR-AUTH-002 — Login and logout (P0)

The system shall authenticate users using their registered credentials and establish a secure session.

Acceptance criteria:

- Invalid credentials do not create an authenticated session.
- Successful login establishes a session using the chosen session strategy.
- Logout invalidates the session.
- Authentication endpoints apply reasonable rate limits.
- Protected endpoints reject unauthenticated requests.

#### FR-AUTH-003 — Role authorization (P0)

The system shall enforce patient, doctor, and administrator permissions on the server.

Acceptance criteria:

- Patients cannot access doctor-only or administrator-only operations.
- Doctors cannot modify appointments belonging to unrelated doctors.
- Users cannot elevate their own roles by modifying request data.
- Unauthorized access attempts return appropriate error responses.

#### FR-AUTH-004 — Doctor approval (P0)

New doctor accounts shall remain pending until an administrator approves them.

Acceptance criteria:

- Pending doctors cannot publish public availability or accept appointments.
- Only authorized administrators can approve or reject a pending account.
- The system records the decision and its timestamp.
- Rejected or deactivated doctors cannot accept new appointments.

### 6.2 Doctor Discovery and Profiles

#### FR-DOC-001 — Doctor directory (P0)

Patients shall be able to view approved and active doctors.

The directory shall display approved public profile information, such as name, qualifications, and specialization where available.

Acceptance criteria:

- Pending, rejected, and deactivated doctors are not bookable.
- Private account information is not exposed in directory responses.
- Empty search results produce a clear message.

#### FR-DOC-002 — Search and filtering (P1)

Patients may search doctors by name and filter by approved profile attributes.

The initial search fields and sorting behavior must be confirmed before implementation.

### 6.3 Availability Management

#### FR-AVAIL-001 — Publish availability (P0)

Approved doctors shall be able to define bookable appointment slots.

The MVP will use discrete appointment slots with a defined start time and duration. The product owner must approve the slot-generation rules and supported time zone.

Acceptance criteria:

- Only approved doctors can publish availability.
- Invalid, past, or conflicting slots are rejected.
- A slot cannot be booked beyond the configured capacity.
- Changes to availability cannot silently invalidate an existing confirmed appointment.

#### FR-AVAIL-002 — Prevent conflicting reservations (P0)

The system shall enforce booking integrity on the server and database.

Acceptance criteria:

- Concurrent booking requests for one exclusive slot cannot both succeed.
- Availability displayed by the frontend is not treated as proof that a slot remains available.
- Failed bookings do not leave partial appointment records.
- A rejected or cancelled reservation releases capacity according to the approved booking rules.

### 6.4 Appointment Management

#### FR-APT-001 — Book appointment (P0)

An authenticated patient shall be able to select an available doctor slot and submit a booking request.

Acceptance criteria:

- The patient must be authenticated.
- The doctor must be approved and active.
- The selected slot must be available at the time the booking is committed.
- The resulting appointment is associated with the correct patient and doctor.
- The patient receives a clear success or failure response.
- Repeated requests do not create unintended duplicate appointments.

#### FR-APT-002 — Appointment approval (P0)

Doctors shall be able to accept or reject pending appointment requests.

Acceptance criteria:

- Only the assigned doctor or an authorized administrator can perform the action.
- Only appointments in an eligible state can be accepted or rejected.
- A rejected appointment is no longer treated as a confirmed booking.
- The resulting status is visible to the patient.

#### FR-APT-003 — View appointments (P0)

Patients shall be able to view their own appointments. Doctors shall be able to view appointments assigned to them.

The interface shall distinguish upcoming, pending, confirmed, cancelled, rejected, and completed appointments as applicable.

Acceptance criteria:

- The result set is restricted to the authenticated user's permissions.
- Empty lists and failed requests have appropriate UI states.
- Appointment times are displayed consistently in the agreed time zone.

#### FR-APT-004 — Cancel appointment (P0)

Patients shall be able to cancel eligible appointments according to the approved cancellation policy.

Acceptance criteria:

- Patients can cancel only their own eligible appointments.
- The system records the cancellation time and resulting status.
- Repeated cancellation requests do not corrupt appointment state.
- Slot capacity is released when the business rules permit it.

#### FR-APT-005 — Reschedule appointment (P1)

Rescheduling shall follow a defined workflow agreed upon by the product owner.

The workflow must specify whether a patient requests a change or the doctor proposes one, whether the other party must approve it, and when the original slot is released.

Acceptance criteria:

- A proposed change does not silently overwrite a confirmed appointment.
- The new slot is validated for availability.
- The system prevents conflicting bookings during the change.
- The final status and schedule are visible to both parties.

#### FR-APT-006 — Complete appointment (P0)

The assigned doctor shall be able to mark an eligible appointment as completed.

Acceptance criteria:

- Only authorized users can perform the transition.
- Appointments in cancelled or rejected states cannot be completed.
- The completion timestamp is recorded.
- Completed appointments remain available in history.

### 6.5 Administration

#### FR-ADMIN-001 — Manage accounts (P0)

Administrators shall be able to review accounts and approve, reject, deactivate, or reactivate accounts where permitted.

Acceptance criteria:

- Only authorized administrators can perform administrative actions.
- Account status changes are persisted.
- Deactivated users cannot initiate new protected actions.
- Existing appointments are not silently deleted when an account is deactivated.

#### FR-ADMIN-002 — Manage appointments (P0)

Administrators shall be able to search and review appointments and perform explicitly authorized corrections.

Acceptance criteria:

- Every administrative appointment change records the actor, timestamp, and action.
- Changes preserve appointment integrity.
- The system prevents unauthorized or invalid status transitions.

## 7. Business Rules

The following rules are proposed and require stakeholder approval where indicated.

**BR-001 — Appointment ownership:** Patients may manage only their own appointments, except for explicitly authorized administrative operations.

**BR-002 — Doctor eligibility:** Only approved, active doctors may receive new bookings.

**BR-003 — Slot capacity:** Each appointment slot has a defined capacity. The MVP defaults to one patient per slot unless the product owner specifies otherwise.

**BR-004 — Appointment lifecycle:** Permitted status transitions must be documented and enforced by the backend.

**BR-005 — Time zone:** Appointment creation, storage, and display must follow one documented time-zone policy. Store timestamps consistently and avoid relying on the browser's local clock for booking eligibility.

**BR-006 — Availability integrity:** A slot must be validated and reserved atomically. A frontend availability check alone is insufficient.

**BR-007 — Auditability:** Administrative changes and important appointment transitions must leave an appropriate audit trail.

**BR-008 — No clinical decisions:** The application manages scheduling; it does not diagnose patients or recommend treatment.

## 8. Non-Functional Requirements

### 8.1 Security

- Use secure password hashing and secure session or token handling.
- Enforce authorization for every protected operation.
- Validate and normalize untrusted input on the server.
- Protect against common web vulnerabilities, including injection, cross-site scripting, cross-site request forgery where applicable, and broken access control.
- Keep secrets out of source control.
- Apply rate limiting to authentication and other abuse-prone endpoints.
- Use HTTPS in production.

### 8.2 Privacy

- Collect only information necessary for approved product workflows.
- Do not use real patient data in development or public demonstrations.
- Restrict access to personal information by role and purpose.
- Define retention and deletion policies before handling real users' data.
- Review applicable privacy and healthcare-related legal obligations before production use.

### 8.3 Reliability and Data Integrity

- Booking and rescheduling operations must not produce conflicting reservations.
- Failed multi-step operations must not leave inconsistent data.
- Errors must be logged without exposing passwords, authentication secrets, or unnecessary personal information.
- Database backups and restoration procedures must be defined before production use.

### 8.4 Performance

Initial targets, subject to confirmation:

- Common read operations should target a 95th-percentile response time below 500 ms under the agreed test load, excluding external-provider latency.
- Booking operations should target a 95th-percentile response time below 1 second under the agreed test load.
- The application must provide pagination for potentially large result sets.

### 8.5 Accessibility and Usability

- Forms must have accessible labels and understandable validation messages.
- Core workflows must be usable with a keyboard.
- Status must not be communicated through color alone.
- Layouts must work on common desktop and mobile viewport sizes.

### 8.6 Maintainability

- Use consistent naming and code organization.
- Keep business logic out of presentation-only components.
- Provide automated tests for critical business rules.
- Document setup, configuration, API behavior, and deployment.
- Use version control and reviewable changes.

## 9. Error Handling Requirements

The application must handle at least the following cases:

- Invalid registration or login input.
- Duplicate account registration.
- Expired or invalid authentication.
- Unauthorized access.
- Non-existent doctor or appointment.
- Slot already booked by another patient.
- Appointment cancelled or changed by another user.
- Invalid appointment status transition.
- Database or external-service failure.
- Network interruption during a user action.

Errors must be understandable to users while detailed diagnostics remain in protected server logs.

## 10. Testing and Release Criteria

The MVP is eligible for release when:

- All P0 acceptance criteria pass.
- Automated tests cover authentication, authorization, appointment lifecycle, and concurrent booking.
- Unauthorized users cannot access other users' appointment data.
- No duplicate confirmed booking is possible for an exclusive slot.
- Database migrations and seed-data setup are reproducible.
- Production configuration contains no committed secrets.
- Deployment and rollback procedures are documented.
- No unresolved critical or high-severity defects remain.
- The product owner accepts the completed MVP workflow.

## 11. Risks and Dependencies

| Risk                          | Mitigation                                                   |
| ----------------------------- | ------------------------------------------------------------ |
| Double-booking                | Atomic reservation logic and database integrity controls     |
| Unauthorized access           | Server-side authorization and negative security tests        |
| Unclear cancellation policy   | Obtain explicit product-owner decision before implementation |
| Doctor availability conflicts | Validate schedule changes against existing bookings          |
| Sensitive data exposure       | Minimize data collection and use role-based access           |
| Scope expansion               | Prioritize P0/P1/P2 and require approval for scope changes   |
| Deployment failure            | Document deployment, backups, and rollback                   |

## 12. Open Questions

These decisions remain unresolved and must be tracked before the relevant feature is finalized.

| ID     | Question                                                           | Owner                          |
| ------ | ------------------------------------------------------------------ | ------------------------------ |
| OQ-001 | Can patients register using email only, or is a username required? | Product owner                  |
| OQ-002 | Is email verification mandatory for the MVP?                       | Product owner                  |
| OQ-003 | Is two-factor authentication required at launch?                   | Product owner / security owner |
| OQ-004 | Who creates doctor accounts and verifies qualifications?           | Product owner                  |
| OQ-005 | How do doctors define available slots and appointment duration?    | Product owner / engineering    |
| OQ-006 | Does booking reserve a slot while awaiting doctor approval?        | Product owner                  |
| OQ-007 | What are the cancellation and rescheduling deadlines?              | Product owner                  |
| OQ-008 | Can doctors propose changes that require patient approval?         | Product owner                  |
| OQ-009 | Which time zone should govern appointments?                        | Product owner                  |
| OQ-010 | Which profile fields are necessary for the MVP?                    | Product owner                  |
| OQ-011 | What are the approved retention and deletion rules?                | Product owner / legal          |
| OQ-012 | Are email notifications required for launch?                       | Product owner                  |

## 13. Change Management

Requirements changes must be recorded with:

- A description of the requested change.
- The business reason.
- The affected requirement IDs.
- The impact on data, API, UI, testing, and deployment.
- The approval decision.

This document should be updated when approved changes materially alter product behavior.

## 14. Approval

| Role              | Name | Status         |
| ----------------- | ---- | -------------- |
| Product owner     | TBD  | Pending review |
| Engineering owner | TBD  | Pending review |
| QA / test owner   | TBD  | Pending review |

**Document status:** Draft. The document is not considered an approved production specification until the relevant open questions and release-critical requirements are resolved.

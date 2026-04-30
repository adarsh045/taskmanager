# Testing Guide

This file provides a step-by-step manual testing checklist for the Team Task Manager project.

## Test Accounts

### Admin

- Email: `ava.admin@assignment1.dev`
- Password: `Password123`
- Role to select on login: `Admin`

### Members

- Email: `mason.member@assignment1.dev`
- Password: `Password123`
- Role to select on login: `Member`

- Email: `nina.member@assignment1.dev`
- Password: `Password123`
- Role to select on login: `Member`

## Start The Project

From the project root:

```powershell
npm start
npm run dev:frontend
```

Open:

```text
http://localhost:5173
```

## Admin Testing

### 1. Admin Login

1. Open the login page.
2. Enter:
   - email: `ava.admin@assignment1.dev`
   - password: `Password123`
   - role: `Admin`
3. Click `Sign in`.
4. Verify:
   - dashboard opens successfully
   - sidebar shows role as `Admin`
   - project creation form is visible
   - task creation form is visible

### 2. Project Creation

1. In the project section, create a new project.
2. Enter:
   - project name
   - description
   - owner
   - members
3. Submit the form.
4. Verify:
   - the project appears in the project list
   - selected members are visible in the project card

### 3. Project Update

1. Click `Edit` on a project.
2. Change the name or description.
3. Save changes.
4. Verify:
   - updated values appear immediately

### 4. Add/Remove Members

1. Use the member dropdown inside a project card.
2. Add a member.
3. Verify the member appears in the project.
4. Remove a non-owner member.
5. Verify the member disappears.

### 5. Task Creation

1. In the task section, choose a project.
2. Fill:
   - title
   - description
   - priority
   - deadline
   - assigned member
3. Submit.
4. Verify:
   - task appears in task board
   - assigned member is shown
   - selected project is shown

### 6. Task Status Update

1. Change the task status using the status dropdown.
2. Verify:
   - status changes correctly
   - updated status remains visible

### 7. Add Comment

1. Add a comment inside the task card.
2. Submit.
3. Verify:
   - comment appears in the comments section
   - author name is shown

### 8. Delete Task

1. Click `Delete task`.
2. Verify:
   - task disappears from the task board

### 9. Delete Project

1. Delete a project.
2. Verify:
   - project disappears from project list

## Member Testing

### 1. Member Login

1. Log out from admin.
2. Open login page again.
3. Enter:
   - email: `mason.member@assignment1.dev`
   - password: `Password123`
   - role: `Member`
4. Click `Sign in`.
5. Verify:
   - dashboard opens successfully
   - sidebar shows role as `Member`

### 2. Member Restrictions

Verify that the member cannot see:
- project creation form
- task creation form
- project delete controls
- task delete controls

### 3. Member Task Visibility

1. Confirm tasks assigned to the member are visible.
2. Confirm project information is visible.
3. Confirm comments section is visible.

### 4. Member Status Update

1. Change the status of a task assigned to the member.
2. Verify:
   - status changes successfully
   - value stays updated after refresh

### 5. Member Comment Test

1. Add a comment to a visible task.
2. Submit.
3. Verify:
   - comment appears in the task card
   - comment formatting looks correct

## Role Validation Test

### 1. Wrong Role Selection

1. Try logging in with:
   - email: `mason.member@assignment1.dev`
   - password: `Password123`
   - role: `Admin`
2. Verify:
   - login is rejected

3. Try logging in with:
   - email: `ava.admin@assignment1.dev`
   - password: `Password123`
   - role: `Member`
4. Verify:
   - login is rejected

## Overdue Task Test

### 1. Create Overdue Task

1. Login as admin.
2. Create a task with:
   - an old deadline
   - status not completed
3. Verify:
   - task is highlighted as overdue
   - overdue count increases in dashboard summary

### 2. Complete Overdue Task

1. Change status to `Completed`.
2. Verify:
   - overdue highlight is removed

## Refresh and Persistence Test

### 1. Refresh Test

1. While logged in, refresh the page.
2. Verify:
   - user remains logged in
   - data still loads correctly

### 2. Persistence Test

1. Create or update:
   - project
   - task
   - comment
2. Refresh page.
3. Log out and log in again.
4. Verify:
   - changes are still present

## Data Verification In Database

The application uses MongoDB Atlas with database:

- `propertyDB`

Main collections:
- `users`
- `projects`
- `tasks`

To verify persistence:

1. Open MongoDB Atlas or MongoDB Compass.
2. Open database `propertyDB`.
3. Check:
   - `users` for registered users
   - `projects` for created projects
   - `tasks` for created tasks
   - `tasks.comments` for comments

## Expected Final Result

If all tests pass, then the project is correctly working for:
- authentication
- role-based access control
- project management
- task management
- task assignment
- status tracking
- comments
- overdue task detection
- MongoDB data storage


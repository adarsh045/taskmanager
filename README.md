# Team Task Manager

A full-stack web application where users can create projects, assign tasks, track progress, and collaborate with role-based access control.

This project was built for an assignment using:
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
## Features

- User authentication with signup and login
- Role-based access control for `Admin` and `Member`
- Project creation, update, deletion, and team member management
- Task creation, assignment, status updates, and deletion
- Dashboard with task summary, filters, and overdue highlighting
- Comments on tasks
- MongoDB persistence using Mongoose models and relationships

## Roles

### Admin

An admin can:
- create projects
- update projects
- delete projects
- add and remove project members
- create tasks
- assign tasks to members
- update task status
- delete tasks
- add comments
- view all users for assignment and team management

### Member

A member can:
- log in and view their dashboard
- view accessible projects and tasks
- update the status of tasks assigned to them
- add comments on visible tasks

A member cannot:
- create projects
- delete projects
- create tasks
- delete tasks

## Important Login Credentials

The application includes seeded demo accounts.

### Admin Account

- Email: `ava.admin@assignment1.dev`
- Password: `Password123`
- Role to select on login: `Admin`

### Member Accounts

- Email: `mason.member@assignment1.dev`
- Password: `Password123`
- Role to select on login: `Member`

- Email: `nina.member@assignment1.dev`
- Password: `Password123`
- Role to select on login: `Member`

## Important Authentication Note

The login form includes a role selector.

- If you log in with the admin account, select `Admin`
- If you log in with a member account, select `Member`

If the selected role does not match the actual role of the account, login will be rejected.

Admin signup is intentionally locked once an admin already exists. This protects the application from anyone creating a new admin account after the system is initialized.

## Seeded Demo Data

The seed script creates:
- 1 admin user
- 2 member users
- 1 sample project
- sample tasks
- sample comments

You can reseed demo data with:

```powershell
npm run seed:backend
```

## Project Setup

### 1. Install dependencies

Root dependencies:

```powershell
npm install
```

Frontend dependencies:

```powershell
cd frontend
npm install
cd ..
```

### 2. Configure environment variables

Root `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://adarsh:**********m.d3o2dxx.mongodb.net/****
JWT_SECRET=replace-with-a-strong-secret
CLIENT_URL=http://localhost:5173
```

Frontend `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Run The Project

Start the backend from the project root:

```powershell
npm start
```

Start the frontend from the project root:

```powershell
npm run dev:frontend
```

Frontend URL:

```text
http://localhost:5173
```

## Useful Scripts

From the project root:

```powershell
npm start
npm run dev:backend
npm run dev:frontend
npm run build:frontend
npm run seed:backend
```

## REST API Overview

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `PATCH /api/projects/:id/members`
- `DELETE /api/projects/:id`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/comments`

### Dashboard

- `GET /api/dashboard/overview`

### Users

- `GET /api/users`

## Database Storage

The application stores data in MongoDB Atlas using the connection string in the root `.env`.

Current configured database:
- Database name: `propertyDB`

Main collections:
- `users`
- `projects`
- `tasks`

Comments are stored inside the `tasks` collection as embedded subdocuments in the `comments` array.

## Data Relationships

- A project has one owner and many members
- A task belongs to one project
- A task is assigned to one user
- A task is created by one user
- A task contains many comments
- Each comment has an author

## File Structure

High-level structure:

```text
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    seeds/
    services/
    utils/
    validators/

frontend/
  src/
    api/
    components/
    contexts/
    features/
    layouts/
    pages/
    routes/
    utils/
```

## Validation and Security

- request validation is implemented for auth, projects, and tasks
- passwords are hashed before storage
- JWT-based authentication is used
- route protection is enforced with role-based middleware

## Assignment Coverage

This project satisfies the assignment requirements for:
- authentication
- project and team management
- task creation and assignment
- status tracking
- dashboard with overdue visibility
- REST APIs
- NoSQL database integration
- validations
- role-based access control

## Important Notes For Evaluation

- Use the seeded admin account to test all admin-only features
- Use the seeded member accounts to test restricted member behavior
- If port `5000` is already in use, stop the existing process before starting the backend
- Replace `JWT_SECRET` with a stronger value before production use


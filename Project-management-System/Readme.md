# Project Management System

## Objective

This RESTful API is designed to manage projects, tasks, and users within an organization. It supports basic CRUD operations for each entity and enforces rules such as task assignment limits and project status automation.

---

## Features

1. **Project Management**

   - Create, read, update, and delete projects.
   - Automatically mark a project as "Completed" when all its tasks are completed.

2. **Task Management**

   - Create, read, update, and delete tasks.
   - Filter tasks by project or user.
   - Limit task assignment to a maximum of 5 active tasks per user.

3. **User Management**
   - Create, read, update, and delete users.
   - Validate email uniqueness for users.

---

## API Endpoints

### Project APIs

- `POST /projects` – Create a new project.
- `GET /projects` – List all projects (supports pagination and filtering by name or status).
- `GET /projects/{id}` – Get details of a specific project.
- `PUT /projects/{id}` – Update project details.
- `DELETE /projects/{id}` – Delete a project (and associated tasks).

### Task APIs

- `POST /tasks` – Create a new task (requires project and user validation).
- `GET /tasks` – List all tasks (supports filtering by project, user, name, or status).
- `GET /tasks/{id}` – Get details of a specific task.
- `PUT /tasks/{id}` – Update task details (e.g., status).
- `DELETE /tasks/{id}` – Delete a task.

### User APIs

- `POST /users` – Create a new user.
- `GET /users` – List all users.
- `GET /users/{id}` – Get details of a specific user.
- `PUT /users/{id}` – Update user details.
- `DELETE /users/{id}` – Delete a user (and associated tasks).

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project-management-system
   ```
2. Install dependency:

   ```
   npm install

   ```

3. Create a .env file and add following code:

   ```
   MONGO_URI=<your-mongodb-connection-string>
   PORT=3000
   ```

4. Start the server:

   ```
   npm start

   ```

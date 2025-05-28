# MIS for Computer Science College

**Completed by:** Vlasova Lada
**Student ID:** 202569990048
**GitHub with code:** https://github.com/je11yy/MIS-for-Computer-Science-college

---

## Description

This application is designed to manage information about courses, students, and teachers.
It's developed for use by students, teachers, and administrators.

---

## How to Run

1.  Make sure Docker is installed on your device.
    If Docker is not supported, you can use GitHub Codespaces to run the project.

2.  In your terminal, run the command:

    ```
    docker-compose up
    ```

## Requirements

-   Docker or GitHub Codespaces

---

## Alternative Run (without Docker)

1.  Install dependencies:

    ```
    cd backend
    pip install -r requirements.txt
    cd ../frontend
    npm install
    ```

2.  Start the backend.

    ```
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```

3.  Start the frontend.

    ```
    npm run dev --- --host 0.0.0.0 --port 5173
    ```

4.  Start the database.

    ```
    psql -U postgres
    ```

    In the interactive console:

    ```
    CREATE DATABASE dbname;
    CREATE USER user WITH ENCRYPTED PASSWORD 'password';
    GRANT ALL PRIVILEGES ON DATABASE dbname TO user;
    ```

    Use script.sql:

    ```
    psql -U user -d dbname -f db/script.sql
    ```

# Requirements

-   Python
-   Node.js and npm
-   PostgreSQL (must run on port 5432)
-   pip, psql (PostgreSQL CLI)

---

# Application Architecture

## Backend (`/backend`)

The server-side of the application. It handles business logic, database operations, and API request processing.

### Structure:

-   `models` — data models
-   `routes` — API routes (request handlers)
-   `db` — database operations (initialization, connections, queries)
-   `utils` — utility functions and modules

---

## Frontend (`/frontend`)

The client-side. It implements the user interface and enables user interaction with the system.

### Structure:

-   `pages` — application pages
-   `components` — reusable UI components
    -   `account` — user account page components
    -   `course` — course page components
    -   `student` — student page components
    -   `teacher` — teacher page components
-   `context` — global state contexts
    -   `AuthContext` — user authentication management
    -   `ThemeContext` — theme management (light/dark)
-   `utils` — utility functions
    -   `Fetches` — wrappers for backend requests

---

## Database (`/db`)

Stores all information related to users, courses, teachers, and students.

### Contents:

-   `script.sql` — SQL script for database schema initialization and basic data population

---

# User Roles:

-   **Administrator** Can create, edit, and delete any information: courses, students, teachers, and manage course assignments.

-   **Student** Can view courses and teacher information, enroll in courses, and view their grades.

-   **Teacher** Can view information about students and courses, and assign and edit student grades.

---

# Application Pages

## Home Page (`/`)

-   Accessible to all users.
-   Displays general university information:
    -   Number of pupils, students, courses
    -   Average grade across all students
    -   Brief description of the institution

---

## Login Page (`/login`)

-   For registered users to log in.
-   If a user is not yet registered, there's a link to registration.

---

## Registration Page (`/register`)

-   For creating a new account.
-   **Administrator registration is not available**.
-   During registration:
    -   **Student**: requires `student ID`
    -   **Teacher**: requires `teacher ID`
    -   Simultaneous entry of `student ID` and `teacher ID` is prohibited

---

### Courses (`/courses`)

-   Detailed information about courses can be viewed:
    -   Minimum grade for enrollment
    -   Average grade for the course
-   Roles:
    -   **Administrator**:
        -   Create, edit, delete courses
    -   **Student / Teacher**:
        -   View only

### Classes (`/classes`)

-   Detailed information for each class can be viewed:
    -   Average grade
    -   List of students
-   Can navigate to the page of all students
-   Roles:
    -   **Administrator**:
        -   Add, edit, delete students
    -   **Student / Teacher**:
        -   View only

### Teachers (`/teachers`)

-   View information about teachers
-   Roles:
    -   **Administrator**:
        -   Add, edit, delete
        -   Assign and remove courses
    -   **Student / Teacher**:
        -   View only

### Account (`/account`)

-   Information about the current user:
    -   Personal data
    -   User's courses (if student or teacher)

---

## Navigation (Navbar)

-   If the user is **logged in**:
    -   Links to: `Students`, `Courses`, `Teachers`, `Account`
-   If the user is **not logged in**:
    -   Only a link to `Login`
-   Theme toggle button: light or dark

---

# Usage Instructions

## Actions on List Pages

On the **students**, **teachers**, and **courses** pages, each list item includes a column with action buttons:

-   View detailed information
-   Edit item
-   Delete item
-   For students and teachers — a button to edit associated courses

## Classes Page

For each class, the following actions are available:

-   View the list of students belonging to the class

## Registration

On the registration page, you need to:

1.  Enter a username
2.  Enter a password
3.  Enter a **student ID** or **teacher ID** (depending on the account type)

After clicking the registration button, the user will be redirected to the home page with general university information.

## Login

On the login page, you need to:

1.  Enter a username
2.  Enter a password
3.  Click the login button

After successful login, the user will be redirected to the application's home page.

## Theme Toggle

The button to switch themes (light / dark) is located in the **top right corner** of the interface.
To change the theme, click this button.

---

## Interface (Screenshots)

![Main Page (Light Theme)](screenshots/main-page-light.png)
![Main Page (Dark Theme)](screenshots/main-page-dark.png)
![Login Page](screenshots/login-page.png)
![Registration Page](screenshots/register-page.png)
![Courses Page](screenshots/courses-page.png)
![Classes Page](screenshots/classes-page.png)
![Students Page](screenshots/students-page.png)
![Teachers Page](screenshots/teachers-page.png)
![Account Page](screenshots/account-page.png)
![Student Information](screenshots/student-info.png)
![Course Information](screenshots/course-info.png)
![Class Information](screenshots/class-info.png)
![Assigning Courses to Teachers](screenshots/teacher-courses.png)
![Assigning Courses to Students](screenshots/student-courses.png)
![Edit Course Page](screenshots/edit-course.png)
![Edit Teacher Page](screenshots/edit-teacher.png)
![Edit Student Page](screenshots/edit-student.png)
![Add Student Page](screenshots/add-student.png)
![Add Teacher Page](screenshots/add-teacher.png)
![Add Course Page](screenshots/add-course.png)

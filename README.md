
# User Management System

A complete User Management System built with Node.js, Express, and MySQL. This application provides a secure and robust foundation
for user registration, login, profile management, role-based permissions, and password recovery.

## Features

- **User Authentication:** Secure user registration and login with password hashing (`bcrypt.js`).
- **Session Management:** Persistent user sessions using `express-session` to keep users logged in.
- **Role-Based Access Control:** Differentiates between 'admin' and 'user' roles, protecting specific routes and actions.
- **CRUD Operations:** Admins can Create, Read, Update, and Delete users from a central dashboard.
- **Profile Management:** Logged-in users can view their own profile information.
- **Secure Password Reset:** A token-based "Forgot Password" feature that sends a secure, time-limited link via email (`Nodemailer`).
- **Change Password:** An email sent on user account from where if wants to change his password he can click yes if he click yes if will move
-  to new page of change password where user can change his password 
- **Responsive UI:** A clean and modern user interface built with Handlebars.js (HBS).

##  Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Templating Engine:** Handlebars.js (HBS)
- **Authentication & Security:** `bcrypt.js`, `express-session`, `crypto`
- **Email Service:** `Nodemailer`

##  Screenshots of Projects

**Login Page**

<img width="1911" height="867" alt="image" src="https://github.com/user-attachments/assets/722c57dc-cbe4-4c84-b144-447c45b75fcb" />


**Home Dashboard (Admin View)**

<img width="1888" height="866" alt="image" src="https://github.com/user-attachments/assets/f00311f1-b6ce-422b-97ba-0e829f9bf4bc" />


**Edit User Page**


<img width="1916" height="732" alt="image" src="https://github.com/user-attachments/assets/dfd1d3dd-8c18-486c-946f-39a65007de41" />


##  Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You must have the following software installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher is recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A MySQL database server.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Subhanjavaid12/User_Management_System]
    ```

2.  **Navigate into the project directory:**
    ```bash
    User_Management_System
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  Create a `.env` file in the root of the project.
2.  Copy the example environment variables into your new `.env` file.
3.  Fill in the required credentials for your database and email service.

    ```env
    # A long, random, and secret string used to sign session cookies
    SESSION_SECRET=''

    # Your MySQL Database Credentials
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name

    # Your Email Credentials (for Nodemailer)
    # Example for Gmail with an App Password
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USERNAME=
    EMAIL_PASSWORD=
    ```

### Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
2.  Open your browser and navigate to `http://localhost:5000` (or the port you have configured).


# login-signup-node-app
# Employee Management System

This is a simple Employee Management System built with Node.js and Express. The application allows users to register, log in, and manage employee details, including viewing, updating, and deleting records. The project also includes password validation and a session tracking mechanism to display the logged-in user's name.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Routes](#routes)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration:** Register new users with a valid email and a secure password.
- **User Login:** Log in with an email and password, with session tracking for the logged-in user.
- **View Employee Details:** View all stored employee records in a tabular format.
- **Add Employee Details:** Add new employee details, which are stored in a text file.
- **Update Employee Details:** Update existing employee records.
- **Delete Employee Details:** Delete employee records.
- **Password Validation:** Password must be at least 8 characters long and contain alphabets, numbers, and special characters.
- **Session Tracking:** Display the logged-in user's name on the home page.

## Requirements

- Node.js (v14.x or later)
- NPM (v6.x or later)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Arjunn-Arora/login-signup-node-app.git

   Usage
Register a New User:

Visit http://localhost:3000/register27.html to register a new user.
Enter your name, email, and a valid password.
Log In:

Visit http://localhost:3000/login27.html to log in.
Enter your registered email and password.
Access the Home Page:

After logging in, you will be redirected to the home.html page.
Your username will be displayed in the top-right corner.
Manage Employee Details:

From the home page, you can view, update, or delete employee details.
Logout:

Click the "Logout" button on the home page to log out.
File Structure
arduino
Copy code
employee-management-system/
├── app.js
├── data.json
├── employeedetails.txt
├── index.html
├── home.html
├── employee.html
├── register27.html
├── login27.html
├── bootstrap.min.css
├── fontawesome-all.min.css
├── iofrm-style.css
├── iofrm-theme33.css
└── README.md
app.js: The main server file containing all routes and logic.
data.json: Stores registered users.
employeedetails.txt: Stores employee details in a text format.
index.html: The landing page.
home.html: The home page displayed after login.
employee.html: The page for managing employee details.
register27.html: The registration page.
login27.html: The login page.
CSS Files: Bootstrap and custom CSS for styling the pages.
Routes
GET /: Serve the landing page (index.html).
GET /employee.html: Serve the employee management page.
POST /submit: Handle form submission for adding employee details.
GET /data: Display stored employee data in a table format.
GET /update: Serve the update form with pre-filled data.
POST /submit-update: Handle the submission for updating employee data.
GET /delete: Handle the deletion of an employee record.
POST /register: Handle user registration.
POST /login: Handle user login.
Security
Password Validation: The password must be at least 8 characters long and contain alphabets, numbers, and special characters.
Session Tracking: The logged-in user's name is stored in localStorage and displayed on the home page.
Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss the changes you would like to make.

License
This project is licensed under the MIT License.
   

# ANDRITZ Employee Management System (EMS)

A full-stack Employee Management System built with the MERN stack (MongoDB, Express, React, Node.js). This application allows administrators to manage employees, departments, and leaves, while providing employees with a dedicated dashboard to view their profile and manage leave requests.

## 🚀 Features

* **Role-based Access Control**: Distinct dashboards and permissions for `admin` and `employee` roles.
* **Employee Management**: Admins can add, update, view, and manage employee records (including profile image uploads).
* **Department Management**: Group employees by their respective departments.
* **Leave Management**: Employees can apply for leaves, and admins can approve, reject, or leave them pending.
* **Secure Authentication**: JWT-based authentication with encrypted passwords (bcrypt).
* **Dashboard Analytics**: Admins can view total employees, departments, salary metrics, and leave status summaries.

## 💻 Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, Axios, React Router Dom
* **Backend**: Node.js, Express.js, JWT, Multer (for file uploads), bcrypt
* **Database**: MongoDB & Mongoose

## 📋 Prerequisites

Make sure you have the following installed on your machine:
* Node.js
* MongoDB (Local server or MongoDB Atlas)

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend server:
   ```bash
   npm start
   # or 'npm run dev' if using nodemon
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🚀 Usage
* The backend server will be running on `http://localhost:5000`.
* The frontend application will be running on the port provided by Vite (typically `http://localhost:5173`).

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
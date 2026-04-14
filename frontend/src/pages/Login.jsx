import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuthContext(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors on a new submission
    try {
      const response = await axios.post(
        "https://employee-management-system-wjrt.vercel.app/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.data;
      if (response.status === 200 && data.success) {
        // On successful login, redirect the user to the dashboard.
        // Storing the token is a standard way to handle sessions.
        login(response.data.user);
        localStorage.setItem("token", data.token);
        if(response.data.user.role === 'admin'){
        navigate("/admin-dashboard");
        }else{
          navigate("/employee-dashboard");
        }
      } else {
        // Handle cases where status is 200 but the backend signals a failure.
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Set error message from backend response
        setError(error.response.data.error);
      } else {
        // Fallback for network errors or other unexpected issues
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-teal-600 from-50% px-4 py-8 sm:px-6 lg:px-8">
      <div className="p-6 sm:p-8 md:p-10 max-w-sm sm:max-w-md w-full bg-white shadow-xl rounded-xl transition-all duration-300">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800 tracking-tight">
          ANDRITZ Employee Management System
        </h2>
         {error && (
            <div className="text-red-500 text-center mb-4 text-xs sm:text-sm font-medium bg-red-50 py-2 rounded-md border border-red-100">{error}</div>
          )}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-xs sm:text-sm font-bold mb-1.5"
            >
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter your Email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="appearance-none border border-gray-300 rounded-md w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition duration-150"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-xs sm:text-sm font-bold mb-1.5"
            >
              Password:
            </label>
            <input
              type="password"
              placeholder="********"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="appearance-none border border-gray-300 rounded-md w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition duration-150"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out rounded" />
              <span className="ml-2 text-xs sm:text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-[10px] sm:text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
              Forgot password?
            </a>
          </div>
         
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 sm:py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 text-sm sm:text-base mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

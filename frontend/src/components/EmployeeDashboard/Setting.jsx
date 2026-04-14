import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import axios from "axios";
import { useEffect } from "react";

const Setting = () => {
  const navigate = useNavigate();
  // Access the current logged-in user from the global AuthContext
  const { user } = useAuthContext();
  // State to manage the password change form fields
  const [setting, setSetting] = useState({
    userId: null, 
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  // State to track and display validation or API errors
  const [error, setError] = useState(null);

  // Update userId in state once the user object is available
  useEffect(() => {
    if (user && user._id) {
      setSetting(prevSetting => ({ ...prevSetting, userId: user._id }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setting.newPassword !== setting.confirmPassword) {
      setError("Passwords do not match");
    } else {
      try {
        const response = await axios.put(
          "https://employee-management-system-wjrt.vercel.app/api/setting/change-password",
          setting,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Password updated successfully"); 
          setError("");
          navigate("/employee-dashboard");
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          setError(error.response.data.error);
        } else {
          setError("An unexpected error occurred");
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-6 sm:px-6 md:py-12 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
          Change Password
        </h2>
        {error && <p className="text-red-500 text-xs sm:text-sm mb-4 text-center font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                placeholder="Enter old password"
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm transition duration-150 ease-in-out"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm transition duration-150 ease-in-out"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm transition duration-150 ease-in-out"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 mt-4 sm:mt-8"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;

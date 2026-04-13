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
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Change Password
      </h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              placeholder="Enter old password"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default Setting;

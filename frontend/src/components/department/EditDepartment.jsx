import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditDepartment = () => {
  // Extract the department ID from the URL parameters
  const { id } = useParams();
  // State to hold the department details being edited
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
  // State to track the loading status of the fetch request
  const [depLoading, setDepLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch the existing department details when the component mounts or ID changes
  useEffect(() => {
    const fetchDepartment = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(
          `https://employee-management-system-wjrt.vercel.app/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          setDepartment(response.data.department);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setDepLoading(false);
      }
    };
    fetchDepartment();
  }, [id]);

  // Update the department state as the user types in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({
      ...department,
      [name]: value,
    });
  };

  // Handle the form submission to update the department via the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://employee-management-system-wjrt.vercel.app/api/department/${id}`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>
      {depLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-base sm:text-lg font-semibold text-gray-600 animate-pulse">Loading...</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-full px-4 py-6 sm:px-6 md:py-12 lg:px-8">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
                Edit Department
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="dep_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department Name
                </label>
                <input
                  type="text"
                  name="dep_name"
                  onChange={handleChange}
                  value={department.dep_name}
                  placeholder="e.g., Human Resources"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm md:text-base transition duration-150 ease-in-out"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="A brief description of the department's role..."
                  onChange={handleChange}
                  value={department.description}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm md:text-base transition duration-150 ease-in-out"
                  rows="3"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                Edit Department
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditDepartment;

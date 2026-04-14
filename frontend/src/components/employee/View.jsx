import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
   
const View = () => {
  // Extract the employee ID from the URL parameters
  const { id } = useParams(); 
  // State to store the fetched employee data
  const [employee, setEmployee] = useState(null);
  // State to store any error messages during data fetching
  const [error, setError] = useState(null);

  // Fetch employee details from the backend when the component mounts or ID changes
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `https://employee-management-system-wjrt.vercel.app/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if(response.data.success) {
          // Update state with the employee object from the response
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          // Capture and display error messages from the server
          setError(error.response.data.error);
        }
      }
    };
    fetchEmployee();
  }, [id]);

  return (
    <div className="bg-slate-50 min-h-full p-4 sm:p-6 lg:p-8">
      {error ? (
        /* Error State UI */
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg text-center">
          <h3 className="text-2xl font-bold text-red-600">An Error Occurred</h3>
          <p className="mt-4 text-lg text-slate-700">{error}</p>
        </div>
      ) : employee ? (
        <div className="max-w-4xl mx-auto my-4 md:my-10 bg-white p-4 md:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-10 text-center">
            Employee Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Profile Image Section */}
            <div className="flex justify-center md:col-span-1">
              <img
                src={employee.userId?.profilePicture}
                className="rounded-full w-32 h-32 md:w-48 md:h-48 object-cover ring-4 ring-teal-500 ring-offset-4 ring-offset-white shadow-lg"
                alt="Profile"
              />
            </div>

            {/* Employee Details List */}
            <div className="col-span-1 md:col-span-2">
              <div className="flow-root">
                <dl className="-my-2 md:-my-4 divide-y divide-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-1 sm:gap-0">
                    <dt className="text-sm md:text-base font-medium text-slate-500">
                      Name
                    </dt>
                    <dd className="text-base font-semibold text-slate-800">
                      {employee.userId.name}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-base font-medium text-slate-500">
                      Employee ID
                    </dt>
                    <dd className="text-base font-semibold text-slate-800">
                      {employee.employeeId}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-base font-medium text-slate-500">
                      Date of Birth
                    </dt>
                    <dd className="text-base font-semibold text-slate-800">
                      {new Date(employee.dob).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-base font-medium text-slate-500">
                      Gender
                    </dt>
                    <dd className="text-base font-semibold text-slate-800">{employee.gender}</dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-base font-medium text-slate-500">
                      Department
                    </dt>
                    <dd className="text-base font-semibold text-slate-800">
                      {employee.department.dep_name}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Loading State UI */
        <div className="flex justify-center items-center h-96">
          <div className="text-xl font-semibold text-gray-500">
            Loading Employee Profile...
          </div>
        </div>
      )}
    </div>
  );
};

export default View;

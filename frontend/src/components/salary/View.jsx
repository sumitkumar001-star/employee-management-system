import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const View = () => {
  // State to store the full list of salary records for the employee
  const [salaries, setSalaries] = useState([]);
  // State to store the salary records after applying search filters
  const [filterSalaries, setFilterSalaries] = useState([]);
  // State to manage the loading spinner/status
  const [salaryLoading, setSalaryLoading] = useState(false);
  // Extract the employee ID from the URL parameters
  const { id } = useParams();
  let sno = 1;

  // Fetch salary records for a specific employee from the backend
  const fetchSalaries = async () => {
    setSalaryLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/salary/employee/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        setSalaries(response.data.salaries);
        setFilterSalaries(response.data.salaries);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setSalaryLoading(false);
    }
  };

  // Fetch salaries on component mount
  useEffect(() => {
    fetchSalaries();
  }, []);

  // Filter the salary list based on search input (Emp ID, Pay Date, or Basic Salary)
  const filterSalary = (q) => {
    const filteredRecords = salaries.filter((salary) => {
      return (
        String(salary.employeeId?.employeeId).toLowerCase().includes(q.toLowerCase()) ||
        String(salary.payDate).toLowerCase().includes(q.toLowerCase()) ||
        String(salary.basicSalary).toLowerCase().includes(q.toLowerCase())
      );
    });
    setFilterSalaries(filteredRecords);
  };

  return (
    <div className="bg-slate-50 min-h-full p-4 sm:p-6 lg:p-8">
      {salaryLoading ? (
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-xl font-semibold text-slate-500 tracking-wide">
            Loading Salary Records...
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-100">
          <div className="mb-8 text-center sm:text-left">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Salary History
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Detailed overview of your past and current salary payments.
            </p>
          </div>
          <div className="flex justify-end mb-6">
            <input
              type="text"
              placeholder="Search By Emp ID"
              className="w-full sm:w-72 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-300"
              onChange={(e) => filterSalary(e.target.value)}
            />
          </div>
          {filterSalaries.length > 0 ? (
            <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold text-slate-800">SNo</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-slate-800">Employee ID</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-slate-800">Basic Salary</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-slate-800">Allowances</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-slate-800">Deductions</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-slate-800">Net Salary</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-slate-800">Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filterSalaries.map((salary) => (
                    <tr
                      key={salary._id}
                      className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {sno++}
                      </td>
                      <td className="px-6 py-4">
                        {salary.employeeId?.employeeId}
                      </td>
                      <td className="px-6 py-4">
                        ${Number(salary.basicSalary).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        ${Number(salary.allowances).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        ${Number(salary.deductions).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        ${Number(salary.netSalary).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(salary.payDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 text-lg text-slate-600">
              No salary records found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default View;

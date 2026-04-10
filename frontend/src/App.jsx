import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBasedRoutes from "./utils/RoleBasedRoutes";
import EmployeeSummary from "./components/EmployeeDashboard/EmployeeSummary";
import LeaveList from "./components/leave/List";
import Unauthorized from "./pages/Unauthorized";
import AddLeave from "./components/leave/Add";
import Setting from "./components/EmployeeDashboard/Setting";
import Table from "./components/leave/Table";
import Details from "./components/leave/Details";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route
            path="/admin-dashboard/departments"
            element={<DepartmentList />}
          />
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          />
          <Route
            path="/admin-dashboard/department/:id"
            element={<EditDepartment />}
          />
          <Route path="/admin-dashboard/employees" element={<List />} />
          <Route path="/admin-dashboard/add-employee" element={<Add />} />
          <Route
            path="/admin-dashboard/employees/view/:id"
            element={<View />}
          />
          <Route
            path="/admin-dashboard/employees/edit/:id"
            element={<Edit />}
          />
          <Route path="/admin-dashboard/salary/add" element={<AddSalary />} />
          <Route
            path="/admin-dashboard/employees/salary/:id"
            element={<ViewSalary />}
          />
          <Route path="/admin-dashboard/leaves" element={<Table />} />
          <Route path="/admin-dashboard/leaves/:id" element={<Details />} />
          <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList />} />
          <Route path="/admin-dashboard/settings" element={<Setting />} />
        </Route>

        <Route path="/employee-dashboard" element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["admin","employee"]}>
                <EmployeeDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          } >
            <Route index element={<EmployeeSummary />} />
            <Route path="/employee-dashboard/profile/:id" element={<View />} />
            <Route path="/employee-dashboard/leaves" element={<LeaveList />} />
            <Route path="/employee-dashboard/add-leave" element={<AddLeave />} />
            <Route path="/employee-dashboard/salary/:id" element={<ViewSalary />} />
            <Route path="/employee-dashboard/settings" element={<Setting />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login.jsx";
import Layout from "./Components/Layout/Dashboard.jsx";
import StudentLayout from "./Components/Layout/studentDashboard.jsx";
import Dashboard from "./Components/Pages/Dashboard.jsx";
import Categories from "./Components/Pages/Admin/Categories.jsx";
import Authors from "./Components/Pages/Admin/Author.jsx";
import Books from "./Components/Pages/Admin/Books.jsx";
import SignUp from "./Signup.jsx";
import ProtectedRoute from "./Components/Auth/ProtectedRoute.jsx";
import Unauthorized from "./Components/Pages/Unathorized.jsx";
import AutoRedirect from "./Components/Auth/AutoRedirect.jsx";
import BookLoans from "./Components/Pages/Admin/BookLoans.jsx";
import Attendance from "./Components/Pages/Attendance/Attendance.jsx";
import AttendanceList from "./Components/Pages/Admin/AttendancePage.jsx"
import Students from "./Components/Pages/Admin/Students.jsx";
import IssuedBooks from "./Components/Pages/Student/IssuedBooks.jsx";
import Account from "./Components/Pages/Student/StudentAccount.jsx";
import { AuthProvider } from "./Components/Auth/AuthContext.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider ,Navigate} from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const queryClient = new QueryClient();
const router = createBrowserRouter([
{
  path: "/",
    element: <AutoRedirect />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        element: <SignUp />,
        path: "signup",
      },
      ,
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "categories",
            element: <Categories />,
          },
          {
            path: "authors",
            element: <Authors />,
          },
          {
            path: "books",
            element: <Books />,
          },
          {
            path: "bookloans",
            element: <BookLoans />,
          },
        {
          path: "attendance",
          element: <AttendanceList/>
        },
        {
          path: "students",
          element: <Students/>
        },
        {
          path: "account",
          element: <Account />,
        },
        ],
      },
      {
        path: "/student",
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Categories />,
          },
          {
            path: "issued-books",
            element: <IssuedBooks />,
          },
          {
            path: "account",
            element: <Account />,
          },
        ],
      },
      
      {
        element: <Unauthorized />,
        path: "/unauthorized",
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },

    ]
},
{
  element: <Attendance />,
  path: "/attendance",
}

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>

        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
    </LocalizationProvider>
  </React.StrictMode>
);


import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login.jsx";
import Layout from "./Components/Layout/Dashboard.jsx";
import StudentLayout from "./Components/Layout/studentDashboard.jsx";
import StudentDashboard  from "./Components/Pages/Student/Dashboard.jsx";
import AdminDashboard from "./Components/Pages/Admin/Dashboard.jsx";
import Categories from "./Components/Pages/Admin/Categories.jsx";
import Authors from "./Components/Pages/Admin/Author.jsx";
import Books from "./Components/Pages/Admin/Books.jsx";
import StudentBooks from "./Components/Pages/Student/Books.jsx";
import Subjects from "./Components/Pages/Admin/Subject.jsx";
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
import FeaturePostForm from "./Components/Pages/Admin/FeaturePostForm.jsx";
import { AuthProvider } from "./Components/Auth/AuthContext.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider ,Navigate} from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // disable automatic refetching on window focus
      retry: 1, // retry failed queries once by default
    },
  },
});

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
            element: <AdminDashboard />,
          },
          {
            path: "categories",
            element: <Categories />,
          },
          {
            path: "subjects",
            element: <Subjects/>,
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
        {
          path: "post",
          element: <FeaturePostForm />,
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
            element: <StudentDashboard />,
          },
          {
            path: "books",
            element: <StudentBooks />,
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
  <QueryClientProvider client={queryClient}>
  <React.StrictMode>
     <LocalizationProvider dateAdapter={AdapterDayjs}>

    <AuthProvider>


        <RouterProvider router={router} />

    </AuthProvider>

    </LocalizationProvider>
  </React.StrictMode>
  </QueryClientProvider>
);


import React from 'react'
import ReactDOM from 'react-dom/client'
import Login  from './Login.jsx'
import Layout from './Components/Layout/Dashboard.jsx'
import Dashboard from './Components/Pages/Dashboard.jsx'
import Categories from './Components/Pages/Categories.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    element: <Login/>,
    path: '/',
  },
  ,{
    element: <Layout/>,
    children: [
      {
        path : '/dashboard',
        element : <Dashboard/>
      },
      {
        path : '/categories',
        element : <Categories/>
      }
    ]

  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>


<QueryClientProvider client={queryClient}>

  <RouterProvider router={router}/>
  
      </QueryClientProvider>


  </React.StrictMode>,
)

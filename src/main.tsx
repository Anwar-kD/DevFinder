import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Welcome from './components/Welcome';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';
import { AuthProvider } from './context/AuthContext'; 
import { Dashboard } from './components/Dashboard';
import PrivateRoute  from './components/PrivateRoute';
import { Offers } from './components/Offers';
import { JobApplication } from './components/Application';
import { CVOptimizer } from './components/CVOptimizer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
  },
  {
    path: '/offers',
    element: <Offers />,
  },
  {
    path: '/sign-up',
    element: <SignUp />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/dashboard',
    element: (<PrivateRoute><Dashboard /></PrivateRoute>), 
  },
  {
    path: '/application/:offerId',
    element: <JobApplication />, 
  },
    {
    path: '/cvoptimizer',
    element: <CVOptimizer />, 
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
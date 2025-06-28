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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
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
  }
  // {
  //   path: '/profiles',
  //   element: < />,
  //   children: [
  //     {
  //       path: '/profiles/:profileId',
  //       element: < />,
  //     },
  //   ],
  // },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
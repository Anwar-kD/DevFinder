import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Welcome from './components/Welcome';
import { SignUp } from './components/SignUp';
import { Login } from './components/Login';

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
    <RouterProvider router={router} />
  </React.StrictMode>,
);
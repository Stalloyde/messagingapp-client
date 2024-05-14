import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Requests from './components/Requests';
import TargetRequest from './components/TargetRequest';
import TargetMessages from './components/TargetMessages';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '*',
      element: <Navigate to='/' />,
    },
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/requests',
      element: <Requests />,
    },
    {
      path: '/requests/:id',
      element: <TargetRequest />,
    },
    {
      path: '/messages/:id',
      element: <TargetMessages />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default App;

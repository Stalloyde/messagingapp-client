import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './App.css';
import Login from './components/Login';
import { useState } from 'react';
import Signup from './components/Signup';
import Requests from './components/Requests';
import TargetRequest from './components/TargetRequest';
import TargetMessages from './components/TargetMessages';
import Cookies from 'js-cookie';

const App = () => {
  const jwtToken: string | undefined = Cookies.get('token');
  const [token, setToken] = useState(jwtToken);

  const router = createBrowserRouter([
    {
      path: '*',
      element: <Navigate to='/' />,
    },
    {
      path: '/',
      element: <Layout token={token} />,
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
      element: <TargetMessages token={token} />,
    },
    {
      path: '/login',
      element: <Login setToken={setToken} />,
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

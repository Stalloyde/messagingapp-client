import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './App.css';
import Login from './components/Login/Login';
import { useState } from 'react';
import Signup from './components/Signup/Signup';
import Requests from './components/Requests/Requests';
import Group from './components/Group/Group';
import Profile from './components/Profile/Profile';
import Index from './components/Index/Index';
import TargetMessages from './components/TargetMessages/TargetMessages';
import Cookies from 'js-cookie';

const App = () => {
  const jwtToken: string | undefined = Cookies.get('token');
  const [token, setToken] = useState(jwtToken);
  const [currentUser, setCurrentUser] = useState();
  const [contacts, setContacts] = useState([]);
  const [contactsRequests, setContactsRequests] = useState([]);

  const router = createBrowserRouter([
    {
      path: '*',
      element: <Navigate to='/' />,
    },
    {
      path: '/',
      element: (
        <Layout
          token={token}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          contacts={contacts}
          contactsRequests={contactsRequests}
        />
      ),
      children: [
        { index: true, element: <Index /> },

        {
          path: '/requests',
          element: (
            <Requests
              token={token}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              contacts={contacts}
              setContacts={setContacts}
              contactsRequests={contactsRequests}
              setContactsRequests={setContactsRequests}
            />
          ),
        },
        {
          path: '/profile',
          element: <Profile token={token} currentUser={currentUser} />,
        },
        {
          path: '/messages/:id',
          element: (
            <TargetMessages
              token={token}
              currentUser={currentUser}
              setContacts={setContacts}
            />
          ),
        },
        {
          path: '/group',
          element: (
            <Group
              token={token}
              contacts={contacts}
              setContacts={setContacts}
            />
          ),
        },
      ],
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

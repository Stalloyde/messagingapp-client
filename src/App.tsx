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

type messageType = {
  content: string;
  from: userType | string;
  to: userType | string;
};

type groupType = {
  _id: string;
  groupName: string;
  profilePic?: string;
  messages: messageType[];
};

type userType = {
  username: string;
  status: string;
  contacts: userType[];
  profilePic: string;
  messages: messageType[];
  contactsRequests: userType[];
  groups: groupType[];
};

const App = () => {
  const jwtToken: string | undefined = Cookies.get('token');
  const [token, setToken] = useState(jwtToken);
  const [currentUser, setCurrentUser] = useState<userType>();
  const [contacts, setContacts] = useState<userType[]>([]);
  const [contactsRequests, setContactsRequests] = useState<userType[]>([]);

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
          element: (
            <Profile
              token={token}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          ),
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

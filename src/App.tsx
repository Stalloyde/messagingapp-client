import React, { useState, createContext } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './App.css';
import Login from './components/Login/Login';
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
  profilePic: { url: string } | null;
  messages: messageType[];
};

type userType = {
  _id?: string;
  username: string;
  status: string;
  contacts: userType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests: userType[];
  groups: groupType[];
};

export type ContextType = {
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  currentUser?: userType;
  setCurrentUser: React.Dispatch<React.SetStateAction<userType | undefined>>;
  contacts: userType[];
  setContacts: React.Dispatch<React.SetStateAction<userType[]>>;
  contactsRequests: userType[];
  setContactsRequests: React.Dispatch<React.SetStateAction<userType[]>>;
};

export const Context = createContext<ContextType | null>(null);

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
      element: <Layout />,
      children: [
        { index: true, element: <Index /> },

        {
          path: '/requests',
          element: <Requests />,
        },
        {
          path: '/profile',
          element: <Profile />,
        },
        {
          path: '/messages/:id',
          element: <TargetMessages />,
        },
        {
          path: '/group',
          element: <Group />,
        },
      ],
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
    <Context.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        contacts,
        setContacts,
        contactsRequests,
        setContactsRequests,
      }}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </Context.Provider>
  );
};

export default App;

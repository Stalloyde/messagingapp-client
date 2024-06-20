import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestsList from './RequestsList/RequestsList';
import SearchResultList from './SearchResultList/SearchResultList';
import ContactList from './ContactsList/ContactsList';
import styles from './Requests.module.css';

type HeadersType = {
  'Content-Type': string;
  Authorization?: string;
};

type messageType = {
  content: string;
  from: userPropType | string;
  to: userPropType | string;
};

type groupType = {
  _id: string;
  groupName: string;
  profilePic: { url: string };
  messages: messageType[];
};

type responseType = {
  length?: number;
  usernameError?: string;
  error?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type userPropType = {
  _id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type RequestsPropsType = {
  token?: string;
  currentUser?: userPropType;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<userPropType | undefined>
  >;
  contacts: userPropType[];
  setContacts: React.Dispatch<React.SetStateAction<userPropType[]>>;
  contactsRequests: userPropType[];
  setContactsRequests: React.Dispatch<React.SetStateAction<userPropType[]>>;
};

function Requests({
  token,
  currentUser,
  setCurrentUser,
  contacts,
  setContacts,
  contactsRequests,
  setContactsRequests,
}: RequestsPropsType) {
  const [username, setUsername] = useState('');
  const [searchResult, setSearchResult] = useState<userPropType[]>([]);
  const [searchResultError, setSearchResultError] = useState<string | null>('');
  const navigate = useNavigate();

  function preventSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') e.preventDefault();
  }

  useEffect(() => {
    async function getRequests() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch(`http://localhost:3000/requests`, {
          headers,
        });

        if (response.statusText === 'Unauthorized') navigate('/login');
        const responseData = (await response.json()) as responseType;

        if (responseData.error) navigate('/login');
        setContactsRequests(responseData.contactsRequests);
        setCurrentUser(responseData);
        setContacts(responseData.contacts);
      } catch (err: unknown) {
        console.log(err.message);
      }
    }
    void getRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    async function searchUsername() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;

        const response = await fetch('http://localhost:3000/requests', {
          headers,
          method: 'POST',
          body: JSON.stringify({ username }),
        });

        if (response.statusText === 'Unauthorized') navigate('/login');
        const responseData = (await response.json()) as responseType;

        if (Array.isArray(responseData)) {
          setSearchResult(responseData);
          setSearchResultError(null);
        } else if (responseData.usernameError) {
          setSearchResult([]);
          setSearchResultError(responseData.usernameError);
        } else {
          setSearchResult([]);
          setSearchResultError(null);
        }
      } catch (err: unknown) {
        console.log(err.message);
      }
    }
    void searchUsername();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <>
      <div className={styles.rightHeader}>
        <strong>Contacts Management</strong>
      </div>
      <div className={styles.container}>
        <form action='post'>
          <input
            type='text'
            placeholder='Search username'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onKeyDown={(e) => {
              preventSubmit(e);
            }}
          />
        </form>

        <div className={styles.resultsContainer}>
          <ContactList
            contacts={contacts}
            setContacts={setContacts}
            contactsRequests={contactsRequests}
            token={token}
          />
          <RequestsList
            contactsRequests={contactsRequests}
            setContactsRequests={setContactsRequests}
            searchResult={searchResult}
            username={username}
            token={token}
          />
          <SearchResultList
            username={username}
            setUsername={setUsername}
            searchResult={searchResult}
            searchResultError={searchResultError}
            currentUser={currentUser}
            token={token}
          />
        </div>
      </div>
    </>
  );
}

export default Requests;

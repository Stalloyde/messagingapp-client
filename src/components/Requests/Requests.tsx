import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestsList from './RequestsList/RequestsList';
import SearchResultList from './SearchResultList/SearchResultList';
import ContactList from './ContactsList/ContactsList';
import styles from './Requests.module.css';
import { GetContext } from '../../utils/GetContext';
import {
  HeadersType,
  messageType,
  groupType,
  userType,
} from '../../utils/TypesDeclaration';

type responseType = {
  length?: number;
  usernameError?: string;
  error?: string;
  username: string;
  status: string;
  contacts: userType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests: userType[];
  groups: groupType[];
};

function Requests() {
  const [username, setUsername] = useState('');
  const [searchResult, setSearchResult] = useState<userType[]>([]);
  const [searchResultError, setSearchResultError] = useState<string | null>('');
  const navigate = useNavigate();

  const { token, setCurrentUser, setContacts, setContactsRequests } =
    GetContext();

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

        if (response.status === 401) navigate('/login');
        if (!response.ok)
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`,
          );

        const responseData = (await response.json()) as responseType;

        if (responseData.error) navigate('/login');
        setContactsRequests(responseData.contactsRequests);
        setCurrentUser(responseData);
        setContacts(responseData.contacts);
      } catch (err) {
        console.error(err);
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

        if (response.status === 401) navigate('/login');
        if (!response.ok)
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`,
          );
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
      } catch (err) {
        console.error(err);
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
          <ContactList />
          <RequestsList searchResult={searchResult} username={username} />
          <SearchResultList
            username={username}
            setUsername={setUsername}
            searchResult={searchResult}
            searchResultError={searchResultError}
          />
        </div>
      </div>
    </>
  );
}

export default Requests;

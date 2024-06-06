import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestsList from './RequestsList/RequestsList';
import SearchResultList from './SearchResultList/SearchResultList';
import ContactList from './ContactsList/ContactsList';
import styles from './Requests.module.css';

function Requests({
  token,
  currentUser,
  setCurrentUser,
  contacts,
  setContacts,
  contactsRequests,
  setContactsRequests,
}) {
  const [username, setUsername] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();

  function preventSubmit(e) {
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
        const responseData = await response.json();

        if (responseData.error) navigate('/login');
        setContactsRequests(responseData.contactsRequests);
        setCurrentUser(responseData);
        setContacts(responseData.contacts);
      } catch (err) {
        console.log(err.message);
      }
    }
    getRequests();
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
        const responseData = await response.json();

        if (responseData.length > 0 || responseData.usernameError) {
          setSearchResult(responseData);
        } else {
          setSearchResult([]);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    searchUsername();
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
            currentUser={currentUser}
            token={token}
          />
        </div>
      </div>
    </>
  );
}

export default Requests;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import RequestsList from './RequestsList/RequestsList';
import SearchResultList from './SearchResultList/SearchResultList';
import ContactList from './ContactsList/ContactsList';
import styles from './Requests.module.css';
import '../../index.css';

function Requests({ token }) {
  const [currentUser, setCurrentUser] = useState();
  const [contacts, setContacts] = useState([]);
  const [contactsRequests, setContactsRequests] = useState([]);
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
    <Layout token={token}>
      <div className='rightHeader'>
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
          <ContactList contacts={contacts} token={token} />
          <RequestsList
            contactsRequests={contactsRequests}
            searchResult={searchResult}
            username={username}
            token={token}
          />
          <SearchResultList
            token={token}
            username={username}
            searchResult={searchResult}
            currentUser={currentUser}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Requests;

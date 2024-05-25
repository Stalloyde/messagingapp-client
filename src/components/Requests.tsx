import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import styles from './Requests.module.css';

function Requests({ token }) {
  const [currentUser, setCurrentUser] = useState();
  const [contactsRequests, setContactsRequests] = useState([]);
  const [username, setUsername] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();

  function preventSubmit(e) {
    if (e.key === 'Enter') e.preventDefault();
  }

  async function sendRequest(id) {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;

      const response = await fetch(`http://localhost:3000/requests/${id}`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ username }),
      });

      if (response.statusText === 'Unauthorized') navigate('/login');
      const responseData = await response.json();
    } catch (err) {
      console.log(err.message);
    }
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
        setSearchResult(responseData);
      } catch (err) {
        console.log(err.message);
      }
    }
    searchUsername();
  }, [username]);

  return (
    <Layout token={token}>
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
      {searchResult.usernameError && username && <>Username not found</>}

      {(searchResult.length === 0 && !username) ||
        (contactsRequests.length < 1 && !username && <>No requests found</>)}

      {(searchResult.length === 0 && !username) ||
        (contactsRequests.length > 1 && !username && (
          //extract to separate component
          <>
            <div>{contactsRequests}</div>
            <button>Accept</button>
            <button>Decline</button>
          </>
        ))}

      {searchResult.length > 0 && (
        //extract to separate component along with sendRequest()
        <ul>
          {searchResult.map((result, index) => (
            <li key={index} className={styles.searchResult}>
              <div>{result.username}</div>
              //change button rendering to 'already a contact' if already a
              contact //change button rendering to 'null' if self{' '}
              <button
                id={result._id}
                onClick={(e) => {
                  sendRequest(e.target.id);
                }}>
                Request contact
              </button>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}

export default Requests;

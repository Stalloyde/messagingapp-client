import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import RequestsList from './RequestsList';
import SearchResultList from './SearchResultList';

function Requests({ token }) {
  const [currentUser, setCurrentUser] = useState();
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
        (contactsRequests.length > 0 && !username && (
          <RequestsList contactsRequests={contactsRequests} />
        ))}

      <SearchResultList
        token={token}
        username={username}
        searchResult={searchResult}
        currentUser={currentUser}
      />
    </Layout>
  );
}

export default Requests;

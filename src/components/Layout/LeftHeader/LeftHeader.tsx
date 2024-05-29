import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LeftHeader.module.css';
import addUserIcon from '../../../assets/icons8-add-user-24.png';

function LeftHeader({ token, setCurrentUser, contactsRequests }) {
  const [requestsCount, setRequestCount] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch('http://localhost:3000', { headers });

        if (response.statusText === 'Unauthorized') navigate('/login');

        const responseData = await response.json();
        if (responseData.error) navigate('/login');
        setCurrentUser(responseData);

        const { contactsRequests } = responseData;
        setRequestCount(contactsRequests.length);
      } catch (err) {
        console.log(err.message);
      }
    }
    getCurrentUser();
  }, [contactsRequests]);

  return (
    <div className={styles.container}>
      <div>profile pic here</div>

      <div className={styles.icon}>
        {requestsCount > 0 && <p>{requestsCount}</p>}
        <Link to='/requests'>
          <img src={addUserIcon} alt='add-user' />
        </Link>
      </div>
    </div>
  );
}

export default LeftHeader;

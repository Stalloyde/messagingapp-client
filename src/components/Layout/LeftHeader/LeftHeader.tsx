import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LeftHeader.module.css';
import addUserIcon from '../../../assets/icons8-add-user-24.png';
import groupIcon from '../../../assets/icons8-group-24.png';

function LeftHeader({ token, setCurrentUser, contactsRequests }) {
  const [requestsCount, setRequestCount] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    async function getCurrentUserRequests() {
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
    getCurrentUserRequests();
  }, [contactsRequests]);

  return (
    <div className={styles.container}>
      <Link to='/profile'>
        <div> Profile Pic here </div>
      </Link>
      <div className={styles.icon}>
        <Link to='/group'>
          <img src={groupIcon} alt='group' />
        </Link>
      </div>
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

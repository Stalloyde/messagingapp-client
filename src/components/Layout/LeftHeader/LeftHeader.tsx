import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LeftHeader.module.css';
import addUserIcon from '../../../assets/icons8-add-user-24.png';
import groupIcon from '../../../assets/icons8-group-24.png';
import defaultAvatar from '../../../assets/icons8-avatar-50.png';
import { GetContext } from '../../../utils/GetContext';
import {
  HeadersType,
  messageType,
  groupType,
  userType,
} from '../../../utils/TypesDeclaration';

type responseType = {
  error?: string;
  username: string;
  status: string;
  contacts: userType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests: userType[];
  groups: groupType[];
};

function LeftHeader() {
  const [requestsCount, setRequestCount] = useState<number>();
  const navigate = useNavigate();

  const { token, currentUser, setCurrentUser, contactsRequests, contacts } =
    GetContext();

  useEffect(() => {
    async function getCurrentUserRequests() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch('https://messagingapp.fly.dev', {
          headers,
          mode: 'cors',
        });

        if (response.status === 401) navigate('/login');
        if (!response.ok)
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`,
          );

        const responseData = (await response.json()) as responseType;
        if (responseData.error) navigate('/login');
        setCurrentUser(responseData);

        const { contactsRequests } = responseData;
        setRequestCount(contactsRequests.length);
      } catch (err) {
        console.error(err);
      }
    }
    void getCurrentUserRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactsRequests, contacts]);

  return (
    <div className={styles.container}>
      {currentUser && (
        <>
          <Link to='/profile' className={styles.userContainer}>
            {currentUser.profilePic ? (
              <img src={currentUser.profilePic.url} alt='profile-pic' />
            ) : (
              <img
                src={defaultAvatar}
                alt='profile-pic'
                className={styles.icons}
              />
            )}
            <h2>{currentUser.username}</h2>
          </Link>
          <div className={styles.icon}>
            <Link to='/group'>
              <img src={groupIcon} alt='group' />
            </Link>
          </div>
          <div className={styles.icon}>
            {requestsCount && requestsCount > 0 ? <p>{requestsCount}</p> : null}
            <Link to='/requests'>
              <img src={addUserIcon} alt='add-user' />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default LeftHeader;

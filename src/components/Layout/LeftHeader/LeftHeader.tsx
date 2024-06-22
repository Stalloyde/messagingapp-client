import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LeftHeader.module.css';
import addUserIcon from '../../../assets/icons8-add-user-24.png';
import groupIcon from '../../../assets/icons8-group-24.png';
import defaultAvatar from '../../../assets/icons8-avatar-50.png';

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
  id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type LeftHeaderPropsType = {
  token?: string;
  currentUser?: userPropType;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<userPropType | undefined>
  >;
  contactsRequests: object[];
};

function LeftHeader({
  token,
  currentUser,
  setCurrentUser,
  contactsRequests,
}: LeftHeaderPropsType) {
  const [requestsCount, setRequestCount] = useState<number>();
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

        const responseData = (await response.json()) as responseType;
        if (responseData.error) navigate('/login');
        setCurrentUser(responseData);

        const { contactsRequests } = responseData;
        setRequestCount(contactsRequests.length);
      } catch (err: unknown) {
        console.log(err.message);
      }
    }
    void getCurrentUserRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactsRequests]);

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

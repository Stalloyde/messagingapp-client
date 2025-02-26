import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './PreviewMessages.module.css';
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
  profilePic: string | null;
  messages: messageType[];
  contactsRequestsFrom: userType[];
  contactsRequestsTo: userType[];
  groups: groupType[];
};

function Messages() {
  const navigate = useNavigate();

  const { url, token, currentUser, setCurrentUser, targetUser, targetGroup } =
    GetContext();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch(url, {
          headers,
        });

        if (response.status === 401) navigate('/login');
        if (!response.ok)
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`,
          );
        const responseData = (await response.json()) as responseType;
        if (responseData.error) navigate('/login');
        setCurrentUser(responseData);
      } catch (err) {
        console.error(err);
      }
    }
    void getCurrentUser();
  }, [targetUser, targetGroup]);

  return (
    <div className={styles.container}>
      <ul>
        {currentUser &&
          currentUser.contacts.map((item, index) => (
            <Link key={index} to={`/messages/${item.id}`}>
              <li id={item.id ? item.id.toString() : index.toString()}>
                {item.profilePic ? (
                  <img src={item.profilePic} alt='profile-pic' />
                ) : (
                  <img
                    src={defaultAvatar}
                    alt='profile-pic'
                    className={styles.icons}
                  />
                )}
                <div className={styles.previewMessageContainer}>
                  {item.username && <strong>{item.username}</strong>}

                  <p className={styles.previewMessage}>
                    {item.messages.length > 0 ? (
                      item.messages[0].content
                    ) : (
                      <em>Click to chat</em>
                    )}
                  </p>
                </div>
              </li>
            </Link>
          ))}

        {currentUser &&
          currentUser.groups.map((group, index) => (
            <Link key={index} to={`/messages/${group.id}`}>
              <li id={group.id ? group.id.toString() : index.toString()}>
                {group.profilePic && group.profilePic ? (
                  <img src={group.profilePic} alt='profile-pic' />
                ) : (
                  <img
                    src={defaultAvatar}
                    alt='profile-pic'
                    className={styles.icons}
                  />
                )}
                <div className={styles.previewMessageContainer}>
                  {<strong>{group.groupName}</strong>}
                  <img src={groupIcon} alt='group' />

                  <p className={styles.previewMessage}>
                    {group.messages.length > 0 ? (
                      group.messages[0].content
                    ) : (
                      <em>Click to chat</em>
                    )}
                  </p>
                </div>
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
}

export default Messages;

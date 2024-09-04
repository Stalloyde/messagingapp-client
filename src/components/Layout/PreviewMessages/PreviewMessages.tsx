import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './PreviewMessages.module.css';
import groupIcon from '../../../assets/icons8-group-24.png';
import defaultAvatar from '../../../assets/icons8-avatar-50.png';
import { GetContext } from '../../../utils/GetContext';
import {
  HeadersType,
  userType,
  groupType,
  messageType,
} from '../../../utils/TypesDeclaration';

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

function Messages() {
  const [toRenderContacts, setToRenderContacts] = useState<userType[]>([]);
  const [toRenderGroups, setToRenderGroups] = useState<groupType[]>([]);
  const navigate = useNavigate();

  const { token, contactsRequestsFrom, contacts } = GetContext();

  useEffect(() => {
    async function getContactsToRender() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch(
          'https://stalloyde-messagingapp.adaptable.app',
          {
            headers,
            credentials: 'include',
            mode: 'cors',
          },
        );

        if (response.status === 401) navigate('/login');
        if (!response.ok)
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`,
          );

        const responseData = (await response.json()) as responseType;
        const contacts = responseData.contacts;
        const groups = responseData.groups;
        if (responseData.error) navigate('/login');
        setToRenderContacts([...contacts]);
        setToRenderGroups([...groups]);
      } catch (err) {
        console.error(err);
      }
    }
    void getContactsToRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, contactsRequestsFrom]);

  return (
    <div className={styles.container}>
      <ul>
        {toRenderContacts.map((item, index) => (
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

        {toRenderGroups.map((group, index) => (
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

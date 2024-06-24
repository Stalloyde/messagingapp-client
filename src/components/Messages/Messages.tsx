import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Messages.module.css';
import groupIcon from '../../assets/icons8-group-24.png';
import defaultAvatar from '../../assets/icons8-avatar-50.png';

type HeadersType = {
  'Content-Type': string;
  Authorization?: string;
};

type responseType = {
  length?: number;
  usernameError?: string;
  error?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type userPropType = {
  _id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type groupType = {
  _id?: string;
  groupName: string;
  profilePic: { url: string } | null;
  messages: messageType[];
};

type messageType = {
  content: string;
  from: userPropType | string;
  to: userPropType | string;
};

type MessagesPropsType = {
  token?: string;
  contacts: userPropType[];
  contactsRequests: userPropType[];
};

function Messages({ token, contacts, contactsRequests }: MessagesPropsType) {
  const [toRenderContacts, setToRenderContacts] = useState<userPropType[]>([]);
  const [toRenderGroups, setToRenderGroups] = useState<groupType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getContactsToRender() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch('https://messagingapp.fly.dev', {
          headers,
        });

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
  }, [contacts, contactsRequests]);

  return (
    <div className={styles.container}>
      <ul>
        {toRenderContacts.map((item, index) => (
          <Link key={index} to={`/messages/${item._id ?? ''}`}>
            <li id={item._id}>
              {item.profilePic ? (
                <img src={item.profilePic.url} alt='profile-pic' />
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
          <Link key={index} to={`/messages/${group._id ?? ''}`}>
            <li id={group._id}>
              {group.profilePic && group.profilePic.url ? (
                <img src={group.profilePic.url} alt='profile-pic' />
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

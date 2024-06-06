import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Messages.module.css';
import groupIcon from '../../assets/icons8-group-24.png';

//work on rerendering on deleteContact,approve contact
function Messages({ token, contacts, contactsRequests }) {
  const [toRender, setToRender] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getContactsToRender() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch('http://localhost:3000', { headers });

        if (response.statusText === 'Unauthorized') navigate('/login');

        const responseData = await response.json();
        if (responseData.error) navigate('/login');
        setToRender([...responseData.contacts, ...responseData.groups]);
      } catch (err) {
        console.log(err.message);
      }
    }
    getContactsToRender();
  }, [contacts, contactsRequests]);

  return (
    <div className={styles.container}>
      <ul>
        {toRender.length > 0 &&
          toRender.map((item, index) => (
            <Link key={index} to={`/messages/${item._id}`}>
              <li id={item._id}>
                <div>Pic here</div>
                <div className={styles.previewMessageContainer}>
                  {item.username && <strong>{item.username}</strong>}
                  {item.groupName && (
                    <>
                      <strong>{item.groupName}</strong>
                      <img src={groupIcon} alt='group' />
                    </>
                  )}
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
      </ul>
    </div>
  );
}

export default Messages;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Messages.module.css';

function Messages({ token }) {
  const [currentUser, setCurrentUser] = useState({});
  const [contacts, setContacts] = useState([]);
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
        setContacts(responseData.contacts);
      } catch (err) {
        console.log(err.message);
      }
    }
    getCurrentUser();
  }, [token]);

  return (
    <div className={styles.container}>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>
            <div>Pic here</div>
            <div className={styles.previewMessageContainer}>
              <strong>{contact.username}</strong>
              <p className={styles.previewMessage}>
                {contact.messages[0].content}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Messages;

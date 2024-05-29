import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Messages.module.css';

//work on rerendering on deleteContact,approve contact
function Messages({ token, contacts, contactsRequests }) {
  const [contactsToRender, setContactsToRender] = useState([]);

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
        setContactsToRender(responseData.contacts);
      } catch (err) {
        console.log(err.message);
      }
    }
    getContactsToRender();
  }, [contacts, contactsRequests]);

  return (
    <div className={styles.container}>
      <ul>
        {contactsToRender.length > 0 &&
          contactsToRender.map((contact, index) => (
            <Link key={index} to={`/messages/${contact._id}`}>
              <li id={contact._id}>
                <div>Pic here</div>
                <div className={styles.previewMessageContainer}>
                  <strong>{contact.username}</strong>
                  <p className={styles.previewMessage}>
                    {contact.messages.length > 0 ? (
                      contact.messages[0].content
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

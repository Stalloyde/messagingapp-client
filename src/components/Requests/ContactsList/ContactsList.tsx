import { useState, useEffect } from 'react';
import deleteContactIcon from '../../../assets/icons8-delete-50.png';
import styles from './ContactsList.module.css';
import DeleteContactModal from './DeleteContactModal/DeleteContactModal';

function ContactsList({ contacts, setContacts, contactsRequests, token }) {
  const [isDeletingContact, setIsDeletingContact] = useState(false);
  const [toDeleteId, setToDeleteId] = useState('');

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
        setContacts(responseData.contacts);
      } catch (err) {
        console.log(err.message);
      }
    }
    getContactsToRender();
  }, [contactsRequests]);

  function handleClick(id) {
    setIsDeletingContact(true);
    setToDeleteId(id);
  }

  return (
    <>
      {isDeletingContact && (
        <DeleteContactModal
          setIsDeletingContact={setIsDeletingContact}
          setContacts={setContacts}
          token={token}
          toDeleteId={toDeleteId}
          setToDeleteId={setToDeleteId}
        />
      )}

      {contacts.length > 0 && (
        <div className={styles.contactListContainer}>
          <h2>Contacts List</h2>
          {contacts.map((contact, index) => (
            <div key={index} className={styles.contactList}>
              <div>
                <p>{contact.username}</p>
                <p className={styles.status}>{contact.status}</p>
              </div>
              <div className={styles.buttonContainer}>
                <button
                  id={contact._id}
                  onClick={(e) => {
                    handleClick(e.target.id);
                  }}>
                  <img
                    className={styles.icon}
                    src={deleteContactIcon}
                    alt='Delete Contact'
                    id={contact._id}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {contacts.length < 1 && (
        <div className={styles.contactListContainer}>
          <h2>Contacts List</h2>
          <div>Contacts list is empty</div>
        </div>
      )}
    </>
  );
}

export default ContactsList;

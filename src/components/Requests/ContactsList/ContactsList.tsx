import { useEffect } from 'react';
import deleteContactIcon from '../../../assets/icons8-delete-50.png';
import styles from './ContactsList.module.css';

function ContactsList({ contacts, setContacts, contactsRequests, token }) {
  async function deleteContact(id) {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;
      const response = await fetch(`http://localhost:3000/requests/${id}`, {
        headers,
        method: 'DELETE',
      });

      if (response.statusText === 'Unauthorized') navigate('/login');
      const responseData = await response.json();
      setContacts(responseData);
    } catch (err) {
      console.log(err.message);
    }
  }

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

  return (
    <>
      {contacts.length > 0 && (
        <div className={styles.contactListContainer}>
          <h2>Contacts List</h2>
          {contacts.map((contact, index) => (
            <div key={index} className={styles.contactList}>
              <div>{contact.username}</div>
              <div className={styles.buttonContainer}>
                <button onClick={() => deleteContact(contact._id)}>
                  <img
                    className={styles.icon}
                    src={deleteContactIcon}
                    alt='Delete Contact'
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

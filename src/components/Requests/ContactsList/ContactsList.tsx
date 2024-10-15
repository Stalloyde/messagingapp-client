import { useState } from 'react';
import deleteContactIcon from '../../../assets/icons8-delete-50.png';
import styles from './ContactsList.module.css';
import DeleteContactModal from './DeleteContactModal/DeleteContactModal';
import { GetContext } from '../../../utils/GetContext';

function ContactsList() {
  const [isDeletingContact, setIsDeletingContact] = useState(false);
  const [toDeleteId, setToDeleteId] = useState('');
  const { currentUser } = GetContext();

  function handleClick(id: string) {
    setIsDeletingContact(true);
    setToDeleteId(id);
  }

  return (
    <>
      {isDeletingContact && (
        <DeleteContactModal
          setIsDeletingContact={setIsDeletingContact}
          toDeleteId={toDeleteId}
          setToDeleteId={setToDeleteId}
        />
      )}

      {currentUser && currentUser.contacts.length > 0 && (
        <div className={styles.contactListContainer}>
          <h2>Contacts List</h2>
          {currentUser.contacts.map((contact, index) => (
            <div key={index} className={styles.contactList}>
              <div>
                <p>{contact.username}</p>
                <p className={styles.status}>{contact.status}</p>
              </div>
              <div className={styles.buttonContainer}>
                <button
                  id={contact.id?.toString()}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    handleClick(e.currentTarget.id);
                  }}>
                  <img
                    className={styles.icon}
                    src={deleteContactIcon}
                    alt='Delete Contact'
                    id={contact.id?.toString()}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentUser && currentUser.contacts.length < 1 && (
        <div className={styles.contactListContainer}>
          <h2>Contacts List</h2>
          <div>Contacts list is empty</div>
        </div>
      )}
    </>
  );
}

export default ContactsList;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import deleteContactIcon from '../../../assets/icons8-delete-50.png';
import styles from './ContactsList.module.css';
import DeleteContactModal from './DeleteContactModal/DeleteContactModal';
import { GetContext } from '../../../utils/GetContext';
import {
  HeadersType,
  messageType,
  groupType,
  userType,
} from '../../../utils/TypesDeclaration';

type responseType = {
  length?: number;
  usernameError?: string;
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

function ContactsList() {
  const [isDeletingContact, setIsDeletingContact] = useState(false);
  const [toDeleteId, setToDeleteId] = useState('');
  const navigate = useNavigate();
  const { contacts, setContacts, contactsRequestsFrom, token } = GetContext();

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
        if (responseData.error) navigate('/login');
        setContacts(responseData.contacts);
      } catch (err) {
        console.error(err);
      }
    }
    void getContactsToRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactsRequestsFrom]);

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

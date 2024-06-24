import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import deleteContactIcon from '../../../assets/icons8-delete-50.png';
import styles from './ContactsList.module.css';
import DeleteContactModal from './DeleteContactModal/DeleteContactModal';

type HeadersType = {
  'Content-Type': string;
  Authorization?: string;
};

type messageType = {
  content: string;
  from: userPropType | string;
  to: userPropType | string;
};

type groupType = {
  _id: string;
  groupName: string;
  profilePic: { url: string };
  messages: messageType[];
};

type responseType = {
  length?: number;
  usernameError?: string;
  error?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type userPropType = {
  _id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type ContactsListPropsType = {
  token?: string;
  contacts: userPropType[];
  setContacts: React.Dispatch<React.SetStateAction<userPropType[]>>;
  contactsRequests: userPropType[];
};

function ContactsList({
  contacts,
  setContacts,
  contactsRequests,
  token,
}: ContactsListPropsType) {
  const [isDeletingContact, setIsDeletingContact] = useState(false);
  const [toDeleteId, setToDeleteId] = useState('');
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
        if (responseData.error) navigate('/login');
        setContacts(responseData.contacts);
      } catch (err) {
        console.error(err);
      }
    }
    void getContactsToRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactsRequests]);

  function handleClick(id: string) {
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
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    handleClick(e.currentTarget.id);
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

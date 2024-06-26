import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Group.module.css';
import { GetContext } from '../../utils/GetContext';
import {
  HeadersType,
  messageType,
  groupType,
  userType,
} from '../../utils/TypesDeclaration';

type responseType = {
  error?: string;
  username: string;
  status: string;
  contacts: userType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests: userType[];
  groups: groupType[];
};

function Group() {
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [createGroupError, setCreateGroupError] = useState('');
  const navigate = useNavigate();

  const { token, contacts, setContacts } = GetContext();

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
  }, []);

  function markCheckbox(value: string) {
    if (!checkedUsers.includes(value)) {
      setCheckedUsers([...checkedUsers, value]);
    } else {
      setCheckedUsers(checkedUsers.filter((user) => user !== value));
    }
  }

  async function createNewGroup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (checkedUsers.length > 1) {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };
        if (token) headers.Authorization = token;
        const response = await fetch('https://messagingapp.fly.dev/group', {
          headers,
          method: 'POST',
          body: JSON.stringify({ checkedUsers, groupName }),
        });

        if (response.statusText === 'Unauthorized') navigate('/login');
        const responseData = (await response.json()) as responseType;
        setContacts([...responseData.contacts]);
        setCheckedUsers([]);
        setGroupName('');
      } catch (err) {
        console.log(err);
      }
    } else {
      setCreateGroupError('*Not enough participants to create a group');
    }
  }

  return (
    <>
      <div className={styles.rightHeader}>
        <strong>Create Group Chat</strong>
      </div>
      <div className={styles.container}>
        <h2>Select Group Participants</h2>
        {/*eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form method='post' onSubmit={createNewGroup}>
          {createGroupError && (
            <div className={styles.errorMessage}>{createGroupError}</div>
          )}
          <div className={styles.contactListContainer}>
            {contacts.map((contact, index) => (
              <div key={index}>
                <label htmlFor={contact._id}>
                  {contact.username}
                  <input
                    type='checkbox'
                    id={contact._id}
                    value={contact.username}
                    checked={checkedUsers.includes(contact.username)}
                    onChange={(e) => {
                      markCheckbox(e.target.value);
                    }}
                  />
                </label>
              </div>
            ))}
          </div>

          <div className={styles.groupNameContainer}>
            <label htmlFor='group-name'></label>
            <input
              type='text'
              id='group-name'
              placeholder='Group Name'
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
              required
            />
          </div>
          <div className={styles.buttonContainer}>
            <button>Create Group</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Group;

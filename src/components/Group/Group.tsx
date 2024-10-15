import { useState, FormEvent } from 'react';
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
  profilePic: string | null;
  messages: messageType[];
  contactsRequestsFrom: userType[];
  contactsRequestsTo: userType[];
  groups: groupType[];
};

function Group() {
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [createGroupError, setCreateGroupError] = useState('');
  const navigate = useNavigate();

  const { token, currentUser, url, setCurrentUser } = GetContext();

  function markCheckbox(value: string) {
    if (!checkedUsers.includes(value)) {
      setCheckedUsers([...checkedUsers, value]);
    } else {
      setCheckedUsers(checkedUsers.filter((user) => user !== value));
    }
  }

  async function createNewGroup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };
      if (token) headers.Authorization = token;
      const response = await fetch(`${url}/group`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ checkedUsers, groupName }),
      });

      if (response.statusText === 'Unauthorized') navigate('/login');
      const responseData = (await response.json()) as responseType;
      if (responseData.error) {
        setCreateGroupError(responseData.error);
      } else {
        setCheckedUsers([]);
        setGroupName('');
        setCurrentUser(responseData);
      }
    } catch (err) {
      console.log(err);
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
            {currentUser &&
              currentUser.contacts.map((contact, index) => (
                <div key={index}>
                  <label>
                    {contact.username}
                    <input
                      type='checkbox'
                      id={contact.id?.toString()}
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

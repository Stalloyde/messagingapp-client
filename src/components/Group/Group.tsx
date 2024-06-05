import { useState, useEffect } from 'react';
import styles from './Group.module.css';
import '../../index.css';

function Requests({ token, contacts, setContacts }) {
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');

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
  }, []);

  function markCheckbox(value) {
    if (!checkedUsers.includes(value)) {
      setCheckedUsers([...checkedUsers, value]);
    } else {
      setCheckedUsers(checkedUsers.filter((user) => user !== value));
    }
  }

  async function createNewGroup(e) {
    e.preventDefault();
    if (checkedUsers.length > 1) {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };
        if (token) headers.Authorization = token;
        const response = await fetch('http://localhost:3000/group', {
          headers,
          method: 'POST',
          body: JSON.stringify({ checkedUsers, groupName }),
        });

        if (response.statusText === 'Unauthorized') navigate('/login');
        const responseData = await response.json();
        console.log(responseData);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert('Not enough participants to create a group');
    }
  }

  return (
    <>
      <div className='rightHeader'>
        <strong>Create Group Chat</strong>
      </div>
      <div className={styles.container}>
        <h2>Select Group Participants</h2>
        <form method='post' onSubmit={createNewGroup}>
          <div className={styles.contactListContainer}>
            {contacts.map((contact, index) => (
              <div key={index}>
                <label htmlFor={index}>
                  {contact.username}
                  <input
                    type='checkbox'
                    id={index}
                    value={contact.username}
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

export default Requests;

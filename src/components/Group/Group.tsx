import { useState, useEffect } from 'react';
import styles from './Group.module.css';
import '../../index.css';

function Requests({ token, contacts, setContacts }) {
  const [checkedIndex, setCheckedIndex] = useState([]);

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

  function markCheckbox(index) {
    if (!checkedIndex.includes(index.toString())) {
      setCheckedIndex([...checkedIndex, index]);
    } else {
      setCheckedIndex(checkedIndex.filter((i) => i !== index));
    }
  }

  function createNewGroup(e) {
    e.preventDefault();
    if (checkedIndex.length > 1) alert('submitting');
    if (checkedIndex.length < 2)
      alert('Not enough participants to create a group');
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
                    onChange={(e) => {
                      markCheckbox(e.target.id);
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

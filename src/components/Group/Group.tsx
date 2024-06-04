import { useState, useEffect } from 'react';
import styles from './Group.module.css';
import '../../index.css';

function Requests({ token, contacts, setContacts }) {
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

  function createNewGroup() {
    alert('create new group');
  }

  return (
    <>
      <div className='rightHeader'>
        <strong>Create Group Chat</strong>
      </div>
      <div className={styles.container}>
        Select group paticipants
        <form method='post' onSubmit={createNewGroup}>
          {contacts.map((contact, index) => (
            <div key={index}>
              <label htmlFor={index}>{contact.username}</label>
              <input type='checkbox' id={index} />
            </div>
          ))}

          <button>Create Group</button>
        </form>
        <div className={styles.resultsContainer}></div>
      </div>
    </>
  );
}

export default Requests;

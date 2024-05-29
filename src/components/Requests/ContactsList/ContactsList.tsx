import deleteContactIcon from '../../../assets/icons8-delete-50.png';
import styles from './ContactsList.module.css';

function Requests({ contacts, token }) {
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

      if (responseData.error) navigate('/login');
      console.log(responseData);
    } catch (err) {
      console.log(err.message);
    }
  }

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

export default Requests;

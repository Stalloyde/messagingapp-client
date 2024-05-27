import deleteContactIcon from '../../../assets/icons8-delete-50.png';
import styles from './ContactsList.module.css';

function Requests({ contacts }) {
  async function deleteContact(id) {
    alert('deleting contact');
  }

  return (
    <>
      {contacts.length > 0 && (
        <div>
          <h2>Contacts List</h2>
          {contacts.map((contact, index) => (
            <div key={index} className={styles.listContainer}>
              <div>{contact.username}</div>
              <button onClick={() => deleteContact(contact._id)}>
                <img
                  className={styles.icon}
                  src={deleteContactIcon}
                  alt='Delete Contact'
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {contacts.length < 1 && (
        <div>
          <h2>Contacts List</h2>
          Contacts list is empty
        </div>
      )}
    </>
  );
}

export default Requests;

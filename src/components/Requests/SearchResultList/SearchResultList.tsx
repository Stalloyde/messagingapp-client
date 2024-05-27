import styles from './SearchResultList.module.css';
import deleteContactIcon from '../../../assets/icons8-delete-50.png';
import addContactIcon from '../../../assets/icons8-add-contact-24.png';

function SearchResultList({ token, username, searchResult, currentUser }) {
  async function deleteContact(id) {
    alert('deleting contact');
  }

  async function sendRequest(id) {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;

      const response = await fetch(`http://localhost:3000/requests/${id}`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ username }),
      });

      if (response.statusText === 'Unauthorized') navigate('/login');
      const responseData = await response.json();
      console.log(responseData);
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    searchResult.length > 0 && (
      <ul>
        {searchResult.map((result, index) => {
          const isCurrentContact = result.contacts.includes(currentUser._id);
          const isRequestPending = result.contactsRequests.includes(
            currentUser._id,
          );

          return (
            <li key={index} className={styles.searchResult}>
              <div>{result.username}</div>
              {isCurrentContact && (
                <button onClick={(e) => deleteContact(e.target.id)}>
                  <img
                    className={styles.icon}
                    src={deleteContactIcon}
                    id={result._id}></img>
                </button>
              )}
              {!isCurrentContact && isRequestPending && (
                <button disabled>
                  <div>
                    <img className={styles.icon} src={addContactIcon}></img>
                    Requested
                  </div>
                </button>
              )}
              {!isCurrentContact && !isRequestPending && (
                <button>
                  assets assets
                  <div>
                    <img
                      className={styles.icon}
                      src={addContactIcon}
                      id={result._id}
                      onClick={(e) => sendRequest(e.target.id)}></img>
                    Request
                  </div>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    )
  );
}

export default SearchResultList;

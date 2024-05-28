import styles from './SearchResultList.module.css';
import addContactIcon from '../../../assets/icons8-add-contact-24.png';
import deleteContactIcon from '../../../assets/icons8-delete-50.png';

function SearchResultList({ token, username, searchResult, currentUser }) {
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
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      {searchResult.usernameError && username && (
        <div className={styles.listContainer}>
          <h2>Search Results</h2>
          Username not found
        </div>
      )}

      {searchResult.length > 0 && (
        <div className={styles.listContainer}>
          <h2>Search Results</h2>
          <ul>
            {searchResult.map((result, index) => {
              const isRequestPending = result.contactsRequests.includes(
                currentUser._id,
              );

              return (
                <li key={index} className={styles.searchResult}>
                  <div>{result.username}</div>
                  {isRequestPending && (
                    <div>
                      <button disabled>
                        <div>
                          <img
                            className={styles.icon}
                            src={addContactIcon}></img>
                          Requested
                        </div>
                      </button>
                    </div>
                  )}
                  {!isRequestPending && (
                    <div>
                      <button>
                        <div>
                          <img
                            className={styles.icon}
                            src={addContactIcon}
                            id={result._id}
                            onClick={(e) => sendRequest(e.target.id)}></img>
                          Request
                        </div>
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default SearchResultList;

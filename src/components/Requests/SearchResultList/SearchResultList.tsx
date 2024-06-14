import styles from './SearchResultList.module.css';
import addContactIcon from '../../../assets/icons8-add-contact-24.png';

function SearchResultList({
  username,
  setUsername,
  searchResult,
  currentUser,
  token,
}) {
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
      if (responseData) setUsername('');
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      {searchResult.usernameError && username && (
        <div className={styles.listContainer}>
          <h2>Search Results</h2>
          <div>Username not found</div>
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
                  <div>
                    <p>{result.username}</p>
                    <p className={styles.status}>{result.status}</p>
                  </div>
                  {isRequestPending && (
                    <div className={styles.buttonContainer}>
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
                    <div className={styles.buttonContainer}>
                      <button onClick={() => sendRequest(result._id)}>
                        <div>
                          <img
                            className={styles.icon}
                            src={addContactIcon}
                            id={result._id}></img>
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

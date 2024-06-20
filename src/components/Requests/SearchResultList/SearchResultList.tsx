import { useNavigate } from 'react-router-dom';
import styles from './SearchResultList.module.css';
import addContactIcon from '../../../assets/icons8-add-contact-24.png';

type HeadersType = {
  'Content-Type': string;
  Authorization?: string;
};

type messageType = {
  content: string;
  from: userPropType | string;
  to: userPropType | string;
};

type groupType = {
  _id: string;
  groupName: string;
  profilePic?: string;
  messages: messageType[];
};

type userPropType = {
  _id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: string;
  messages: messageType[];
  contactsRequests: userPropType[] | string[];
  groups: groupType[];
};

type RequestsPropsType = {
  username?: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  searchResult: userPropType[];
  searchResultError: string | null;
  currentUser?: userPropType;
  token?: string;
};

function SearchResultList({
  username,
  setUsername,
  searchResult,
  searchResultError,
  currentUser,
  token,
}: RequestsPropsType) {
  const navigate = useNavigate();

  async function sendRequest(id: string) {
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
      setUsername('');
    } catch (err: unknown) {
      console.log(err.message);
    }
  }

  return (
    <>
      {searchResultError && username && (
        <div className={styles.listContainer}>
          <h2>Search Results</h2>
          <div>Username not found</div>
        </div>
      )}

      {currentUser && searchResult.length > 0 && (
        <div className={styles.listContainer}>
          <h2>Search Results</h2>
          <ul>
            {searchResult.map((result, index) => {
              const isRequestPending = currentUser._id
                ? (result.contactsRequests as string[]).includes(
                    currentUser._id,
                  )
                : false;

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
                      <button
                        onClick={() => {
                          if (result._id) void sendRequest(result._id);
                        }}>
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

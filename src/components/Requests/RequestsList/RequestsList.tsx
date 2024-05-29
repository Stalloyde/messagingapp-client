import acceptRequestIcon from '../../../assets/icons8-checked-user-24.png';
import rejectRequestIcon from '../../../assets/icons8-unfriend-50.png';
import styles from './RequestsList.module.css';

const RequestsList = ({
  contactsRequests,
  setContactsRequests,
  searchResult,
  username,
  token,
}) => {
  const noSearchResults = searchResult.length === 0;
  const hasContactRequests = contactsRequests.length > 0;

  async function handleRequest(id, action) {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;

      const response = await fetch(`http://localhost:3000/requests/${id}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify({ action }),
      });

      if (response.statusText === 'Unauthorized') navigate('/login');
      const responseData = await response.json();
      if (responseData) setContactsRequests(responseData);
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      {noSearchResults && !username && !hasContactRequests && (
        <div className={styles.listContainer}>
          <h2>Incoming Requests</h2>
          <div>No requests found</div>
        </div>
      )}
      {hasContactRequests && !username && (
        <div className={styles.listContainer}>
          <h2>Incoming Requests</h2>
          {contactsRequests.map((request, index) => (
            <div key={index} className={styles.requestContainer}>
              <div>{request.username}</div>
              <div className={styles.buttonContainer}>
                <div>
                  <button
                    className={styles.approve}
                    onClick={() => {
                      handleRequest(request._id, 'approve');
                    }}>
                    <img
                      src={acceptRequestIcon}
                      alt='accept-request'
                      className={styles.icon}
                    />
                  </button>
                </div>
                <div>
                  <button
                    className={styles.reject}
                    onClick={() => {
                      handleRequest(request._id, 'reject');
                    }}>
                    <img
                      src={rejectRequestIcon}
                      alt='reject-request'
                      className={styles.icon}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RequestsList;

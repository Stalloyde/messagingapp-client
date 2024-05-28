import acceptRequestIcon from '../../../assets/icons8-checked-user-24.png';
import rejectRequestIcon from '../../../assets/icons8-unfriend-50.png';
import styles from './RequestsList.module.css';

const RequestsList = ({ contactsRequests, searchResult, username }) => {
  const noSearchResults = searchResult.length === 0;
  const hasContactRequests = contactsRequests.length > 0;

  return (
    <>
      {noSearchResults && !username && !hasContactRequests && (
        <div className={styles.listContainer}>
          <h2>Incoming Requests</h2>
          No requests found
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
                  <button className={styles.approve}>
                    <img
                      src={acceptRequestIcon}
                      alt='accept-request'
                      className={styles.icon}
                    />
                  </button>
                </div>
                <div>
                  <button className={styles.reject}>
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

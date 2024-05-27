import acceptRequestIcon from '../../../assets/icons8-checked-user-24.png';
import rejectRequestIcon from '../../../assets/icons8-unfriend-50.png';
import styles from './RequestsList.module.css';

function RequestsList({ contactsRequests }) {
  return (
    <>
      {contactsRequests.map((request, index) => (
        <div key={index} className={styles.listContainer}>
          <div>{request.username}</div>
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
      ))}
    </>
  );
}

export default RequestsList;

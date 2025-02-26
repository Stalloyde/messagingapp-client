import { useNavigate } from 'react-router-dom';
import acceptRequestIcon from '../../../assets/icons8-checked-user-24.png';
import rejectRequestIcon from '../../../assets/icons8-unfriend-50.png';
import styles from './RequestsList.module.css';
import { GetContext } from '../../../utils/GetContext';
import {
  HeadersType,
  messageType,
  groupType,
  userType,
} from '../../../utils/TypesDeclaration';

type responseType = {
  length?: number;
  usernameError?: string;
  error?: string;
  username: string;
  status: string;
  contacts: userType[];
  profilePic: string | null;
  messages: messageType[];
  contactsRequestsFrom: userType[];
  contactsRequestsTo: userType[];
  groups: groupType[];
};

type RequestsListPropsType = {
  username?: string;
};

const RequestsList = ({ username }: RequestsListPropsType) => {
  const { token, currentUser, setCurrentUser, url } = GetContext();
  const navigate = useNavigate();

  async function handleRequest(
    requestingUserId: number,
    action: string,
    contactsRequestsId: number,
  ) {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;

      const response = await fetch(`${url}/requests/${requestingUserId}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify({ action, contactsRequestsId }),
      });

      if (response.status === 401) navigate('/login');
      if (!response.ok)
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`,
        );

      const responseData = (await response.json()) as responseType;
      setCurrentUser(responseData);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {currentUser &&
        currentUser.contactsRequestsFrom.length > 0 &&
        !username && (
          <div className={styles.listContainer}>
            <h2>Incoming Requests</h2>
            {currentUser.contactsRequestsFrom.map(
              (request, index) =>
                request.from && (
                  <div key={index} className={styles.requestContainer}>
                    <div>
                      <p>{request.from.username}</p>
                      <p className={styles.status}>{request.status}</p>
                    </div>
                    <div className={styles.buttonContainer}>
                      <div>
                        <button
                          className={styles.approve}
                          onClick={() => {
                            request.from &&
                              request.id &&
                              void handleRequest(
                                request.from.id,
                                'approve',
                                request.id,
                              );
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
                            request.from &&
                              request.id &&
                              void handleRequest(
                                request.from.id,
                                'reject',
                                request.id,
                              );
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
                ),
            )}
          </div>
        )}
    </>
  );
};

export default RequestsList;

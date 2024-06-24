import { useNavigate } from 'react-router-dom';
import acceptRequestIcon from '../../../assets/icons8-checked-user-24.png';
import rejectRequestIcon from '../../../assets/icons8-unfriend-50.png';
import styles from './RequestsList.module.css';

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
  profilePic: { url: string };
  messages: messageType[];
};

type responseType = {
  length?: number;
  usernameError?: string;
  error?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type userPropType = {
  length?: number;
  _id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type RequestsListPropsType = {
  contactsRequests: userPropType[];
  setContactsRequests: React.Dispatch<React.SetStateAction<userPropType[]>>;
  searchResult: userPropType[];
  username?: string;
  token?: string;
};

const RequestsList = ({
  contactsRequests,
  setContactsRequests,
  searchResult,
  username,
  token,
}: RequestsListPropsType) => {
  const noSearchResults = searchResult.length === 0;
  const hasContactRequests = contactsRequests.length > 0;
  const navigate = useNavigate();

  async function handleRequest(id: string, action: string) {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;

      const response = await fetch(
        `https://messagingapp.fly.dev/requests/${id}`,
        {
          headers,
          method: 'PUT',
          body: JSON.stringify({ action }),
        },
      );

      if (response.status === 401) navigate('/login');
      if (!response.ok)
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`,
        );

      const responseData = (await response.json()) as responseType;
      setContactsRequests(responseData.contactsRequests);
    } catch (err: unknown) {
      console.error(err);
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
              <div>
                <p>{request.username}</p>
                <p className={styles.status}>{request.status}</p>
              </div>
              <div className={styles.buttonContainer}>
                <div>
                  <button
                    className={styles.approve}
                    onClick={() => {
                      if (request._id)
                        void handleRequest(request._id, 'approve');
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
                      if (request._id)
                        void handleRequest(request._id, 'reject');
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

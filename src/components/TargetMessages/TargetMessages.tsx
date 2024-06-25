import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExitGroupModal from './ExitGroupModal/ExitGroupModal';
import styles from './TargetMessages.module.css';
import sendIcon from '../../assets/icons8-send-24.png';
import addFileIcon from '../../assets/icons8-add-50.png';
import addEmoticonIcon from '../../assets/icons8-happy-48.png';
import defaultAvatar from '../../assets/icons8-avatar-50.png';
import io, { Socket } from 'socket.io-client';

const socket: Socket = io('https://messagingapp.fly.dev', {
  extraHeaders: {
    'Access-Control-Allow-Origin': 'https://messagingapp-client.vercel.app',
  },
});

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
  profilePic: { url: string } | null;
  messages: messageType[];
};

type responseType = {
  error?: string;
  username?: string;
  status?: string;
  contacts?: userPropType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests?: userPropType[];
  groups?: groupType[];
  groupName?: string;
  participants?: userPropType[];
};

type userPropType = {
  _id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type TargetMessagesPropsType = {
  token?: string;
  currentUser?: userPropType;
  setContacts: React.Dispatch<React.SetStateAction<userPropType[]>>;
};

function TargetMessages({
  token,
  currentUser,
  setContacts,
}: TargetMessagesPropsType) {
  const [messages, setMessages] = useState<messageType[]>();
  const [username, setUsername] = useState<string>();
  const [profilePic, setProfilePic] = useState<{ url: string } | null>();
  const [groupName, setGroupName] = useState<string>('');
  const [groupParticipants, setGroupParticipants] = useState<userPropType[]>(
    [],
  );
  const [newMessage, setNewMessage] = useState<string>('');
  const [isExitingGroup, setIsExitingGroup] = useState(false);

  const targetMessagesId = useParams().id;
  const navigate = useNavigate();

  function renderSingleContactMessages(responseData: responseType) {
    setMessages(responseData.messages);
    setUsername(responseData.username);
    setProfilePic(responseData.profilePic);
    setGroupName('');
    setGroupParticipants([]);
  }

  function renderGroupMessages(responseData: responseType) {
    if (responseData.participants && responseData.groupName) {
      setGroupParticipants(responseData.participants);
      setGroupName(responseData.groupName);
    }
  }

  async function getTargetMessages() {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;
      const response = await fetch(
        `https://messagingapp.fly.dev/messages/${targetMessagesId}`,
        {
          headers,
        },
      );

      if (response.status === 401) navigate('/login');
      if (!response.ok)
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`,
        );

      const responseData = (await response.json()) as responseType;
      if (responseData.error) navigate('/login');

      renderSingleContactMessages(responseData);
      renderGroupMessages(responseData);
    } catch (err) {
      console.error(err);
    }
  }

  if (currentUser)
    socket.emit('joinRoom', {
      room: currentUser._id,
    });

  if (groupName)
    socket.emit('joinRoom', {
      room: targetMessagesId,
    });

  //initial render and re-render when click on new target
  useEffect(() => {
    void getTargetMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMessagesId]);

  useEffect(() => {
    socket.on('receiveMessage', () => {
      void getTargetMessages();
    });
  }, [socket]);

  async function sendNewMessage(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLImageElement>,
  ) {
    e.preventDefault();

    socket.emit('sendMessage', {
      message: newMessage,
      room: targetMessagesId,
    });

    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;
      const response = await fetch(
        `https://messagingapp.fly.dev/messages/${targetMessagesId}`,
        {
          headers,
          method: 'post',
          body: JSON.stringify({ newMessage }),
        },
      );
      if (response.status === 401) navigate('/login');
      if (!response.ok)
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`,
        );

      const responseData = (await response.json()) as responseType;
      if (responseData.error) navigate('/login');
      setNewMessage('');
      void getTargetMessages();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.targetMessagesContainer}>
      {!currentUser && <div className={styles.loadingMessage}>Loading...</div>}
      {currentUser && (
        <div className={styles.rightHeader}>
          {profilePic ? (
            <img src={profilePic.url} />
          ) : (
            <img
              src={defaultAvatar}
              alt='profile-pic'
              className={styles.icons}
            />
          )}
          {username && <strong>{username}</strong>}
          {groupName && groupParticipants.length > 0 && (
            <>
              <strong>{groupName}</strong>
              <div className={styles.groupContainer}>
                <div>
                  <em>{groupParticipants.length} members</em>
                </div>
                <button
                  onClick={() => {
                    setIsExitingGroup(true);
                  }}>
                  Exit Group
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {currentUser && (
        <div className={styles.messagesContainer}>
          {isExitingGroup && (
            <ExitGroupModal
              setIsExitingGroup={setIsExitingGroup}
              setContacts={setContacts}
              token={token}
            />
          )}

          {messages &&
            !groupName &&
            groupParticipants.length < 1 &&
            messages.map((message, index) =>
              message.from === currentUser._id ? (
                <div key={index} className={styles.incomingContainer}>
                  {message.content}
                </div>
              ) : (
                <div key={index} className={styles.outgoingContainer}>
                  <div className={styles.outgoingMessage}>
                    {message.content}
                  </div>
                </div>
              ),
            )}

          {messages &&
            groupName &&
            groupParticipants.length > 0 &&
            messages.map((message, index) =>
              typeof message.from === 'object' &&
              message.from._id === currentUser._id ? (
                <div key={index} className={styles.incomingContainer}>
                  <>
                    <h3>{message.from.username}</h3>
                    {message.content}
                  </>
                </div>
              ) : (
                <div key={index} className={styles.outgoingContainer}>
                  <div className={styles.outgoingMessage}>
                    {typeof message.from === 'object' && (
                      <h3>{message.from.username}</h3>
                    )}
                    {message.content}
                  </div>
                </div>
              ),
            )}
        </div>
      )}

      <div className={styles.inputContainer}>
        <img src={addEmoticonIcon} alt='add-emoticon' />
        <img src={addFileIcon} alt='add-file' />
        {/*eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form method='POST' onSubmit={sendNewMessage}>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            placeholder='Type a message'></input>
        </form>
        <img
          src={sendIcon}
          alt='send'
          /*eslint-disable-next-line @typescript-eslint/no-misused-promises */
          onClick={sendNewMessage}
          className={styles.sendMessageIcon}
        />
      </div>
    </div>
  );
}

export default TargetMessages;

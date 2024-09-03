import { useState, useEffect, FormEvent, MouseEvent, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExitGroupModal from './ExitGroupModal/ExitGroupModal';
import styles from './TargetMessages.module.css';
import sendIcon from '../../assets/icons8-send-24.png';
import addFileIcon from '../../assets/icons8-add-50.png';
import addEmoticonIcon from '../../assets/icons8-happy-48.png';
import defaultAvatar from '../../assets/icons8-avatar-50.png';
import io, { Socket } from 'socket.io-client';
import { GetContext } from '../../utils/GetContext';
import {
  HeadersType,
  messageType,
  groupType,
  userType,
} from '../../utils/TypesDeclaration';

const socket: Socket = io('https://messagingapp.fly.dev', {
  extraHeaders: {
    'Access-Control-Allow-Origin': 'https://messagingapp-client.vercel.app',
  },
});

type responseType = {
  error?: string;
  username?: string;
  status?: string;
  contacts?: userType[];
  profilePic: string | null;
  messages: messageType[];
  contactsRequests?: userType[];
  groups?: groupType[];
  groupName?: string;
  participants?: userType[];
};

function TargetMessages() {
  const [targetUser, setTargetUser] = useState<userType>();
  const [targetGroup, setTargetGroup] = useState<groupType>();
  const [newMessage, setNewMessage] = useState<string>('');
  const [isExitingGroup, setIsExitingGroup] = useState(false);
  const navigate = useNavigate();
  const targetMessagesId = useParams().id;

  const { token, currentUser, setContacts } = GetContext();

  function isUserPropType(
    responseData: responseType,
  ): responseData is userType {
    return responseData.username !== undefined;
  }

  function isGroupType(responseData: responseType): responseData is groupType {
    return responseData.groupName !== undefined;
  }

  const getTargetMessages = useCallback(async () => {
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
      if (responseData.error) {
        navigate('/');
        throw new Error(responseData.error);
      }
      if (isUserPropType(responseData)) {
        setTargetUser(responseData);
        setTargetGroup(undefined);
        setContacts([]);
      } else if (isGroupType(responseData)) {
        setTargetUser(undefined);
        setTargetGroup(responseData);
        setContacts([]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token, targetMessagesId, navigate]);

  //initial render and re-render when click on new target
  useEffect(() => {
    void getTargetMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMessagesId]);

  useEffect(() => {
    if (targetGroup) {
      socket.emit('joinGroupRoom', {
        groupRoom: targetGroup.groupName,
      });
    }

    if (targetUser && currentUser) {
      socket.emit('joinPrivateRoom', {
        id1: currentUser.username,
        id2: targetUser.username,
      });
    }
  }, [targetGroup, targetUser, currentUser]);

  useEffect(() => {
    const handlePrivateMessage = () => {
      void getTargetMessages();
    };

    const handleGroupMessage = () => {
      void getTargetMessages();
    };

    socket.on('receivePrivateMessage', handlePrivateMessage);
    socket.on('receiveGroupMessage', handleGroupMessage);

    return () => {
      socket.off('receivePrivateMessage', handlePrivateMessage);
      socket.off('receiveGroupMessage', handleGroupMessage);
    };
  }, [getTargetMessages]);

  async function sendNewMessage(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLImageElement>,
  ) {
    e.preventDefault();

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

      if (targetUser && currentUser) {
        socket.emit('privateMessage', {
          id1: currentUser.username,
          id2: targetUser.username,
          msg: newMessage,
        });
      }

      if (currentUser && targetGroup) {
        socket.emit('groupMessage', {
          id: currentUser.username,
          room: targetGroup.groupName,
          msg: newMessage,
        });
      }

      setNewMessage('');
      setContacts([]);
      void getTargetMessages();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.targetMessagesContainer}>
      {!currentUser && <div className={styles.loadingMessage}>Loading...</div>}
      {currentUser && targetUser && (
        <>
          <div className={styles.rightHeader}>
            {targetUser.profilePic ? (
              <img src={targetUser.profilePic} />
            ) : (
              <img
                src={defaultAvatar}
                alt='profile-pic'
                className={styles.icons}
              />
            )}
            {targetUser.username && <strong>{targetUser.username}</strong>}
          </div>
          <div className={styles.messagesContainer}>
            {isExitingGroup && (
              <ExitGroupModal setIsExitingGroup={setIsExitingGroup} />
            )}

            {targetUser.messages.map((message, index) =>
              message.userIdFrom === currentUser.id ? (
                <div key={index} className={styles.outgoingContainer}>
                  <div className={styles.outgoingMessage}>
                    {message.content}
                  </div>
                </div>
              ) : (
                <div key={index} className={styles.incomingContainer}>
                  {message.content}
                </div>
              ),
            )}
          </div>
        </>
      )}

      {currentUser && targetGroup && (
        <>
          <>
            <div className={styles.rightHeader}>
              {targetGroup.profilePic ? (
                <img src={targetGroup.profilePic} />
              ) : (
                <img
                  src={defaultAvatar}
                  alt='profile-pic'
                  className={styles.icons}
                />
              )}
              <strong>{targetGroup.groupName}</strong>
              <div className={styles.groupContainer}>
                <div>
                  <em>{targetGroup.participants.length} members</em>
                </div>
                <button
                  onClick={() => {
                    setIsExitingGroup(true);
                  }}>
                  Exit Group
                </button>
              </div>
            </div>
          </>
          <div className={styles.messagesContainer}>
            {isExitingGroup && (
              <ExitGroupModal setIsExitingGroup={setIsExitingGroup} />
            )}
            {targetGroup.messages.map((message, index) =>
              message.userIdFrom === currentUser.id ? (
                <div key={index} className={styles.outgoingContainer}>
                  <div className={styles.outgoingMessage}>
                    <h3>{message.from.username}</h3>
                    {message.content}
                  </div>
                </div>
              ) : (
                <div key={index} className={styles.incomingContainer}>
                  <>
                    <h3>{message.from.username}</h3>
                    {message.content}
                  </>
                </div>
              ),
            )}
          </div>
        </>
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

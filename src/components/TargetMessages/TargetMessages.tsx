import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TargetMessages.module.css';
import sendIcon from '../../assets/icons8-send-24.png';
import addFileIcon from '../../assets/icons8-add-50.png';
import addEmoticonIcon from '../../assets/icons8-happy-48.png';

function TargetMessages({ token, currentUser }) {
  const [messages, setMessages] = useState();
  const [username, setUsername] = useState();
  const [groupName, setGroupName] = useState('');
  const [groupParticipants, setGroupParticipants] = useState([]);
  const [profilePic, setProfilePic] = useState();
  const [newMessage, setNewMessage] = useState('');

  const targetMessagesId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    async function getTargetMessages() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch(
          `http://localhost:3000/messages/${targetMessagesId}`,
          {
            headers,
          },
        );
        if (response.statusText === 'Unauthorized') navigate('/login');

        const responseData = await response.json();
        if (responseData.error) navigate('/login');
        console.log(responseData);
        setMessages(responseData.messages);
        setProfilePic(responseData.profilePic);
        setUsername(responseData.username);
        setGroupParticipants(responseData.participants);
        setGroupName(responseData.groupName);
      } catch (err) {
        console.log(err.message);
      }
    }
    getTargetMessages();
  }, [targetMessagesId]);

  async function sendNewMessage(e) {
    e.preventDefault();

    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;
      const response = await fetch(
        `http://localhost:3000/messages/${targetMessagesId}`,
        {
          headers,
          method: 'post',
          body: JSON.stringify({ newMessage }),
        },
      );
      if (response.statusText === 'Unauthorized') navigate('/login');

      const responseData = await response.json();
      if (responseData.error) navigate('/login');
      console.log(responseData);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.targetMessagesContainer}>
      <div className={styles.rightHeader}>
        <div>{profilePic} pic here</div>
        {username && <strong>{username}</strong>}
        {groupName && groupParticipants && (
          <>
            <strong>{groupName}</strong>
            <div className={styles.groupContainer}>
              {groupParticipants.map((participant, index) => (
                <em key={index}>{participant.username}</em>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={styles.messagesContainer}>
        {messages &&
          !groupName &&
          !groupParticipants &&
          messages.map((message, index) =>
            message.from === currentUser._id ? (
              <div key={index} className={styles.incomingContainer}>
                {message.content}
              </div>
            ) : (
              <div key={index} className={styles.outgoingContainer}>
                <div className={styles.outgoingMessage}>{message.content}</div>
              </div>
            ),
          )}

        {messages &&
          groupName &&
          groupParticipants &&
          messages.map((message, index) =>
            message.from === currentUser._id ? (
              <div key={index} className={styles.incomingContainer}>
                <>
                  <h3>{message.from.username}</h3>
                  {message.content}
                </>
              </div>
            ) : (
              <div key={index} className={styles.outgoingContainer}>
                <div className={styles.outgoingMessage}>
                  <h3>{message.from.username}</h3>
                  {message.content}
                </div>
              </div>
            ),
          )}
      </div>
      <div className={styles.inputContainer}>
        <img src={addEmoticonIcon} alt='add-emoticon' />
        <img src={addFileIcon} alt='add-file' />
        <form method='POST' onSubmit={sendNewMessage}>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            placeholder='Type a message'></input>
        </form>
        <img src={sendIcon} alt='send' />
      </div>
    </div>
  );
}

export default TargetMessages;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TargetMessages.module.css';
import sendIcon from '../../assets/icons8-send-24.png';
import addFileIcon from '../../assets/icons8-add-50.png';
import addEmoticonIcon from '../../assets/icons8-happy-48.png';
import '../../index.css';

function TargetMessages({ token }) {
  const [messages, setMessages] = useState();
  const [username, setUsername] = useState();
  const [profilePic, setProfilePic] = useState();
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
        setMessages(responseData.messages);
        setProfilePic(responseData.profilePic);
        setUsername(responseData.username);
      } catch (err) {
        console.log(err.message);
      }
    }
    getTargetMessages();
  }, [token]);

  return (
    <>
      <div className='rightHeader'>
        <div>{profilePic} pic here</div>
        <strong>{username}</strong>
      </div>
      <div className={styles.messagesContainer}>
        {messages &&
          messages.map((message, index) =>
            message.from === targetMessagesId ? (
              <div key={index} className={styles.incoming}>
                {message.content}
              </div>
            ) : (
              <div key={index} className={styles.outgoingContainer}>
                <div className={styles.outgoingMessage}>{message.content}</div>
              </div>
            ),
          )}
      </div>
      <div className={styles.inputContainer}>
        <img src={addEmoticonIcon} alt='add-emoticon' />
        <img src={addFileIcon} alt='add-file' />
        <input type='text' placeholder='Type a message'></input>
        <img src={sendIcon} alt='send' />
      </div>
    </>
  );
}

export default TargetMessages;

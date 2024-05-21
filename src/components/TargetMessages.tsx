import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import styles from './TargetMessages.module.css';

function TargetMessages({ token }) {
  const [messages, setMessages] = useState();
  const targetMessagesId = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getTargetMessages() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch(
          `http://localhost:3000/messages/${targetMessagesId.id}`,
          {
            headers,
          },
        );
        if (response.statusText === 'Unauthorized') navigate('/login');

        const responseData = await response.json();
        if (responseData.error) navigate('/login');
        setMessages(responseData);
      } catch (err) {
        console.log(err.message);
      }
    }
    getTargetMessages();
  }, [token]);
  return (
    <Layout token={token}>
      <div className={styles.container}>
        <div>Retrieve and render targetUser pic</div>
        <div>Retrieve and render targetUser username</div>
      </div>
      <ul>
        {messages &&
          messages.map((message, index) => (
            <li key={index}>{message.content}</li>
          ))}
      </ul>
    </Layout>
  );
}

export default TargetMessages;

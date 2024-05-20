import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Messages({ currentUserId, token }) {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getMessages() {
      try {
        const headers: HeadersType = {
          'Content-Type': 'application/json',
        };

        if (token) headers.Authorization = token;
        const response = await fetch('http://localhost:3000', { headers });

        if (response.statusText === 'Unauthorized') navigate('/login');

        const responseData = await response.json();
        if (responseData.error) navigate('/login');
        setMessages(responseData);
      } catch (err) {
        console.log(err.message);
      }
    }
    getMessages();
  }, [token]);

  return <>Messages</>;
}

export default Messages;

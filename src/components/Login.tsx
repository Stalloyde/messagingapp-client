import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login({ setToken }) {
  const [loginError, setLoginError] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleToken = (BearerToken: string) => {
    const oneHour = new Date(new Date().getTime() + 1000 * 60 * 1000);
    Cookies.set('token', BearerToken, {
      expires: oneHour,
      secure: true,
    });
    setToken(Cookies.get('token'));
  };

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.json();

      if (!responseData.user && !responseData.Bearer) {
        console.log(responseData);
        setLoginError(responseData);
      } else {
        setUsername('');
        setPassword('');
        setLoginError('');
        handleToken(responseData.Bearer);
        navigate('/');
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <h2>Log in to your account</h2>
      <p>
        Don&apos;t have an account? <Link to='/signup'>Sign Up</Link>
      </p>

      <form method='post' onSubmit={handleLogin} action='/'>
        {loginError && (
          <>
            {loginError.usernameError} {loginError.passwordError}
          </>
        )}
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          name='username'
          required
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
        />

        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          name='password'
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />

        <button>Log In</button>
      </form>
    </>
  );
}

export default Login;

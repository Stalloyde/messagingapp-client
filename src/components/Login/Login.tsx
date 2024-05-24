import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from './Login.module.css';
import loginImage from '../../assets/speech-bubble.jpg';

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
        setLoginError(responseData);
        setPassword('');
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
      <div className={styles.formContainer}>
        <img src={loginImage} alt='image' />
        <div className={styles.formHeader}>
          <h2>Log in to your account</h2>
          <p>
            Don&apos;t have an account? <Link to='/signup'>Sign Up</Link>
          </p>
        </div>
        <form method='post' onSubmit={handleLogin} action='/'>
          <div>
            <label htmlFor='username'>Username: </label>
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
          </div>

          <div>
            <label htmlFor='password'>Password: </label>
            <input
              type='password'
              name='password'
              id='password'
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
          </div>
          <button>Log In</button>
          {loginError && (
            <div className={styles.errorMessage}>
              {loginError.usernameError} {loginError.passwordError}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default Login;

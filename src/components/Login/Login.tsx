import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from './Login.module.css';
import loginImage from '../../assets/speech-bubble.jpg';
import { GetContext } from '../../utils/GetContext';

type loginErrorType = {
  usernameError?: string;
  passwordError?: string;
};

type responseType = {
  usernameError?: string;
  passwordError?: string;
  username?: string;
  Bearer?: string;
};

function Login() {
  const [loginError, setLoginError] = useState<loginErrorType>({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setToken, url } = GetContext();

  const handleToken = (BearerToken: string) => {
    const oneHour = new Date(new Date().getTime() + 1000 * 60 * 1000);
    Cookies.set('token', BearerToken, {
      expires: oneHour,
      secure: true,
    });

    const cookie = Cookies.get('token');
    if (cookie) setToken(cookie);
  };

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const responseData = (await response.json()) as responseType;

      if (!responseData.username && !responseData.Bearer) {
        setLoginError(responseData);
        setPassword('');
      } else {
        setUsername('');
        setPassword('');
        setLoginError({});
        const bearerToken = responseData.Bearer;
        if (bearerToken) handleToken(bearerToken);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <img src={loginImage} alt='image' />
        <div className={styles.formHeader}>
          <h2>Log in to your account</h2>
          <p>
            Don&apos;t have an account? <Link to='/signup'>Sign Up</Link>
          </p>
        </div>
        {/*eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form method='post' onSubmit={handleLogin} action='/'>
          <div className={styles.errorMessage}>
            {loginError.usernameError && loginError.usernameError}
            {loginError.passwordError && loginError.passwordError}
          </div>
          <div>
            <div>
              <label htmlFor='username'>Username: </label>
            </div>
            <div>
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
          </div>

          <div>
            <div>
              <label htmlFor='password'>Password: </label>
            </div>
            <div>
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
          </div>
          <div>
            <button>Log In</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

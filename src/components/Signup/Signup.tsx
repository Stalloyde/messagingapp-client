import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import signUpImage from '../../assets/pexels-ds-stories-6991386.jpg';
import { GetContext } from '../../utils/GetContext';

type responseType = {
  usernameError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
};

function Signup() {
  const [signUpError, setSignUpError] = useState<responseType>({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const { url } = GetContext();

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const responseData = (await response.json()) as responseType;

      if (
        responseData.usernameError ||
        responseData.passwordError ||
        responseData.confirmPasswordError
      ) {
        setSignUpError(responseData);
        setPassword('');
        setConfirmPassword('');
      } else {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setSignUpError({});
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <img src={signUpImage} alt='image' />

          <div className={styles.formHeader}>
            <h2>Create an account</h2>
            <p>
              Have an account? <Link to='/login'>Log in</Link>
            </p>
          </div>

          {/*eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form action='post' onSubmit={handleSignup}>
            <div className={styles.errorMessage}>
              {signUpError.usernameError && (
                <div>*{signUpError.usernameError}</div>
              )}
              {signUpError.passwordError && (
                <div>*{signUpError.passwordError}</div>
              )}
              {signUpError.confirmPasswordError && (
                <div>*{signUpError.confirmPasswordError}</div>
              )}
            </div>

            <div>
              <div>
                <label htmlFor='username'>Username: </label>
              </div>
              <div>
                <input
                  type='text'
                  id='username'
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  required
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
                  id='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <div>
                <label htmlFor='confirmPassword'>Confirm Password: </label>
              </div>
              <div>
                <input
                  type='password'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
            <div>
              <button>Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;

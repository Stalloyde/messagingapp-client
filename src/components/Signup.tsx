import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import signUpImage from '../assets/pexels-ds-stories-6991386.jpg';

function Signup() {
  const [signUpError, setSignUpError] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const responseData = await response.json();

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
        setSignUpError([]);
        navigate('/');
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <>
        <div className={styles.formContainer}>
          <img src={signUpImage} alt='image' />

          <div className={styles.formHeader}>
            <h2>Create an account</h2>
            <p>
              Have an account? <Link to='/login'>Log in</Link>
            </p>
          </div>

          <form action='post' onSubmit={handleSignup}>
            <div>
              <label htmlFor='username'>Username: </label>
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
            <div>
              <label htmlFor='password'>Password: </label>
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

            <div>
              <label htmlFor='confirmPassword'>Confirm Password: </label>
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
            <div>
              <button>Sign Up</button>
            </div>
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
          </form>
        </div>
      </>
    </>
  );
}

export default Signup;

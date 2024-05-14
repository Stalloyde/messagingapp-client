import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  function handleLogin() {
    alert('logging in');
  }

  return (
    <>
      <h2>Log in to your account</h2>
      <p>
        Don&apos;t have an account? <Link to='/signup'>Sign Up</Link>
      </p>

      <form action='post' onSubmit={handleLogin}>
        <label htmlFor='username'>Username</label>
        <input type='text' id='username' />

        <label htmlFor='password'>Password</label>
        <input type='password' id='password' />

        <button>Log In</button>
      </form>
    </>
  );
}

export default Login;

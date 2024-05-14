import { Link } from 'react-router-dom';

function Signup() {
  function handleSignup() {
    alert('Signing up');
  }

  return (
    <>
      <h2>Create an account</h2>
      <p>
        Have an account? <Link to='/login'>Log in here</Link>
      </p>

      <form action='post' onSubmit={handleSignup}>
        <label htmlFor='username'>Username</label>
        <input type='text' id='username' />

        <label htmlFor='password'>Password</label>
        <input type='password' id='password' />

        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input type='password' id='confirmPassword' />

        <button>Sign Up</button>
      </form>
    </>
  );
}

export default Signup;

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function EditModal({
  token,
  currentUser,
  setCurrentUser,
  isUsernameStatus,
  setIsEditingStatus,
  setIsEditingUsername,
}) {
  const [open, setOpen] = useState(true);
  const [usernameInputValue, setUsernameInputValue] = useState(
    currentUser.username,
  );
  const [statusInputValue, setStatusInputValue] = useState(currentUser.status);
  const navigate = useNavigate();

  function handleClose() {
    setOpen(false);
    setIsEditingStatus(false);
    setIsEditingUsername(false);
  }

  async function saveEdit() {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;
      const response = await fetch('http://localhost:3000/editProfile', {
        headers,
        method: 'PUT',
        body: JSON.stringify({
          newUsername: usernameInputValue,
          newStatus: statusInputValue,
        }),
      });

      if (response.statusText === 'Unauthorized') navigate('/login');
      const responseData = await response.json();

      setOpen(false);
      setIsEditingStatus(false);
      setIsEditingUsername(false);
      setCurrentUser(responseData);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (e) => {
          e.preventDefault();
          saveEdit();
        },
      }}>
      <DialogTitle>Edit Info</DialogTitle>
      <DialogContent>
        {isUsernameStatus ? (
          <TextField
            autoFocus
            required
            margin='dense'
            id='username'
            name='username'
            label='Username'
            type='text'
            fullWidth
            variant='standard'
            value={usernameInputValue}
            onChange={(e) => {
              setUsernameInputValue(e.target.value);
            }}
            sx={{
              '#username-label': {
                color: 'rgb(2, 95, 100)',
              },
            }}
          />
        ) : (
          <TextField
            autoFocus
            required
            margin='dense'
            id='status'
            name='status'
            label='Status'
            type='text'
            fullWidth
            variant='standard'
            value={statusInputValue}
            onChange={(e) => {
              setStatusInputValue(e.target.value);
            }}
            sx={{
              '#status-label': {
                color: 'rgb(2, 95, 100)',
              },
            }}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: 'rgb(2, 95, 100)',
          }}>
          Cancel
        </Button>
        <Button
          type='submit'
          sx={{
            color: 'rgb(2, 95, 100)',
          }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditModal;

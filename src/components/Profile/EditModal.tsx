import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

function EditModal({
  currentUser,
  isEditingStatus,
  isUsernameStatus,
  setIsEditingStatus,
  setIsEditingUsername,
}) {
  const [open, setOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    isEditingStatus
      ? setInputValue(currentUser.status)
      : setInputValue(currentUser.username);
  }, []);

  function handleClose() {
    setOpen(false);
    setIsEditingStatus(false);
    setIsEditingUsername(false);
  }

  function saveEdit() {
    alert('saving');
    setOpen(false);
    setIsEditingStatus(false);
    setIsEditingUsername(false);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (e) => {
          e.preventDefault();
          //   const formData = new FormData(e.currentTarget);
          //   const formJson = Object.fromEntries(formData.entries());
          //   const email = formJson.email;
          //   console.log(email);
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
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
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
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
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

import { FormEvent, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type HeadersType = {
  'Content-Type': string;
  Authorization?: string;
};

type messageType = {
  content: string;
  from: userPropType | string;
  to: userPropType | string;
};

type groupType = {
  _id: string;
  groupName: string;
  profilePic?: string;
  messages: messageType[];
};

type responseType = {
  error?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: string;
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type userPropType = {
  id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: string;
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type EditModalPropsType = {
  token?: string;
  currentUser?: userPropType;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<userPropType | undefined>
  >;
  isUsernameStatus: boolean;
  setIsEditingStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingUsername: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditModal({
  token,
  currentUser,
  setCurrentUser,
  isUsernameStatus,
  setIsEditingStatus,
  setIsEditingUsername,
}: EditModalPropsType) {
  const [open, setOpen] = useState(true);
  const [usernameInputValue, setUsernameInputValue] = useState('');
  const [statusInputValue, setStatusInputValue] = useState('');
  const navigate = useNavigate();

  function handleClose() {
    setOpen(false);
    setIsEditingStatus(false);
    setIsEditingUsername(false);
  }

  useEffect(() => {
    if (currentUser) {
      setUsernameInputValue(currentUser.username);
      setStatusInputValue(currentUser.status);
    }
  }, []);

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
      const responseData = (await response.json()) as responseType;

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
        onSubmit: (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          void saveEdit();
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

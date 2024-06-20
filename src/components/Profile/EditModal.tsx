import { FormEvent, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  styled,
} from '@mui/material';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';

type HeadersType = {
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
  profilePic: { url: string };
  messages: messageType[];
};

type responseType = {
  error?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type userPropType = {
  id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
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
  isEditingUsername: boolean;
  isEditingStatus: boolean;
  isEditingPic: boolean;
  setIsEditingStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingUsername: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingPic: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditModal({
  token,
  currentUser,
  setCurrentUser,
  isEditingStatus,
  setIsEditingStatus,
  isEditingUsername,
  setIsEditingUsername,
  isEditingPic,
  setIsEditingPic,
}: EditModalPropsType) {
  const [open, setOpen] = useState(true);
  const [usernameInputValue, setUsernameInputValue] = useState('');
  const [statusInputValue, setStatusInputValue] = useState('');
  const [image, setImage] = useState<undefined | File>();
  const navigate = useNavigate();

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  function handleClose() {
    setOpen(false);
    setIsEditingStatus(false);
    setIsEditingUsername(false);
    setIsEditingPic(false);
  }

  useEffect(() => {
    if (currentUser) {
      setUsernameInputValue(currentUser.username);
      setStatusInputValue(currentUser.status);
    }
  }, []);

  async function saveEdit() {
    const formData = new FormData();
    formData.append('newUsername', usernameInputValue);
    formData.append('newStatus', statusInputValue);
    if (image) formData.append('newProfilePic', image);

    try {
      const headers: HeadersType = {};

      if (token) headers.Authorization = token;
      const response = await fetch('http://localhost:3000/editProfile', {
        headers,
        method: 'PUT',
        body: formData,
      });

      if (response.statusText === 'Unauthorized') navigate('/login');
      const responseData = (await response.json()) as responseType;

      setOpen(false);
      setIsEditingStatus(false);
      setIsEditingUsername(false);
      setIsEditingPic(false);
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
        {isEditingUsername && (
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
        )}
        {isEditingStatus && (
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

        {isEditingPic && (
          <>
            <Button component='label' variant='contained' tabIndex={-1}>
              Upload Image
              <VisuallyHiddenInput
                type='file'
                accept='image/png, image/jpeg, image/*'
                onChange={handleImage}
              />
            </Button>
            <p className={styles.uploaded}>
              {image ? (
                <>
                  Uploaded: <em>{image.name} </em>
                </>
              ) : null}
            </p>
          </>
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

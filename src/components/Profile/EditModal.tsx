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
import { GetContext } from '../../utils/GetContext';
import { userType, groupType, messageType } from '../../utils/TypesDeclaration';

type responseType = {
  error?: string;
  username: string;
  status: string;
  contacts: userType[];
  profilePic: string | null;
  messages: messageType[];
  contactsRequestsFrom: userType[];
  contactsRequestsTo: userType[];
  groups: groupType[];
};

type EditModalPropsType = {
  isEditingUsername: boolean;
  isEditingStatus: boolean;
  isEditingPic: boolean;
  setIsEditingStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingUsername: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingPic: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditModal({
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

  const { token, currentUser, setCurrentUser, url } = GetContext();

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
      const headers = { Authorization: '' };
      if (token) headers.Authorization = token;

      const response = await fetch(`${url}/editProfile`, {
        headers,
        method: 'PUT',
        body: formData,
      });

      if (response.status === 401) navigate('/login');
      if (!response.ok)
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`,
        );

      const responseData = (await response.json()) as responseType;

      setOpen(false);
      setIsEditingStatus(false);
      setIsEditingUsername(false);
      setIsEditingPic(false);
      setCurrentUser(responseData);
    } catch (err) {
      console.error(err);
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
            disabled
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
          }}
          disabled>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditModal;

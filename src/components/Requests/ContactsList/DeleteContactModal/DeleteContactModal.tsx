import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DeleteContactModal.module.css';
import { Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

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
  profilePic: { url: string };
  messages: messageType[];
};

type userPropType = {
  _id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type responseType = {
  length?: number;
  usernameError?: string;
  error?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string };
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type DeleteContactModalPropsType = {
  setIsDeletingContact: React.Dispatch<React.SetStateAction<boolean>>;
  setContacts: React.Dispatch<React.SetStateAction<userPropType[]>>;
  token?: string;
  toDeleteId: string;
  setToDeleteId: React.Dispatch<React.SetStateAction<string>>;
};

function DeleteContactModal({
  setIsDeletingContact,
  setContacts,
  token,
  toDeleteId,
  setToDeleteId,
}: DeleteContactModalPropsType) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  async function deleteContact() {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;
      const response = await fetch(
        `https://messagingapp.fly.dev/requests/${toDeleteId}`,
        {
          headers,
          method: 'DELETE',
        },
      );

      if (response.statusText === 'Unauthorized') navigate('/login');
      const responseData = (await response.json()) as responseType;
      setContacts(responseData.contacts);
      setToDeleteId('');
      handleClose();
    } catch (err: unknown) {
      console.log(err.message);
    }
  }

  const handleClose = () => {
    setOpen(false);
    setIsDeletingContact(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <div>
        <DialogContent>
          <DialogContentText>
            <strong>Are you sure you want to delete contact?</strong>
          </DialogContentText>

          <div className={styles.buttonContainer}>
            <button onClick={handleClose}>Cancel</button>
            {/*eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button className={styles.yes} onClick={deleteContact}>
              Yes
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default DeleteContactModal;

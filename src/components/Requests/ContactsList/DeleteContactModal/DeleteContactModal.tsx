import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DeleteContactModal.module.css';
import { Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { GetContext } from '../../../../utils/GetContext';
import {
  HeadersType,
  messageType,
  groupType,
  userType,
} from '../../../../utils/TypesDeclaration';

type responseType = {
  length?: number;
  usernameError?: string;
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

type DeleteContactModalPropsType = {
  setIsDeletingContact: React.Dispatch<React.SetStateAction<boolean>>;
  toDeleteId: string;
  setToDeleteId: React.Dispatch<React.SetStateAction<string>>;
};

function DeleteContactModal({
  setIsDeletingContact,
  toDeleteId,
  setToDeleteId,
}: DeleteContactModalPropsType) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const { token, setCurrentUser, url } = GetContext();

  async function deleteContact() {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;
      const response = await fetch(`${url}/requests/${toDeleteId}`, {
        headers,
        method: 'DELETE',
      });
      if (response.status === 401) navigate('/login');
      if (!response.ok)
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`,
        );

      const responseData = (await response.json()) as responseType;
      setCurrentUser(responseData);
      setToDeleteId('');
      handleClose();
    } catch (err) {
      console.error(err);
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
            <button className={styles.yes} onClick={deleteContact} disabled>
              Yes
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default DeleteContactModal;

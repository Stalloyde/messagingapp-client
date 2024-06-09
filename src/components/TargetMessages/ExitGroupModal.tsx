import { useState } from 'react';
import styles from './ExitGroupModal.module.css';
import { useParams } from 'react-router-dom';
import { Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

function ExitGroupModal({ setIsExitingGroup, setContacts, token }) {
  const [open, setOpen] = useState(true);
  const targetMessagesId = useParams().id;

  const handleClose = () => {
    setOpen(false);
    setIsExitingGroup(false);
  };

  async function exitGroup() {
    handleClose();

    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;
      const response = await fetch(
        `http://localhost:3000/messages/${targetMessagesId}/exit-group`,
        {
          headers,
          method: 'put',
        },
      );
      if (response.statusText === 'Unauthorized') navigate('/login');

      const responseData = await response.json();
      if (responseData.error) navigate('/login');
      setContacts(responseData.contacts);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <div>
        <DialogContent>
          <DialogContentText>
            <strong>Are you sure you want to leave the group?</strong>
          </DialogContentText>
          <DialogContentText>
            <em>There isn't a re-join group feature.</em>
          </DialogContentText>

          <div className={styles.buttonContainer}>
            <button onClick={handleClose}>Cancel</button>
            <button className={styles.yes} onClick={exitGroup}>
              Yes
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default ExitGroupModal;

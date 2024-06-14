import { useState } from 'react';
import styles from './DeleteContactModal.module.css';
import { Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

function DeleteContactModal({
  setIsDeletingContact,
  setContacts,
  token,
  toDeleteId,
  setToDeleteId,
}) {
  const [open, setOpen] = useState(true);

  async function deleteContact() {
    try {
      const headers: HeadersType = {
        'Content-Type': 'application/json',
      };

      if (token) headers.Authorization = token;
      const response = await fetch(
        `http://localhost:3000/requests/${toDeleteId}`,
        {
          headers,
          method: 'DELETE',
        },
      );

      if (response.statusText === 'Unauthorized') navigate('/login');
      const responseData = await response.json();
      setContacts(responseData);
      setToDeleteId('');
      handleClose();
    } catch (err) {
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

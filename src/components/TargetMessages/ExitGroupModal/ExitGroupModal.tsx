import { useState } from 'react';
import styles from './ExitGroupModal.module.css';
import { useParams, useNavigate } from 'react-router-dom';
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

type groupType = {
  _id: string;
  groupName: string;
  profilePic?: string;
  messages: messageType[];
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

type ExitGroupModalPropsType = {
  token?: string;
  setIsExitingGroup: React.Dispatch<React.SetStateAction<boolean>>;
  setContacts: React.Dispatch<React.SetStateAction<userPropType[]>>;
};

function ExitGroupModal({
  setIsExitingGroup,
  setContacts,
  token,
}: ExitGroupModalPropsType) {
  const [open, setOpen] = useState(true);
  const targetMessagesId = useParams().id;
  const navigate = useNavigate();

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

      const responseData = (await response.json()) as responseType;
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
            {/*eslint-disable-next-line @typescript-eslint/no-misused-promises */}
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

import { useState } from 'react';
import styles from './Profile.module.css';
import editIcon from '../../assets/icons8-edit-50.png';
import changeImageIcon from '../../assets/icons8-add-50.png';
import defaultAvatar from '../../assets/icons8-avatar-50.png';
import usernameIcon from '../../assets/icons8-username-32.png';
import statusIcon from '../../assets/icons8-info-50.png';
import EditModal from './EditModal';

function Profile({ token, currentUser, setCurrentUser }) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  function toggleIsEditing(target) {
    if (target === 'username') setIsEditingUsername(!isEditingUsername);
    if (target === 'status') setIsEditingStatus(!isEditingStatus);
  }

  return (
    <>
      <div className={styles.rightHeader}>
        <strong>Profile</strong>
      </div>

      {!currentUser && <div className={styles.loadingMessage}>Loading...</div>}
      {currentUser && (
        <div className={styles.container}>
          {(isEditingStatus && !isEditingUsername) ||
          (isEditingUsername && !isEditingStatus) ? (
            <EditModal
              token={token}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              isUsernameStatus={isEditingUsername}
              setIsEditingStatus={setIsEditingStatus}
              setIsEditingUsername={setIsEditingUsername}
            />
          ) : null}

          <div className={styles.profilePicContainer}>
            {!currentUser.profilePic ? (
              <img
                src={defaultAvatar}
                alt='profile-pic'
                className={styles.profilePic}
              />
            ) : (
              <img
                src={currentUser.profilePic}
                alt='profile-pic'
                className={styles.profilePic}
              />
            )}
            <div className={styles.editIconContainer}>
              <img
                src={changeImageIcon}
                alt='change-image'
                className={styles.icons}
              />
            </div>
          </div>

          <div className={styles.usernameContainer}>
            <div>
              <img
                src={usernameIcon}
                alt='username-icon'
                className={styles.icons}
              />
            </div>
            <strong>Username:</strong>
            <div>{currentUser.username}</div>
            <div className={styles.editIconContainer}>
              <img
                src={editIcon}
                alt='edit'
                className={styles.icons}
                onClick={() => {
                  toggleIsEditing('username');
                }}
              />
            </div>
            <em>This is also your login username</em>
          </div>

          <div className={styles.statusContainer}>
            <div>
              <img
                src={statusIcon}
                alt='status-icon'
                className={styles.icons}
              />
            </div>
            <strong>Status:</strong>
            {currentUser.status ? (
              <div>{currentUser.status}</div>
            ) : (
              <div>-</div>
            )}
            <div className={styles.editIconContainer}>
              <img
                src={editIcon}
                alt='edit'
                className={styles.icons}
                onClick={() => {
                  toggleIsEditing('status');
                }}
              />
            </div>
            <em>This shows up when other users search for your username</em>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;

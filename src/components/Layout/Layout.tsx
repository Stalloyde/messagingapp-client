import Messages from '../Messages/Messages';
import LeftHeader from './LeftHeader/LeftHeader';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

type messageType = {
  content: string;
  from: userPropType | string;
  to: userPropType | string;
};

type groupType = {
  _id: string;
  groupName: string;
  profilePic: { url: string } | null;
  messages: messageType[];
};

type userPropType = {
  id?: string;
  username: string;
  status: string;
  contacts: userPropType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests: userPropType[];
  groups: groupType[];
};

type LayoutPropsType = {
  token?: string;
  currentUser?: userPropType;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<userPropType | undefined>
  >;
  contacts: userPropType[];
  contactsRequests: userPropType[];
};

function Layout({
  token,
  currentUser,
  setCurrentUser,
  contacts,
  contactsRequests,
}: LayoutPropsType) {
  return (
    <>
      <div className={styles.left}>
        <section>
          <LeftHeader
            token={token}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            contactsRequests={contactsRequests}
            contacts={contacts}
          />
          <Messages
            token={token}
            contacts={contacts}
            contactsRequests={contactsRequests}
          />
        </section>
      </div>

      <div className={styles.right}>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;

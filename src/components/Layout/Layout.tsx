import PreviewMessages from './PreviewMessages/PreviewMessages';
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

function Layout() {
  return (
    <>
      <div className={styles.left}>
        <section>
          <LeftHeader />
          <PreviewMessages />
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

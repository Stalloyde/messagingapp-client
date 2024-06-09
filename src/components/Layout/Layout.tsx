import Messages from '../Messages/Messages';
import LeftHeader from './LeftHeader/LeftHeader';

import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

type LayoutProps = {
  token: string;
};

function Layout({
  token,
  setCurrentUser,
  contacts,
  contactsRequests,
}: LayoutProps) {
  return (
    <>
      <div className={styles.left}>
        <section>
          <LeftHeader
            token={token}
            setCurrentUser={setCurrentUser}
            contactsRequests={contactsRequests}
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

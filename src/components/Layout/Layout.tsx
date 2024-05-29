import Messages from '../Messages/Messages';
import LeftHeader from './LeftHeader/LeftHeader';
import styles from './Layout.module.css';

type LayoutProps = {
  children?: React.ReactNode;
  token: string;
};

function Layout({
  children,
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
          {children ? (
            <>{children}</>
          ) : (
            <div className={styles.welcome}>Welcome to the Messaging App</div>
          )}
        </main>
      </div>
    </>
  );
}

export default Layout;

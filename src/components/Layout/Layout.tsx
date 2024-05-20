import Messages from '../Messages/Messages';
import LeftHeader from '../LeftHeader/LeftHeader';
import styles from './Layout.module.css';

type LayoutProps = {
  children?: React.ReactNode;
  token: string;
};

function Layout({ children, token }: LayoutProps) {
  return (
    <>
      <div className={styles.left}>
        <section>
          <LeftHeader token={token} />
          <Messages token={token} />
        </section>
      </div>

      <div className={styles.right}>
        <main>
          {children ? (
            <div>{children}</div>
          ) : (
            <div>Hello to the Messaging App</div>
          )}
        </main>
      </div>
    </>
  );
}

export default Layout;

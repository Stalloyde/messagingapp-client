import PreviewMessages from './PreviewMessages/PreviewMessages';
import LeftHeader from './LeftHeader/LeftHeader';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

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

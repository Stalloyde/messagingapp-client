import Messages from './Messages';

function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Messages />
      {children && <main>{children}</main>}
      {!children && <main>Hello to the Messaging App</main>}
    </>
  );
}

export default Layout;

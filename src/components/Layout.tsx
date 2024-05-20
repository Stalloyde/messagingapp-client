import Messages from './Messages';

type LayoutProps = {
  children?: React.ReactNode;
  currentUserId: string;
};

function Layout({ children, currentUserId, token }: LayoutProps) {
  return (
    <>
      <Messages currentUserId={currentUserId} token={token} />
      {children ? (
        <main>{children}</main>
      ) : (
        <main>Hello to the Messaging App</main>
      )}
    </>
  );
}

export default Layout;

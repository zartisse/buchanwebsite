import { Outlet } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { ChatWidget } from '../public/chat/ChatWidget';

export function PublicLayout() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
      <ChatWidget />
    </>
  );
}

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { ChatWidget } from '../public/chat/ChatWidget';

export function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';
  }, [pathname]);

  return (
    <>
      <a className="skipLink" href="#main-content">
        Skip to content
      </a>
      <Nav />
      <Outlet />
      <Footer />
      <ChatWidget />
    </>
  );
}

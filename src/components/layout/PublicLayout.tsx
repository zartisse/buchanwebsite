import { Outlet } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { CustomCursor } from '../ui/CustomCursor';

export function PublicLayout() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}

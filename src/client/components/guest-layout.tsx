import { Outlet } from 'react-router';
import Footer from './footer';

export default function GuestLayout() {
  return (
    <div className="flex h-dvh flex-col">
      <main className="flex w-full flex-1 items-center justify-center md:mx-auto md:max-w-5xl">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

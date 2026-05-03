import { Outlet } from 'react-router';
import Footer from './footer';
import Header from './header';

export default function GuestLayout() {
  return (
    <div className="flex h-dvh flex-col bg-neutral-50 dark:bg-neutral-950">
      <div className="pointer-events-none opacity-0">
        <Header />
      </div>
      <main className="flex w-full flex-1 items-center justify-center p-3 md:mx-auto md:max-w-5xl">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

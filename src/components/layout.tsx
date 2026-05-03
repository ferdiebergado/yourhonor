import { Outlet } from 'react-router';
import Footer from './footer';
import Header from './header';

export default function Layout() {
  return (
    <div className="flex h-dvh flex-col bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <main className="w-full flex-1 px-3 pt-4 md:mx-auto md:max-w-5xl">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

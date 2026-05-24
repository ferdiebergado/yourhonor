import config from '@/config';
import Logo from './logo';

export default function SplashScreen() {
  return (
    <section className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <h1 className="font-heading flex animate-pulse items-center justify-center gap-1 text-center text-3xl font-bold text-shadow-lg">
        <Logo />
        {config.appTitle}
      </h1>
    </section>
  );
}

import config from '@/config';

export default function SplashScreen() {
  return (
    <section className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <h1 className="font-heading text-destructive animate-pulse text-center text-4xl font-bold text-shadow-lg">
        {config.appTitle}
      </h1>
    </section>
  );
}

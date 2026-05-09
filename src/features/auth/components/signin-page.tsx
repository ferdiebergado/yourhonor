import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import SigninButton from './signin-button';

export default function SigninPage() {
  return (
    <Card className="w-full px-6 py-10 md:max-w-xl">
      <CardContent className="flex flex-col items-center gap-10">
        <h1 className="font-heading text-center text-3xl font-semibold text-balance">
          Welcome to {config.appTitle}
        </h1>
        <h2 className="text-center text-lg text-balance">
          Automate the complexity of honorarium payments. YourHonor ensures every honorarium is
          accurate, timely, and stress-free.
        </h2>
        <SigninButton />
        <p className="text-muted-foreground text-center text-sm text-balance">
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  );
}

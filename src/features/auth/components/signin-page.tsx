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
          Say goodbye to headaches when preparing payments for honoraria. YourHonor is here to
          streamline these tasks.
        </h2>
        <SigninButton />
      </CardContent>
    </Card>
  );
}

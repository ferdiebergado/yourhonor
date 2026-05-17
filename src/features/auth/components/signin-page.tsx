import PrivacyLink from '@/components/privacy-link';
import TermsLink from '@/components/terms-link';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import SigninButton from './signin-button';

export default function SigninPage() {
  return (
    <Card className="border-border/40 m-3 w-full max-w-md overflow-hidden shadow-2xl md:m-0">
      <CardContent className="flex flex-col items-center space-y-6 p-8 sm:p-10">
        {/* Stylized Logo */}
        <div className="font-heading mb-2 flex items-center gap-2 tracking-tight">
          <div className="bg-destructive text-background rounded-lg px-3 text-center text-2xl font-bold">
            YH
          </div>
          <div className="text-2xl font-bold">{config.appTitle}</div>
        </div>

        {/* Heading */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to {config.appTitle}
          </h1>
          <p className="text-muted-foreground max-w-xs leading-relaxed">
            Automate the complexity of honorarium payments. YourHonor ensures every honorarium is
            accurate, timely, and stress-free.
          </p>
        </div>

        {/* Sign In Button */}
        <SigninButton />

        {/* Legal Footer */}
        <p className="text-muted-foreground mt-4 text-center text-xs">
          By clicking continue, you agree to our <TermsLink /> and <PrivacyLink />.
        </p>
      </CardContent>
    </Card>
  );
}

import { RiGoogleFill } from '@remixicon/react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';

import Logo from '@client/components/logo';
import PrivacyLink from '@client/components/privacy-link';
import TermsLink from '@client/components/terms-link';
import { buttonVariants } from '@client/components/ui/button';
import { Card, CardContent } from '@client/components/ui/card';
import config from '@client/config';

export default function SigninPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error') ?? 'Signin failed.';

  useEffect(() => {
    toast.error(error);
  }, [error]);

  return (
    <Card className="border-border/40 m-3 w-full max-w-md overflow-hidden md:m-0">
      <CardContent className="flex flex-col items-center space-y-6 p-8 sm:p-10">
        {/* Stylized Logo */}
        <div className="font-heading mb-2 flex items-center gap-2 tracking-tight">
          <Logo />
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
        <a href="/api/signin" className={buttonVariants({ variant: 'default', size: 'lg' })}>
          <RiGoogleFill className="size-5" data-icon="inline-start" /> Continue with Google
        </a>

        {/* Legal Footer */}
        <p className="text-muted-foreground mt-4 text-center text-xs">
          By clicking continue, you agree to our <TermsLink /> and <PrivacyLink />.
        </p>
      </CardContent>
    </Card>
  );
}

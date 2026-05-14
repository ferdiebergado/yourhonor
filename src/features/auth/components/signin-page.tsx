import { RiShieldCheckFill } from '@remixicon/react';
import { Link } from 'react-router';

import { paths } from '@/app/routes';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import SigninButton from './signin-button';

export default function SigninPage() {
  return (
    <div className="to-muted flex items-center justify-center">
      <Card className="border-border/40 w-full max-w-md overflow-hidden rounded-2xl shadow-2xl">
        <CardContent className="flex flex-col items-center space-y-6 p-8 sm:p-10">
          {/* Stylized Logo */}
          <div className="mb-2 flex items-center gap-3">
            <RiShieldCheckFill className="text-primary h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">{config.appTitle}</span>
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
          <div className="mt-2 w-full">
            <SigninButton />
          </div>

          {/* Legal Footer */}
          <p className="text-muted-foreground mt-4 text-center text-xs">
            By clicking continue, you agree to our{' '}
            <Link to={paths.terms} className="hover:text-primary underline underline-offset-4">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to={paths.privacy} className="hover:text-primary underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import {
  RiComputerLine,
  RiLoader2Line,
  RiLogoutBoxLine,
  RiMoonClearLine,
  RiSunLine,
} from '@remixicon/react';
import { Link } from 'react-router';
import { toast } from 'sonner';

import { paths } from '@/app/routes';
import config from '@/config';
import { useSignout } from '@/features/auth/hooks';
import { useTheme } from '@/features/theme';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

export default function Header() {
  const { setTheme } = useTheme();
  const { isPending, mutate: signout } = useSignout();

  const handleSignout = () => {
    signout(undefined, { onSuccess: () => toast.success('Successfully signed out!') });
  };

  return (
    <header className="bg-background w-full shadow">
      <div className="flex items-center justify-between px-8 py-4 md:mx-auto md:max-w-5xl">
        <h1 className="font-heading text-2xl font-bold">{config.appTitle}</h1>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link to={paths.home}>Dashboard</Link>}
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link to={paths.activities}>My Activities</Link>}
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Theme</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-50">
                  <li>
                    <NavigationMenuLink onClick={() => setTheme('light')}>
                      <RiSunLine data-icon="inline-start" />
                      Light
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink onClick={() => setTheme('dark')}>
                      <RiMoonClearLine data-icon="inline-start" />
                      Dark
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink onClick={() => setTheme('system')}>
                      <RiComputerLine data-icon="inline-start" />
                      System
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Account</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-50">
                  <li>
                    <NavigationMenuLink onClick={handleSignout}>
                      {isPending ? (
                        <>
                          <RiLoader2Line className="animate-spin" data-icon="inline-start" />
                          Signing out...
                        </>
                      ) : (
                        <>
                          <RiLogoutBoxLine data-icon="inline-start" />
                          Sign Out
                        </>
                      )}
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

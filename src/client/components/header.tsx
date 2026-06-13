import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';

import { paths } from '@client/app/routes';
import config from '@client/config';
import { fetchActivitiesOptions } from '@client/features/activity/hooks';
import UserMenu from '@client/features/auth/components/user-menu';
import { ThemeMenu } from '@client/features/theme/theme-menu';
import Logo from './logo';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

export default function Header() {
  const queryClient = useQueryClient();

  return (
    <header className="bg-background mb-10 w-full shadow">
      <div className="flex items-center justify-between px-8 py-4 md:mx-auto md:max-w-5xl">
        <h1 className="font-heading flex gap-1 text-2xl font-bold tracking-tight">
          <Logo />
          {config.appTitle}
        </h1>

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
                onMouseEnter={() => queryClient.prefetchQuery(fetchActivitiesOptions())}
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ThemeMenu />
            </NavigationMenuItem>
            <NavigationMenuItem className="ml-3 flex items-center">
              <UserMenu />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

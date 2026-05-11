import { Link } from 'react-router';

import { paths } from '@/app/routes';
import config from '@/config';
import { ModeToggle } from '@/features/theme/mode-toggle';
import SignoutButton from './signout-button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

export default function Header() {
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
              <ModeToggle />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <SignoutButton />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

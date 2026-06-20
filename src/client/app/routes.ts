import { lazy } from 'react';
import type { RouteObject } from 'react-router';

import GuestLayout from '@client/components/guest-layout';
import RequireGuest from '@client/features/auth/components/require-guest';
import SigninPage from '@client/features/auth/components/signin-page';

const RequireUser = lazy(() => import('@client/features/auth/components/require-user'));
const Layout = lazy(() => import('@client/components/layout'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Activities = lazy(() => import('@client/features/activity/components/activities'));
const ActivityPage = lazy(() => import('@client/features/activity/components/activity-page'));
const NewActivityPage = lazy(
  () => import('@client/features/activity/components/new-activity-page')
);
const EditActivityPage = lazy(
  () => import('@client/features/activity/components/edit-activity-page')
);
const HonorariumFormPage = lazy(
  () => import('@client/features/honorarium/components/honorarium-form-page')
);
const TermsPage = lazy(() => import('@client/features/auth/components/terms-page'));
const PrivacyPage = lazy(() => import('@client/features/auth/components/privacy-page'));
const PageNotFound = lazy(() => import('./pages/not-found'));

export const paths = {
  home: '/',
  signin: '/signin',
  signout: '/signout',
  oauthCallback: '/oauthcallback',
  me: '/me',
  activities: '/activities',
  activity: '/activity/:code',
  newActivity: '/activities/new',
  editActivity: '/activities/:code/edit',
  newHonorarium: '/activities/:code/honoraria/new',
  terms: '/terms',
  privacy: '/privacy',
} as const;

export const routes: RouteObject[] = [
  {
    Component: GuestLayout,
    children: [
      {
        Component: RequireGuest,
        children: [
          {
            path: paths.signin,
            Component: SigninPage,
          },
        ],
      },
    ],
  },
  {
    Component: Layout,
    children: [
      {
        Component: RequireUser,
        children: [
          {
            path: paths.home,
            Component: Dashboard,
          },
          {
            path: paths.activities,
            Component: Activities,
          },
          {
            path: paths.activity,
            Component: ActivityPage,
          },
          {
            path: paths.newActivity,
            Component: NewActivityPage,
          },
          {
            path: paths.editActivity,
            Component: EditActivityPage,
          },
          {
            path: paths.newHonorarium,
            Component: HonorariumFormPage,
          },
        ],
      },
    ],
  },
  {
    path: paths.terms,
    Component: TermsPage,
  },
  {
    path: paths.privacy,
    Component: PrivacyPage,
  },
  {
    path: '/*',
    Component: PageNotFound,
  },
];

import { lazy } from 'react';
import type { RouteObject } from 'react-router';

import GuestLayout from '@/components/guest-layout';
import Layout from '@/components/layout';
import OauthCallback from '@/features/auth/components/oauth-callback';
import RequireGuest from '@/features/auth/components/require-guest';
import RequireUser from '@/features/auth/components/require-user';
import SigninPage from '@/features/auth/components/signin-page';
import Dashboard from './dashboard';
import PageNotFound from './not-found';

const Activities = lazy(() => import('@/features/activity/components/activities'));
const ActivityPage = lazy(() => import('@/features/activity/components/activity-page'));
const TermsPage = lazy(() => import('@/features/auth/components/terms-page'));
const PrivacyPage = lazy(() => import('@/features/auth/components/privacy-page'));

export const paths = {
  home: '/',
  signin: '/signin',
  signout: '/signout',
  oauthCallback: '/oauthcallback',
  me: '/me',
  activities: '/activities',
  activity: '/activity/:code',
  terms: '/terms',
  privacy: '/privacy',
};

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
          {
            path: paths.oauthCallback,
            Component: OauthCallback,
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

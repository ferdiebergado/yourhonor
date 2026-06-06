import { lazy } from 'react';
import type { RouteObject } from 'react-router';

import GuestLayout from '@/components/guest-layout';
import RequireGuest from '@/features/auth/components/require-guest';
import SigninPage from '@/features/auth/components/signin-page';

const OauthCallback = lazy(() => import('@/features/auth/components/oauth-callback'));
const RequireUser = lazy(() => import('@/features/auth/components/require-user'));
const Layout = lazy(() => import('@/components/layout'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Activities = lazy(() => import('@/features/activity/components/activities'));
const ActivityFormPage = lazy(() => import('@/features/activity/components/activity-form-page'));
const ActivityPage = lazy(() => import('@/features/activity/components/activity-page'));
const HonorariumFormPage = lazy(
  () => import('@/features/honorarium/components/honorarium-form-page')
);
const TermsPage = lazy(() => import('@/features/auth/components/terms-page'));
const PrivacyPage = lazy(() => import('@/features/auth/components/privacy-page'));
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
          {
            path: paths.newActivity,
            Component: ActivityFormPage,
          },
          {
            path: paths.editActivity,
            Component: ActivityFormPage,
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

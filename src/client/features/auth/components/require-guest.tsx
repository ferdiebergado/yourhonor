import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { paths } from '@client/app/routes';
import { useMe } from '../hooks';

export default function RequireGuest() {
  const { data: user } = useMe();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) void navigate(state?.from ?? paths.home, { replace: true });
  }, [navigate, state?.from, user]);

  if (user) return null;

  return <Outlet />;
}

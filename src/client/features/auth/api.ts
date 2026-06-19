import { paths } from '@client/app/routes';
import { api } from '@client/lib/http-client';
import type { Profile } from '@shared/schemas/user';

export const signout = async (): Promise<undefined | null> => await api.post(paths.signout);

export const fetchMe = async (): Promise<Profile | null> => await api.get(paths.me);

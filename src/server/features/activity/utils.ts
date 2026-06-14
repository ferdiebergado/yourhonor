import { getFullName } from '@shared/utils';

export const formatName = ({
  firstname,
  mi,
  lastname,
}: {
  firstname: string;
  mi?: string | null;
  lastname: string;
}) =>
  getFullName({
    firstname,
    mi,
    lastname,
  }).toLocaleUpperCase();

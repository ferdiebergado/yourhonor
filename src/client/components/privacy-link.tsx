import { Link } from 'react-router';

import { paths } from '@client/app/routes';

export default function PrivacyLink() {
  return (
    <Link to={paths.privacy} className="hover:text-primary underline underline-offset-4">
      Privacy Policy
    </Link>
  );
}

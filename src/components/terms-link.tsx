import { Link } from 'react-router';

import { paths } from '@/app/routes';

export default function TermsLink() {
  return (
    <Link to={paths.terms} className="hover:text-primary underline underline-offset-4">
      Terms of Service
    </Link>
  );
}

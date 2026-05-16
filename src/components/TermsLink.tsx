import { paths } from '@/app/routes';
import { Link } from 'react-router';

export default function TermsLink() {
  return (
    <Link to={paths.terms} className="hover:text-primary underline underline-offset-4">
      Terms of Service
    </Link>
  );
}

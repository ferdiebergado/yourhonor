import { paths } from '@/app/routes';
import { Link } from 'react-router';

export default function PrivacyLink() {
  return (
    <Link to={paths.privacy} className="hover:text-primary underline underline-offset-4">
      Privacy Policy
    </Link>
  );
}

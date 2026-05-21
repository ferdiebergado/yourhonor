import PrivacyLink from './privacy-link';
import TermsLink from './terms-link';

export default function Footer() {
  return (
    <footer className="text-muted-foreground bg-secondary mt-5 space-y-5 p-5 text-center text-sm">
      <p>
        <TermsLink /> | <PrivacyLink />
      </p>
      <p>&copy; 2026 to present by ferdie bergado.</p>
    </footer>
  );
}

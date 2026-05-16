import PrivacyLink from './PrivacyLink';
import TermsLink from './TermsLink';

export default function Footer() {
  return (
    <div className="text-muted-foreground bg-secondary space-y-5 p-5 text-center text-sm">
      <p>
        <TermsLink /> | <PrivacyLink />
      </p>
      <p>&copy; 2026 to present by ferdie bergado.</p>
    </div>
  );
}

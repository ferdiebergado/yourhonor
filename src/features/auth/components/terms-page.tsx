import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <Card className="mx-auto my-15 max-w-prose p-15">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          <h1>Terms of Service</h1>
        </CardTitle>
        <CardDescription>
          <strong>Last updated:</strong> May 14, 2026
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p>
          These Terms of Service ("Terms") govern your access to and use of the YourHonor
          application ("Service"), provided by YourHonor ("we", "us", or "our"). By accessing or
          using the Service, you agree to be bound by these Terms. If you disagree with any part of
          the terms, you may not access the Service.
        </p>

        <h2 className="text-lg font-semibold">1. Use of Service</h2>
        <p>
          The Service is an administrative tool designed for managing honorarium payments and
          related financial data. You agree to use the Service only for its intended purpose and in
          compliance with all applicable laws and regulations.
        </p>

        <h2 className="text-lg font-semibold">2. Account Registration</h2>
        <p>
          Access to the Service requires a Google account for authentication. By registering, you
          agree to provide accurate and complete information. You are responsible for maintaining
          the confidentiality of your account and for all activities that occur under your account.
        </p>

        <h2 className="text-lg font-semibold">3. Data Accuracy</h2>
        <p>
          You are solely responsible for the accuracy, completeness, and validity of any data you
          provide to the Service, including but not limited to payee information, bank account
          details, and activity descriptions. We are not liable for any errors or omissions in
          user-provided data.
        </p>

        <h2 className="text-lg font-semibold">4. Prohibited Activities</h2>
        <p>You agree not to engage in any activity that:</p>
        <ul>
          <li>Violates any applicable law or regulation.</li>
          <li>Attempts to gain unauthorized access to the Service or its systems.</li>
          <li>Interferes with or disrupts the Service or servers.</li>
          <li>Uses the Service for any fraudulent or malicious purpose.</li>
        </ul>

        <h2 className="text-lg font-semibold">5. Intellectual Property</h2>
        <p>
          All content, features, and functionality of the Service are owned by YourHonor and are
          protected by intellectual property laws. You may not reproduce, distribute, modify, or
          create derivative works of any part of the Service without our express written permission.
        </p>

        <h2 className="text-lg font-semibold">6. Disclaimer of Warranties</h2>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. YourHonor expressly
          disclaims all warranties of any kind, whether express or implied, including, but not
          limited to, the implied warranties of merchantability, fitness for a particular purpose,
          and non-infringement.
        </p>

        <h2 className="text-lg font-semibold">7. Limitation of Liability</h2>
        <p>
          In no event shall YourHonor, its directors, employees, partners, agents, suppliers, or
          affiliates, be liable for any indirect, incidental, special, consequential, or punitive
          damages, including without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from:
        </p>
        <ul>
          <li>Your access to or use of or inability to access or use the Service.</li>
          <li>Any conduct or content of any third party.</li>
          <li>Any content obtained from the Service.</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
        </ul>
        <p>
          Our total liability for any claim arising out of or relating to these Terms or the Service
          shall not exceed the greater of the amount paid by you, if any, for accessing the Service
          or One Hundred Philippine Pesos (PHP 100.00).
        </p>

        <h2 className="text-lg font-semibold">8. Termination</h2>
        <p>
          We may terminate or suspend access to the Service immediately, without prior notice or
          liability, for any reason whatsoever, including without limitation if you breach the
          Terms. Upon termination, your right to use the Service will immediately cease.
        </p>

        <h2 className="text-lg font-semibold">9. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the
          Philippines, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-lg font-semibold">10. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any
          time. We will provide notice of any changes by updating the "Last updated" date at the top
          of this page. Your continued use of the Service after any such changes constitutes your
          acceptance of the new Terms.
        </p>

        <h2 className="text-lg font-semibold">11. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{' '}
          <a href="mailto:support@yourhonor.ph">support@yourhonor.ph</a>.
        </p>
      </CardContent>
    </Card>
  );
}

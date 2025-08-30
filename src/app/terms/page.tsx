import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-700">
            <img src="/logo.png" alt="InfinityStack" className="h-8 w-8 mr-3" />
            <span className="text-xl font-bold">InfinityStack</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose prose-lg max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using InfinityStack&apos;s services, you accept and agree to be bound by the terms and provision 
            of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            InfinityStack provides an enterprise cloud platform that offers scalable, secure, and intelligent 
            infrastructure solutions for modern businesses, including multi-tenant architecture, advanced analytics, 
            and enterprise-grade security features.
          </p>

          <h2>3. User Accounts</h2>
          <h3>3.1 Account Creation</h3>
          <ul>
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
          </ul>

          <h3>3.2 Account Responsibilities</h3>
          <ul>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You must not share your account credentials with others</li>
            <li>You must comply with all applicable laws and regulations</li>
          </ul>

          <h2>4. Acceptable Use Policy</h2>
          <p>You agree not to use the service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit malicious code or conduct security attacks</li>
            <li>Interfere with or disrupt the service</li>
            <li>Use the service for unauthorized commercial purposes</li>
            <li>Attempt to gain unauthorized access to other accounts or systems</li>
          </ul>

          <h2>5. Service Availability</h2>
          <p>
            We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance, 
            updates, or modifications that may temporarily affect service availability.
          </p>

          <h2>6. Data and Privacy</h2>
          <ul>
            <li>You retain ownership of your data</li>
            <li>We implement enterprise-grade security measures to protect your data</li>
            <li>Our data practices are governed by our Privacy Policy</li>
            <li>You are responsible for backing up your critical data</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            The InfinityStack platform, including all software, designs, text, graphics, and other content, is owned by 
            InfinityStack and is protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2>8. Payment Terms</h2>
          <h3>8.1 Subscription Fees</h3>
          <ul>
            <li>Subscription fees are billed in advance on a monthly or annual basis</li>
            <li>All fees are non-refundable unless otherwise specified</li>
            <li>We may change our pricing with 30 days&apos; notice</li>
          </ul>

          <h3>8.2 Payment Processing</h3>
          <ul>
            <li>Payments are processed securely through third-party providers</li>
            <li>You authorize us to charge your payment method for all applicable fees</li>
            <li>Failure to pay may result in service suspension or termination</li>
          </ul>

          <h2>9. Termination</h2>
          <h3>9.1 Termination by You</h3>
          <p>You may terminate your account at any time by contacting our support team.</p>

          <h3>9.2 Termination by Us</h3>
          <p>We may terminate or suspend your account if you:</p>
          <ul>
            <li>Violate these terms of service</li>
            <li>Fail to pay applicable fees</li>
            <li>Engage in prohibited activities</li>
            <li>Pose a security risk to our platform</li>
          </ul>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, InfinityStack shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless InfinityStack from any claims, damages, or expenses arising from 
            your use of the service or violation of these terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the jurisdiction where 
            InfinityStack is incorporated, without regard to conflict of law principles.
          </p>

          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of significant changes via 
            email or through our platform. Continued use of the service constitutes acceptance of the modified terms.
          </p>

          <h2>14. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <ul>
            <li>Email: legal@infinitystack.com</li>
            <li>Support: support@infinitystack.com</li>
            <li>Address: InfinityStack, Inc.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
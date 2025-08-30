import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-700">
            <img src="/logo.png" alt="InfinityStack" className="h-8 w-8 mr-3" />
            <span className="text-xl font-bold">InfinityStack</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose prose-lg max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            InfinityStack collects information you provide directly to us, such as when you create an account, 
            use our services, or contact us for support.
          </p>
          
          <h3>1.1 Personal Information</h3>
          <ul>
            <li>Name and email address</li>
            <li>Company information</li>
            <li>Phone number (optional)</li>
            <li>Profile information</li>
          </ul>

          <h3>1.2 Usage Information</h3>
          <ul>
            <li>Log data and analytics</li>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Service usage patterns</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect and prevent fraudulent activities</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
            except as described in this policy:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>With trusted service providers under strict confidentiality agreements</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. Our security measures include:
          </p>
          <ul>
            <li>End-to-end encryption</li>
            <li>SOC 2 compliance</li>
            <li>Regular security audits</li>
            <li>Access controls and monitoring</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes 
            outlined in this policy, unless a longer retention period is required by law.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>7. International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
            safeguards are in place to protect your information in accordance with this policy.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for children under 13. We do not knowingly collect personal information from 
            children under 13. If we become aware of such collection, we will delete the information immediately.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
            policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at:
          </p>
          <ul>
            <li>Email: privacy@infinitystack.com</li>
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
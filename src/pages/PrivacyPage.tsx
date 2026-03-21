import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-max section-padding">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="font-display text-4xl font-bold text-foreground mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-foreground font-medium">
            Last updated: December 2024
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">1. Introduction</h2>
          <p>
            Magudam Herbals ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or make a purchase.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">2. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Name and contact information (phone number, address)</li>
            <li>Delivery address and pincode</li>
            <li>Order history and preferences</li>
          </ul>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Process and deliver your orders</li>
            <li>Communicate with you about your orders</li>
            <li>Provide customer support</li>
            <li>Send promotional communications (with your consent)</li>
          </ul>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">4. Information Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">5. Third-Party Services</h2>
          <p>
            We may use third-party services for order processing and delivery. These services have their own privacy policies governing the use of your information.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">6. Your Rights</h2>
          <p>
            Under the Information Technology Act, 2000 and related regulations, you have the right to access, correct, or delete your personal data. Contact us to exercise these rights.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">7. Contact Us</h2>
          <p>
            For any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Magudam Herbals</strong><br />
            Kodumudi, Tamil Nadu, India<br />
            Phone: +91 97517 01257<br />
            Instagram: @magudam_herbals
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;

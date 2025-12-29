import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
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
          Terms & Conditions
        </h1>

        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-foreground font-medium">
            Last updated: December 2024
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using the Magudam Herbals website and purchasing our products, you agree to be bound by these Terms and Conditions.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">2. Products</h2>
          <p>
            All products sold by Magudam Herbals are traditional herbal preparations made from natural ingredients. Product descriptions, images, and information are provided for informational purposes only.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">3. Ordering & Payment</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Orders can be placed through our website or WhatsApp</li>
            <li>Payment is accepted via Cash on Delivery (COD)</li>
            <li>Prices are in Indian Rupees (₹) and inclusive of all taxes</li>
            <li>We reserve the right to refuse or cancel orders at our discretion</li>
          </ul>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">4. Shipping</h2>
          <p>
            We ship across India. Delivery times may vary based on location. Standard delivery takes 5-10 business days.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">5. Product Use & Disclaimer</h2>
          <p className="bg-secondary/50 p-4 rounded-lg border border-border">
            <strong>Important:</strong> Our products are traditional herbal preparations and are NOT intended to diagnose, treat, cure, or prevent any disease. Results may vary from person to person. If you have specific health concerns, allergies, or are pregnant/nursing, please consult a healthcare professional before use.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">6. Intellectual Property</h2>
          <p>
            All content on this website, including logos, images, and text, is the property of Magudam Herbals and is protected by copyright laws.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">7. Limitation of Liability</h2>
          <p>
            Magudam Herbals shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">8. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Tamil Nadu.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">9. Contact</h2>
          <p>
            For questions regarding these Terms, contact us at +91 97517 01257.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RefundPage = () => {
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
          Refund & Shipping Policy
        </h1>

        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-foreground font-medium">
            Last updated: December 2024
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">Shipping Policy</h2>
          
          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Delivery Areas</h3>
          <p>
            We currently ship to all locations within India. International shipping is not available at this time.
          </p>

          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Shipping Charges</h3>
          <p>
            <strong>Free Shipping</strong> on all orders! No minimum order value required.
          </p>

          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Delivery Time</h3>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Tamil Nadu:</strong> 3-5 business days</li>
            <li><strong>Other South Indian states:</strong> 5-7 business days</li>
            <li><strong>Rest of India:</strong> 7-10 business days</li>
          </ul>
          <p className="mt-4">
            Note: Delivery times may vary during festivals, holidays, or due to unforeseen circumstances.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">Refund & Return Policy</h2>

          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Damaged or Defective Products</h3>
          <p>
            If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos of the damage. We will arrange for a replacement or full refund.
          </p>

          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Wrong Product Delivered</h3>
          <p>
            If you receive an incorrect product, please contact us within 48 hours. We will arrange for the correct product to be delivered and collect the wrong item.
          </p>

          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Non-Returnable Items</h3>
          <p>
            Due to the nature of our products (personal care items), we cannot accept returns for:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Products that have been opened or used</li>
            <li>Change of mind after purchase</li>
            <li>Products returned after 7 days of delivery</li>
          </ul>

          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Refund Process</h3>
          <p>
            Approved refunds will be processed within 5-7 business days. Since we accept Cash on Delivery only, refunds will be made via bank transfer to the account details provided by the customer.
          </p>

          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Order Cancellation</h3>
          <p>
            Orders can be cancelled before dispatch. Once shipped, orders cannot be cancelled. Contact us immediately if you wish to cancel your order.
          </p>

          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">Contact for Returns</h2>
          <p>
            To initiate a return or refund, contact us via:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Phone/WhatsApp:</strong> +91 97517 01257</li>
            <li><strong>Instagram:</strong> @magudam_herbal</li>
          </ul>
          <p className="mt-4">
            Please include your order details and reason for return/refund in your message.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;

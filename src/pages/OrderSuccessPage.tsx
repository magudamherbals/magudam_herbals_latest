import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Home, Search, MessageCircle, Copy } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { Order } from '@/types';
import { toast } from 'sonner';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const { orders } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const found = orders.find(o => o.id === orderId);
      if (found) {
        setOrder(found);
      }
    }
  }, [orderId, orders]);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast.success('Order ID copied!');
    }
  };

  const generateWhatsAppMessage = () => {
    if (!order) return '';
    let message = `Hi! I want to check the status of my order.\n\n`;
    message += `*Order ID:* ${order.id}\n`;
    message += `*Name:* ${order.customerName}\n`;
    message += `*Mobile:* ${order.mobile}`;
    return encodeURIComponent(message);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Package size={64} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find this order. Please check your order ID.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary">
              <Home size={18} className="mr-2" />
              Go to Store
            </Link>
            <Link to="/track-order" className="btn-primary bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <Search size={18} className="mr-2" />
              Track Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-max px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Animation */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={48} className="text-primary" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground">
              Thank you for shopping with Magudam Herbals
            </p>
          </div>

          {/* Order Details Card */}
          <div className="card-herbal p-6 mb-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground">Order ID (Save your order id for tracking your order)</p>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl font-bold text-primary">{order.id}</span>
                  <button
                    onClick={copyOrderId}
                    className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                    title="Copy Order ID"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.paymentStatus === 'paid'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-accent/20 text-accent-foreground'
                  }`}
                >
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending (COD)'}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 bg-secondary/30 p-3 rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      {item.product.specification && (
                        <p className="text-xs text-primary">{item.product.specification}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="mb-6 pb-6 border-b border-border">
              <h3 className="font-semibold mb-3">Delivery Details</h3>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.mobile}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {order.address}, {order.city} - {order.pincode}
                </p>
              </div>
            </div>

            {/* Pricing breakdown */}
            {(() => {
              const subtotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
              const discount = subtotal - order.total;
              return (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span>Coupon Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg pt-2">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-primary text-2xl">₹{order.total}</span>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="btn-primary flex-1 text-center">
              <Home size={18} className="mr-2" />
              Continue Shopping
            </Link>
            <a
              href={`https://wa.me/919751701257?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 bg-[#25D366] text-foreground hover:bg-[#22c55e] transition-colors"
            >
              <MessageCircle size={18} />
              Track via WhatsApp
            </a>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Save your Order ID: <strong>{order.id}</strong> for future reference
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
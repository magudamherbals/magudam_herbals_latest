import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Building2, Truck, ShieldCheck, MessageCircle, X, Wallet } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { CheckoutFormData, Order } from '@/types';
import { toast } from 'sonner';

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
type CheckoutStep = 'details' | 'payment' | 'processing';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const { addOrder } = useOrders();

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  // Calculate discount and final total
  const discountAmount = couponApplied ? Math.round((totalPrice * couponDiscount) / 100) : 0;
  const finalTotal = totalPrice - discountAmount;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (couponApplied) return;
    if (code === 'MAGUDAM10') {
      setCouponDiscount(10);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid or expired coupon code');
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const [formData, setFormData] = useState<CheckoutFormData & { email?: string }>({
    customerName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [step, setStep] = useState<CheckoutStep>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    if (!formData.city.trim()) {
      toast.error('Please enter your city');
      return false;
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const generateWhatsAppMessage = (orderId: string, isPaid: boolean, payLater: boolean = false) => {
    let message = `🌿 *Order Confirmation - Magudam Herbals*\n\n`;
    message += `*Order ID:* ${orderId}\n`;
    if (isPaid) {
      message += `✅ *Payment Status:* PAID\n\n`;
    } else if (payLater) {
      message += `⏳ *Payment Status:* Pay Later\n\n`;
    }
    message += `*Customer Details:*\n`;
    message += `Name: ${formData.customerName}\n`;
    message += `Mobile: ${formData.mobile}\n`;
    message += `Address: ${formData.address}\n`;
    message += `City: ${formData.city}\n`;
    message += `Pincode: ${formData.pincode}\n\n`;
    message += `*Order Details:*\n`;
    items.forEach((item) => {
      message += `• ${item.product.name}${item.product.specification ? ` (${item.product.specification})` : ''} x ${item.quantity} = ₹${item.product.price * item.quantity}\n`;
    });
    message += `\n*Total: ₹${finalTotal}*`;
    if (couponApplied && couponCode && couponDiscount) {
      message += `\n*Coupon Applied:* ${couponCode} (${couponDiscount}% off)`;
    }
    if (payLater) {
      message += `\n\n_Payment will be done later / COD_`;
    }
    return encodeURIComponent(message);
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return;
    setStep('payment');
  };

  const handlePaymentProcess = async () => {
    setStep('processing');
    setIsProcessing(true);
    
    const orderId = `MH${Date.now().toString(36).toUpperCase()}`;
    
    // Simulate payment gateway integration
    // In production, this would integrate with Razorpay/Cashfree/PayU
    toast.info('Opening payment gateway...');
    
    // Simulate payment processing with random success/failure
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo: 90% success rate
    const isPaymentSuccess = Math.random() > 0.1;
    
    if (isPaymentSuccess) {
      console.log('DEBUG ORDER', {
        couponApplied,
        couponCode,
        couponDiscount,
        finalTotal,
        totalPrice
      });
      const order: Order = {
        id: orderId,
        customerName: formData.customerName,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        items: [...items],
        total: finalTotal,
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: new Date(),
      };
      
      await addOrder(order);
      clearCart();

      // Send WhatsApp confirmation
      const message = generateWhatsAppMessage(orderId, true);
      window.open(`https://wa.me/919751701257?text=${message}`, '_blank');

      navigate(`/order-success?id=${orderId}`);
    } else {
      // Payment failed - DO NOT place order
      toast.error('Payment failed. Please try again.');
      setStep('payment');
      setIsProcessing(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!validateForm()) return;
    setShowWhatsAppModal(true);
  };

  const handleWhatsAppPayNow = () => {
    setShowWhatsAppModal(false);
    setStep('payment');
  };

  const handleWhatsAppPayLater = async () => {
    if (!validateForm()) return;

    setShowWhatsAppModal(false);

    const orderId = `MH${Date.now().toString(36).toUpperCase()}`;

    const order: Order = {
      id: orderId,
      customerName: formData.customerName,
      mobile: formData.mobile,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      items: [...items],
      total: finalTotal,
      status: 'pending',
      paymentStatus: 'pay_later',
      createdAt: new Date(),
    };

    await addOrder(order);
    clearCart();

    // Open WhatsApp with order details
    const message = generateWhatsAppMessage(orderId, false, true);
    window.open(`https://wa.me/919751701257?text=${message}`, '_blank');

    navigate(`/order-success?id=${orderId}`);
  };

  const paymentMethods = [
    { id: 'upi' as const, label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card' as const, label: 'Card', icon: CreditCard, desc: 'Credit / Debit Card' },
    { id: 'netbanking' as const, label: 'Net Banking', icon: Building2, desc: 'All Indian Banks' },
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 sticky top-0 z-10">
        <div className="container-max flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:text-accent transition-colors">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Store</span>
          </Link>
          <h1 className="font-display text-xl font-bold">Secure Checkout</h1>
        </div>
      </header>

      <div className="container-max px-4 md:px-8 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>1</span>
            <span className="hidden sm:inline">Details</span>
          </div>
          <div className="w-8 h-0.5 bg-border" />
          <div className={`flex items-center gap-2 ${step === 'payment' || step === 'processing' ? 'text-primary' : 'text-muted-foreground'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'payment' || step === 'processing' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>2</span>
            <span className="hidden sm:inline">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Form / Payment */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {step === 'details' && (
              <>
                {/* Delivery Details */}
                <div className="card-herbal p-6">
                  <h2 className="font-display text-xl font-bold mb-6">Delivery Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="customerName"
                        placeholder="Enter your full name"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="input-herbal"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Mobile Number <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          name="mobile"
                          placeholder="10-digit mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="input-herbal"
                          maxLength={10}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email <span className="text-muted-foreground text-xs">(Optional)</span></label>
                        <input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-herbal"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Full Address <span className="text-red-500">*</span></label>
                      <textarea
                        name="address"
                        placeholder="House/Flat No, Street, Landmark"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="input-herbal resize-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">City <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="city"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="input-herbal"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Pincode <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="pincode"
                          placeholder="6-digit pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="input-herbal"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* <button
                    onClick={handleProceedToPayment}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Wallet size={20} />
                    Pay & Place Order
                  </button> */}
                  <button
                    onClick={handleWhatsAppPayLater}
                    className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors"
                  >
                    <MessageCircle size={20} />
                    Place Order via WhatsApp
                  </button>
                </div>
              </>
            )}

            {step === 'payment' && (
              <div className="card-herbal p-6">
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => setStep('details')} className="p-2 hover:bg-secondary rounded-full">
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-display text-xl font-bold">Select Payment Method</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <method.icon size={24} className={paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'} />
                        <span className="font-medium text-lg">{method.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-10">{method.desc}</p>
                    </button>
                  ))}
                </div>

                {/* UPI Input */}
                {paymentMethod === 'upi' && (
                  <div className="mb-6 p-4 bg-secondary/50 rounded-xl">
                    <label className="text-sm font-medium mb-2 block">Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="input-herbal"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Or scan QR code in payment gateway</p>
                  </div>
                )}

                {/* Card Input */}
                {paymentMethod === 'card' && (
                  <div className="mb-6 p-4 bg-secondary/50 rounded-xl space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="input-herbal"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="input-herbal"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          className="input-herbal"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="mb-6 p-4 bg-secondary/50 rounded-xl">
                    <label className="text-sm font-medium mb-2 block">Select Bank</label>
                    <select className="input-herbal">
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="other">Other Banks</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={handlePaymentProcess}
                  disabled={isProcessing}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing Payment...' : `Pay ₹${totalPrice}`}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <ShieldCheck size={14} />
                  <span>100% Secure Payment • Powered by Razorpay</span>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="card-herbal p-12 text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <h2 className="font-display text-xl font-bold mb-2">Processing Payment</h2>
                <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
                <p className="text-sm text-muted-foreground mt-4">Do not close this window</p>
              </div>
            )}
          </motion.div>

          {/* Right - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="card-herbal p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.product.name}</h3>
                      {item.product.specification && (
                        <p className="text-xs text-primary">{item.product.specification}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Apply Section */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      if (couponApplied) {
                        setCouponApplied(false);
                        setCouponDiscount(0);
                      }
                    }}
                    className="input-herbal flex-1"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="btn-primary px-4"
                    disabled={couponApplied || !couponCode.trim()}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 mt-1">{couponError}</p>
                )}
                {couponApplied && (
                  <p className="text-xs text-green-600 mt-1">Coupon applied! {couponDiscount}% off</p>
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-primary">₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* WhatsApp Payment Modal */}
      <AnimatePresence>
        {showWhatsAppModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWhatsAppModal(false)}
              className="fixed inset-0 bg-foreground/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-2xl p-6 z-50"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-bold">How would you like to pay?</h2>
                <button onClick={() => setShowWhatsAppModal(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleWhatsAppPayNow}
                  className="w-full p-4 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Wallet size={20} className="text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg block">🟢 Pay Now</span>
                      <p className="text-sm text-muted-foreground">Complete payment online, then order via WhatsApp</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleWhatsAppPayLater}
                  className="w-full p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Truck size={20} className="text-accent-foreground" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg block">🟡 Pay Later</span>
                      <p className="text-sm text-muted-foreground">Cash on Delivery - Pay when you receive</p>
                    </div>
                  </div>
                </button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-6">
                Order will be placed via WhatsApp with your selected payment preference
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Package, CheckCircle, Truck, Home, Clock } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { Order } from '@/types';
import { toast } from 'sonner';

const TrackOrderPage = () => {
  const { orders } = useOrders();
  const [searchType, setSearchType] = useState<'orderId' | 'mobile'>('orderId');
  const [searchValue, setSearchValue] = useState('');
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      toast.error('Please enter a value to search');
      return;
    }

    let results: Order[] = [];
    
    if (searchType === 'orderId') {
      results = orders.filter(o => 
        o.id.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      results = orders.filter(o => 
        o.mobile.includes(searchValue)
      );
    }

    setFoundOrders(results);
    setHasSearched(true);

    if (results.length === 0) {
      toast.error('No orders found');
    } else {
      toast.success(`Found ${results.length} order(s)`);
    }
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Home },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 sticky top-0 z-10">
        <div className="container-max flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:text-accent transition-colors">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Store</span>
          </Link>
          <h1 className="font-display text-xl font-bold">Track Your Order</h1>
        </div>
      </header>

      <div className="container-max px-4 md:px-8 py-8">
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="card-herbal p-6">
            <h2 className="font-display text-xl font-bold mb-6 text-center">Find Your Orders</h2>
            
            {/* Search Type Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => { setSearchType('orderId'); setSearchValue(''); setHasSearched(false); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  searchType === 'orderId'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                Order ID
              </button>
              <button
                type="button"
                onClick={() => { setSearchType('mobile'); setSearchValue(''); setHasSearched(false); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  searchType === 'mobile'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                Mobile Number
              </button>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type={searchType === 'mobile' ? 'tel' : 'text'}
                placeholder={searchType === 'orderId' ? 'Enter Order ID (e.g., MH...)' : 'Enter Mobile Number'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="input-herbal flex-1"
                maxLength={searchType === 'mobile' ? 10 : 20}
              />
              <button type="submit" className="btn-primary px-6">
                <Search size={18} />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            {foundOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">
                  We couldn't find any orders matching your search.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {foundOrders.map((order) => (
                  <div key={order.id} className="card-herbal p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-display text-lg font-bold text-primary">{order.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{order.total}</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'paid'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-accent/20 text-accent-foreground'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Paid' : 'COD'}
                        </span>
                      </div>
                    </div>

                    {/* Status Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-secondary">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                          />
                        </div>
                        
                        {statusSteps.map((step, index) => {
                          const isActive = index <= getStatusStep(order.status);
                          return (
                            <div key={step.key} className="flex flex-col items-center relative z-10">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                  isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-muted-foreground'
                                }`}
                              >
                                <step.icon size={18} />
                              </div>
                              <span className={`text-xs mt-2 ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex gap-3 bg-secondary/30 p-3 rounded-lg">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.product.name}</h4>
                            {item.product.specification && (
                              <p className="text-xs text-primary">{item.product.specification}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">×{item.quantity}</p>
                            <p className="text-sm text-muted-foreground">₹{item.product.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        📍 {order.address}, {order.city} - {order.pincode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-12 text-muted-foreground">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>Enter your Order ID or Mobile Number to track your orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
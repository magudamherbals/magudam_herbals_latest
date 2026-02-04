import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Phone,
  CreditCard,
  LogOut,
  Mail,
  Lock,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/context/OrderContext';
import { Order } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const MONTHS = [
  { value: '', label: 'All Months' },
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

const AdminPage = () => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Order filters state
  const [orderSearch, setOrderSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'highest'>('latest');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Delete confirmation state
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // View mode state (active or deleted orders)
  const [viewMode, setViewMode] = useState<'active' | 'deleted'>('active');

  const { orders, deletedOrders, updateOrderStatus, updatePaymentStatus, deleteOrder, restoreOrder, fetchDeletedOrders } = useOrders();

  // Check auth state on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch deleted orders when switching to deleted view
  useEffect(() => {
    if (viewMode === 'deleted') {
      fetchDeletedOrders();
    }
  }, [viewMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome to Admin Panel');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter (mobile number or product name)
    if (orderSearch) {
      const searchLower = orderSearch.toLowerCase();
      result = result.filter(order =>
        order.mobile.includes(orderSearch) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.product.name.toLowerCase().includes(searchLower))
      );
    }

    // Month filter
    if (monthFilter) {
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth().toString() === monthFilter;
      });
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(dateFrom);
      });
    }
    if (dateTo) {
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        return orderDate <= toDate;
      });
    }

    // Payment status filter
    if (paymentStatusFilter) {
      result = result.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    // Order status filter
    if (orderStatusFilter) {
      result = result.filter(order => order.status === orderStatusFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return b.total - a.total;
      }
    });

    return result;
  }, [orders, orderSearch, monthFilter, dateFrom, dateTo, paymentStatusFilter, orderStatusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setOrderSearch('');
    setMonthFilter('');
    setDateFrom('');
    setDateTo('');
    setPaymentStatusFilter('');
    setOrderStatusFilter('');
    setSortBy('latest');
    setCurrentPage(1);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card-herbal p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-primary" size={32} />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Admin Login
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access admin panel
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-herbal pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-herbal pl-10"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loginLoading}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 mt-6 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Store
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 sticky top-0 z-10">
        <div className="container-max flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:text-accent transition-colors">
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Store</span>
            </Link>
            <h1 className="font-display text-xl font-bold">Order Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline opacity-80">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Orders Content */}
      <div className="container-max px-4 md:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'active'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <ShoppingCart size={18} />
            Active Orders ({orders.length})
          </button>
          <button
            onClick={() => setViewMode('deleted')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'deleted'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Trash2 size={18} />
            Deleted Orders ({deletedOrders.length})
          </button>
        </div>

        {viewMode === 'active' ? (
          <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="font-display text-2xl font-bold">
            Customer Orders
            <span className="text-base font-normal text-muted-foreground ml-2">
              ({filteredOrders.length} of {orders.length})
            </span>
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Mobile, or Product..."
              value={orderSearch}
              onChange={(e) => { setOrderSearch(e.target.value); setCurrentPage(1); }}
              className="input-herbal pl-10"
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-herbal p-4 mb-6"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Month Filter */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  <Calendar size={14} className="inline mr-1" />
                  Month
                </label>
                <select
                  value={monthFilter}
                  onChange={(e) => { setMonthFilter(e.target.value); setCurrentPage(1); }}
                  className="input-herbal"
                >
                  {MONTHS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="text-sm font-medium mb-1 block">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                  className="input-herbal"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="text-sm font-medium mb-1 block">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                  className="input-herbal"
                />
              </div>

              {/* Payment Status */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  <CreditCard size={14} className="inline mr-1" />
                  Payment Status
                </label>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => { setPaymentStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="input-herbal"
                >
                  <option value="">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="pay_later">Pay Later</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Order Status */}
              <div>
                <label className="text-sm font-medium mb-1 block">Order Status</label>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => { setOrderStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="input-herbal"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  <ArrowUpDown size={14} className="inline mr-1" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="input-herbal"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                </select>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Orders List */}
        {paginatedOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="mx-auto mb-4" size={48} />
            <p>{orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <div key={order.id} className="card-herbal p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{order.customerName}</h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          order.status === 'pending'
                            ? 'bg-accent/20 text-accent-foreground'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-primary/30 text-primary'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          order.paymentStatus === 'paid'
                            ? 'bg-primary/20 text-primary'
                            : order.paymentStatus === 'failed'
                            ? 'bg-destructive/20 text-destructive'
                            : order.paymentStatus === 'pay_later'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-accent/20 text-accent-foreground'
                        }`}
                      >
                        {order.paymentStatus === 'pay_later' ? 'Pay Later / COD' :
                          order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone size={14} />
                      {order.mobile}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.address}, {order.city} - {order.pincode}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Order ID: {order.id} • {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{order.total}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <p className="text-sm font-medium mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>
                          {item.product.name}
                          {item.product.specification && ` (${item.product.specification})`} × {item.quantity}
                        </span>
                        <span>₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing breakdown */}
                {(() => {
                  const subtotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
                  const discount = subtotal - order.total;
                  return (
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-xs text-green-700">
                          <span>Coupon Discount</span>
                          <span>-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold pt-2">
                        <span>Total</span>
                        <span className="text-primary">₹{order.total}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Payment Status */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Payment Status:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={async () => {
                        await updatePaymentStatus(order.id, 'paid');
                        toast.success('Payment marked as Paid');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      Paid
                    </button>
                    <button
                      onClick={async () => {
                        await updatePaymentStatus(order.id, 'pending');
                        toast.success('Payment marked as Not Paid');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        order.paymentStatus === 'pending' || order.paymentStatus === 'pay_later'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      Not Paid
                    </button>
                  </div>
                </div>

                {/* Order Status */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Order Status:</p>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'processing', 'shipped', 'delivered'] as Order['status'][]).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={async () => {
                            await updateOrderStatus(order.id, status);
                            toast.success(`Order marked as ${status}`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            order.status === status
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => {
                        setOrderToDelete(order);
                        setDeleteDialogOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="input-herbal w-20 py-2"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-muted-foreground">per page</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
          </>
        ) : (
          /* Deleted Orders View */
          <>
            <h2 className="font-display text-2xl font-bold mb-6">
              Deleted Orders
              <span className="text-base font-normal text-muted-foreground ml-2">
                ({deletedOrders.length})
              </span>
            </h2>

            {deletedOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trash2 className="mx-auto mb-4" size={48} />
                <p>No deleted orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deletedOrders.map((order) => (
                  <div key={order.id} className="card-herbal p-6 border-destructive/20">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{order.customerName}</h3>
                          <span className="text-xs px-3 py-1 rounded-full font-medium bg-destructive/20 text-destructive">
                            Deleted
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone size={14} />
                          {order.mobile}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.address}, {order.city} - {order.pincode}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Order ID: {order.id} • {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{order.total}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 mb-4">
                      <p className="text-sm font-medium mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="flex justify-between text-sm">
                            <span>
                              {item.product.name}
                              {item.product.specification && ` (${item.product.specification})`} × {item.quantity}
                            </span>
                            <span>₹{item.product.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Restore Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={async () => {
                          await restoreOrder(order.id);
                          toast.success('Order restored successfully');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <RotateCcw size={18} />
                        Restore Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order from{' '}
              <span className="font-semibold">{orderToDelete?.customerName}</span>?
              You can restore it later from the Deleted Orders tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOrderToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (orderToDelete) {
                  await deleteOrder(orderToDelete.id);
                  toast.success('Order deleted');
                  setOrderToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;

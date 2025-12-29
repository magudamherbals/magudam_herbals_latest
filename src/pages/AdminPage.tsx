import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft,
  Check,
  X,
  LogOut,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Phone,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { useOrders } from '@/context/OrderContext';
import { Product, Order } from '@/types';
import { toast } from 'sonner';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

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

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'magudam2024') {
      setIsAuthenticated(true);
      toast.success('Welcome to Admin Panel');
    } else {
      toast.error('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card-herbal p-8">
            <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
              Admin Login
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Enter password to access admin panel
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-herbal"
              />
              <button type="submit" className="btn-primary w-full">
                Login
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
            <h1 className="font-display text-xl font-bold">Admin Panel</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="container-max px-4 md:px-8 py-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <Package size={20} />
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <ShoppingCart size={20} />
            Orders ({orders.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold">Manage Products</h2>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Add Product
              </button>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="card-herbal p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {product.name}
                      {product.specification && (
                        <span className="ml-2 text-sm text-primary font-normal">
                          – {product.specification}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-bold text-primary">₹{product.price}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground uppercase">
                        {product.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.inStock
                            ? 'bg-primary/10 text-primary'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        deleteProduct(product.id);
                        toast.success('Product deleted');
                      }}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
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
                      <option value="confirmed">Confirmed</option>
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
                          {order.isWhatsAppOrder && (
                            <span className="text-xs px-2 py-1 rounded-full bg-[#25D366]/20 text-[#25D366] font-medium flex items-center gap-1">
                              <MessageCircle size={12} />
                              WhatsApp
                            </span>
                          )}
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              order.status === 'pending'
                                ? 'bg-accent/20 text-accent-foreground'
                                : order.status === 'confirmed'
                                ? 'bg-primary/20 text-primary'
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
                          {order.paymentMethod && (
                            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                              {order.paymentMethod === 'online' ? 'Online' : 
                               order.paymentMethod === 'cod' ? 'COD' : 'Pay Later'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone size={14} />
                          {order.mobile}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          📍 {order.address}, {order.city} - {order.pincode}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Order ID: {order.id} • {new Date(order.createdAt).toLocaleString()}
                        </p>
                        {order.paymentId && (
                          <p className="text-xs text-muted-foreground">
                            Payment ID: {order.paymentId}
                          </p>
                        )}
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
                        <div className="space-y-1 mb-2">
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

                    <div className="flex flex-wrap gap-2">
                      {(['pending', 'confirmed', 'processing', 'shipped', 'delivered'] as Order['status'][]).map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() => {
                              updateOrderStatus(order.id, status);
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
                          deleteOrder(order.id);
                          toast.success('Order deleted');
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        Delete
                      </button>
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
          </div>
        )}
      </div>

      {/* Product Edit Modal */}
      {(editingProduct || isAddingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            setIsAddingProduct(false);
          }}
          onSave={(product) => {
            if (editingProduct) {
              updateProduct(product.id, product);
              toast.success('Product updated');
            } else {
              addProduct({ ...product, id: Date.now().toString() });
              toast.success('Product added');
            }
            setEditingProduct(null);
            setIsAddingProduct(false);
          }}
        />
      )}
    </div>
  );
};

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductModal = ({ product, onClose, onSave }: ProductModalProps) => {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      images: [],
      specification: '',
      ingredients: [],
      category: 'soap',
      inStock: true,
    }
  );
  const [ingredientsText, setIngredientsText] = useState(
    product?.ingredients.join(', ') || ''
  );
  const [imagesText, setImagesText] = useState(
    product?.images?.join('\n') || product?.image || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate specification for oil and shampoo
    if ((formData.category === 'oil' || formData.category === 'shampoo') && !formData.specification?.trim()) {
      toast.error('Specification is required for Oil and Shampoo products');
      return;
    }

    const imagesList = imagesText.split('\n').map(i => i.trim()).filter(Boolean);
    
    onSave({
      ...formData,
      image: imagesList[0] || formData.image,
      images: imagesList,
      ingredients: ingredientsText.split(',').map((i) => i.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-herbal"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-herbal resize-none"
            rows={3}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price (₹)"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="input-herbal"
              required
            />
            <input
              type="text"
              placeholder={formData.category === 'soap' ? 'Specification (e.g., 75 g) - Optional' : 'Specification (e.g., 100 ml) *'}
              value={formData.specification || ''}
              onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
              className="input-herbal"
              required={formData.category === 'oil' || formData.category === 'shampoo'}
            />
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              <ImagePlus size={14} className="inline mr-1" />
              Image URLs (one per line, first is main image)
            </label>
            <textarea
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              className="input-herbal resize-none"
              rows={3}
            />
          </div>
          
          <input
            type="text"
            placeholder="Ingredients (comma separated)"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            className="input-herbal"
          />
          
          <div className="flex gap-4">
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as 'soap' | 'oil' | 'shampoo' })
              }
              className="input-herbal flex-1"
            >
              <option value="soap">Soap</option>
              <option value="oil">Oil</option>
              <option value="shampoo">Shampoo</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-5 h-5 rounded border-border"
              />
              <span>In Stock</span>
            </label>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-border hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              <Check size={18} className="mr-2" />
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminPage;
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

const CartSidebar = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-foreground/50 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-primary" size={24} />
                <h2 className="font-display text-xl font-semibold">
                  {t('cart.title')} ({totalItems})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag className="text-muted-foreground mb-4" size={48} />
                  <p className="text-lg text-muted-foreground">{t('cart.empty')}</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-primary font-medium hover:underline"
                  >
                    {t('cart.startShopping')}
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-4 bg-secondary/50 rounded-xl"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {t(`p.${item.product.id}.name`) !== `p.${item.product.id}.name` ? t(`p.${item.product.id}.name`) : item.product.name}
                        </h3>
                        {item.product.specification && (
                          <p className="text-xs text-primary">{item.product.specification}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          ₹{item.product.price} each
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-secondary rounded"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-secondary rounded"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          ₹{item.product.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-full mt-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">{t('cart.total')}</span>
                  <span className="font-bold text-primary text-2xl">₹{totalPrice}</span>
                </div>
                {/* Shipping Info */}
                <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide flex items-center gap-1">
                    {t('cart.shipping.title')}
                  </p>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground/80">{t('cart.shipping.local')}</p>
                    <ul className="ml-3 space-y-0.5 list-disc list-inside">
                      <li>{t('cart.shipping.local.upto1kg')} around <span className="font-semibold text-primary">₹70</span></li>
                      <li>{t('cart.shipping.local.above1kg')} around <span className="font-semibold text-primary">₹100</span></li>
                    </ul>
                  </div>
                  <div className="space-y-1 pt-1 border-t border-border">
                    <p className="font-medium text-foreground/80">{t('cart.shipping.outstation')}</p>
                    <ul className="ml-3 space-y-0.5 list-disc list-inside">
                      <li>{t('cart.shipping.outstation.upto1kg')} around <span className="font-semibold text-primary">₹100</span></li>
                      <li>{t('cart.shipping.outstation.above1kg')} around <span className="font-semibold text-primary">₹200</span></li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full"
                >
                  {t('cart.checkout')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
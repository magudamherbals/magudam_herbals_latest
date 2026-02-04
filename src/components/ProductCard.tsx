import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Check, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const { addToCart } = useCart();

  const images = product.images?.length ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
    setQuantity(1);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'soap': return 'Soap';
      case 'oil': return 'Hair Oil';
      case 'shampoo': return 'Shampoo';
      default: return category;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="card-herbal group overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        {/* Image Carousel */}
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
            onClick={() => setShowGallery(true)}
          />
          
          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                <ChevronRight size={18} />
              </button>
              {/* Image Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-primary w-4' : 'bg-background/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Zoom Icon */}
          <button
            onClick={() => setShowGallery(true)}
            className="absolute top-3 right-3 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <ZoomIn size={16} />
          </button>

          {!product.inStock && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-destructive text-destructive-foreground rounded-full font-medium">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full uppercase">
              {getCategoryLabel(product.category)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-foreground mb-1">
            {product.name}
          </h3>
          {product.specification && (
            <p className="text-sm text-primary font-medium mb-2">
              {product.specification}
            </p>
          )}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Ingredients */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Key Ingredients:</p>
            <div className="flex flex-wrap gap-1">
              {product.ingredients.slice(0, 3).map((ing) => (
                <span
                  key={ing}
                  className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full"
                >
                  {ing}
                </span>
              ))}
              {product.ingredients.length > 3 && (
                <span className="px-2 py-0.5 text-muted-foreground text-xs">
                  +{product.ingredients.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary">
              ₹{product.price}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          {product.inStock && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-secondary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-secondary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 whitespace-nowrap text-sm ${
                  showAdded
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground hover:opacity-90'
                }`}
              >
                {showAdded ? (
                  <>
                    <Check size={18} className="flex-shrink-0" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} className="flex-shrink-0" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGallery(false)}
                className="absolute -top-12 right-0 p-2 text-background hover:text-primary transition-colors"
              >
                <X size={28} />
              </button>
              
              <div className="relative">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
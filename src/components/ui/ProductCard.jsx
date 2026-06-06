import { memo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { FiPlus, FiMinus, FiStar, FiClock, FiTag } from 'react-icons/fi';
import clsx from 'clsx';

const ProductCard = memo(forwardRef(({ product, onClick }, ref) => {
  const { cart, addToCart, decreaseQuantity, increaseQuantity } = useCart();
  
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;

  return (
    <motion.div 
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm-card border border-gray-100 flex flex-col group h-full"
    >
      {/* Image Section - 45% Height */}
      <div 
        className="relative w-full aspect-[16/10] overflow-hidden cursor-pointer"
        onClick={() => onClick(product)}
      >
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1541167760496-162939113a09?q=80&w=300&auto=format&fit=crop'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isBestseller && (
            <div className="bg-primary text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-lg uppercase tracking-wider flex items-center gap-1">
              <FiStar className="fill-white" /> Bestseller
            </div>
          )}
          {hasDiscount && (
            <div className="bg-success text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-lg uppercase tracking-wider flex items-center gap-1">
              <FiTag className="fill-white" /> {product.discount}% OFF
            </div>
          )}
        </div>

        {/* Veg/Non-Veg Indicator */}
        <div className="absolute bottom-3 left-3">
          <div className={clsx(
            "w-4 h-4 border-2 flex items-center justify-center bg-white/90 rounded-sm shadow-sm",
            product.isVeg ? "border-green-600" : "border-red-600"
          )}>
            <div className={clsx(
              "w-1.5 h-1.5 rounded-full",
              product.isVeg ? "bg-green-600" : "bg-red-600"
            )}></div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-dark text-lg leading-tight flex-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Stats: Rating & Time */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-green-700">
            <FiStar className="fill-green-700 w-3 h-3" />
            {product.rating || '4.5'}
          </div>
          <div className="flex items-center gap-1 text-muted text-[11px] font-semibold uppercase tracking-wider">
            <FiClock className="w-3 h-3" />
            {product.prepTime || '15 min'}
          </div>
        </div>
        
        <p className="text-muted text-xs font-medium line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-muted line-through font-bold">₹{product.price}</span>
            )}
            <span className="font-extrabold text-dark text-xl leading-none">₹{discountedPrice}</span>
          </div>
          
          <div className="relative">
            {quantity > 0 ? (
              <div className="flex items-center bg-white rounded-lg border-2 border-primary overflow-hidden shadow-sm">
                <button 
                  onClick={(e) => { e.stopPropagation(); decreaseQuantity(product.id); }}
                  className="w-8 h-8 flex items-center justify-center text-primary hover:bg-orange-50 transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="w-6 text-center font-bold text-primary text-sm">{quantity}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); increaseQuantity(product.id); }}
                  className="w-8 h-8 flex items-center justify-center text-primary hover:bg-orange-50 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); addToCart({ ...product, price: discountedPrice }); }}
                className="bg-white text-primary border-2 border-orange-100 hover:border-primary px-5 py-1.5 rounded-lg text-sm font-black shadow-sm-card transition-all duration-200 active:scale-95"
              >
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}));

ProductCard.displayName = 'ProductCard';

export default ProductCard;

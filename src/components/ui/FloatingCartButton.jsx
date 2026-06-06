import { useCart } from '../../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function FloatingCartButton() {
  const { itemCount, total } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on checkout, cart, tracking, or admin pages
  if (
    itemCount === 0 || 
    ['/cart', '/checkout', '/tracking'].includes(location.pathname) ||
    location.pathname.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-[90px] left-0 right-0 z-40 px-5 max-w-md mx-auto"
      >
        <div 
          onClick={() => navigate('/cart')}
          className="bg-gradient-to-r from-primary to-orange-400 text-white rounded-2xl p-5 shadow-2xl shadow-orange-200 flex justify-between items-center cursor-pointer transform active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiShoppingBag className="w-6 h-6" />
              <span className="absolute -top-3 -right-3 bg-white text-primary text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-primary">
                {itemCount}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-50">Your Basket</span>
              <span className="text-lg font-black tracking-tight text-white">₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="font-black flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl text-sm">
            VIEW CART <FiArrowRight className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

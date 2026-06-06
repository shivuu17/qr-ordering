import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiMinus, FiTrash2, FiArrowRight, FiLock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, removeFromCart, decreaseQuantity, increaseQuantity, subtotal, gst, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-white font-sans">
        <div className="bg-white p-5 flex items-center border-b border-gray-50 sticky top-0 z-20">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-dark bg-gray-50 rounded-xl">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black ml-4 uppercase tracking-tight">Your Basket</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-40 h-40 bg-orange-50 rounded-full flex items-center justify-center mb-6">
             <img 
               src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" 
               alt="Empty Cart" 
               className="w-24 h-24 opacity-40 grayscale sepia brightness-50 contrast-150"
             />
          </div>
          <h2 className="text-2xl font-black text-dark mb-2">Basket is empty</h2>
          <p className="text-muted font-medium mb-8 max-w-[250px] mx-auto">Add something delicious from our artisanal menu to get started.</p>
          <button 
            onClick={() => navigate('/menu')}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-orange-200 active:scale-95 transition-transform"
          >
            BROWSE MENU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-[200px] font-sans">
      {/* Header */}
      <div className="bg-white p-5 flex items-center border-b border-gray-50 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-dark bg-gray-50 rounded-xl">
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div className="ml-4">
           <h1 className="text-lg font-black uppercase tracking-tight leading-none">Your Basket</h1>
           <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{cart.length} Items Selected</p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-5 space-y-5">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-4 items-center bg-white"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 shadow-sm">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1541167760496-162939113a09?q=80&w=150&auto=format&fit=crop'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-dark text-base truncate pr-2">{item.name}</h3>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-primary font-black text-sm">₹{item.price * item.quantity}</p>
                  
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <button 
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-1.5 px-2 text-primary hover:bg-orange-50 transition-colors"
                    >
                      <FiMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-black text-xs text-dark">{item.quantity}</span>
                    <button 
                      onClick={() => increaseQuantity(item.id)}
                      className="p-1.5 px-2 text-primary hover:bg-orange-50 transition-colors"
                    >
                      <FiPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bill Details Section */}
      <div className="mt-4 px-5">
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm-card">
          <h3 className="text-xs font-black text-dark uppercase tracking-widest mb-5 border-b border-gray-200 pb-3">Bill Details</h3>
          
          <div className="space-y-4 font-medium text-sm">
            <div className="flex justify-between text-muted">
              <span>Item Total</span>
              <span className="text-dark font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>GST & Restaurant Charges (5%)</span>
              <span className="text-dark font-bold">₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-base font-black text-dark uppercase tracking-tight">Grand Total</span>
              <span className="text-2xl font-black text-primary tracking-tighter">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY CTA SECTION */}
      <div className="fixed bottom-[74px] left-0 right-0 bg-white p-5 pt-3 z-40 border-t border-gray-50 max-w-md mx-auto">
        <motion.button 
          onClick={() => navigate('/checkout')}
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full h-[65px] bg-gradient-to-r from-primary to-orange-500 text-white rounded-[20px] shadow-2xl shadow-orange-300 flex items-center justify-between px-6 transition-all"
        >
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 leading-none mb-1">Total to pay</span>
            <span className="text-xl font-black tracking-tight leading-none uppercase">Proceed <span className="hidden sm:inline">to Checkout</span></span>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-xl font-black tracking-tighter">₹{total.toFixed(2)}</span>
             <div className="bg-white/20 p-2 rounded-xl border border-white/20">
               <FiArrowRight className="w-5 h-5 stroke-[3px]" />
             </div>
          </div>
        </motion.button>
        
        {/* Trust Indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-muted font-bold text-[10px] uppercase tracking-widest opacity-60">
           <FiLock className="w-3 h-3 text-success" />
           <span>Secure Checkout • Order Confirmation Instantly</span>
        </div>
      </div>
    </div>
  );
}

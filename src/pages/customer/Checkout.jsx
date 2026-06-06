import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiPhone, FiFileText, FiLock } from 'react-icons/fi';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, isDummyConfig } from '../../firebase/config';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, total, subtotal, gst, clearCart } = useCart();
  const navigate = useNavigate();
  const tableNumber = sessionStorage.getItem('tableNumber') || 'Takeaway';
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    navigate('/menu');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    
    let orderNumber = 'ORD1001';

    try {
      if (!isDummyConfig) {
        // Fetch the latest order to get the next sequence number
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const lastOrder = querySnapshot.docs[0].data();
          const lastNum = parseInt(lastOrder.orderNumber?.replace('ORD', '') || '1000');
          orderNumber = `ORD${lastNum + 1}`;
        }
      } else {
        orderNumber = 'ORD' + Math.floor(1000 + Math.random() * 9000);
      }

      const orderData = {
        orderNumber,
        tableNumber,
        customerName: formData.name,
        customerPhone: formData.phone,
        notes: formData.notes,
        items: cart,
        subtotal,
        gst,
        total,
        status: 'Pending',
        estimatedTime: '15 mins',
        createdAt: serverTimestamp(),
      };

      if (isDummyConfig) {
        console.log("Demo Mode - Simulating order placement", orderData);
        setTimeout(() => {
          sessionStorage.setItem('lastOrderId', orderNumber);
          clearCart();
          navigate(`/tracking?order=${orderNumber}`);
          toast.success('Order placed successfully!');
        }, 1000);
        return;
      }

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      sessionStorage.setItem('lastOrderId', docRef.id);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/tracking?order=${docRef.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-safe font-sans">
      <div className="bg-white p-5 flex items-center border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 bg-gray-50 rounded-xl">
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black ml-4 uppercase tracking-tight">Checkout</h1>
      </div>

      <div className="flex-1 p-5 overflow-y-auto">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Serving at</p>
            <p className="font-black text-2xl text-dark tracking-tighter uppercase">Table {tableNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Final Amount</p>
            <p className="font-black text-2xl text-primary tracking-tighter italic">₹{total.toFixed(2)}</p>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-5">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xs font-black text-dark uppercase tracking-widest border-b border-gray-50 pb-4">Personal Details</h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-12 w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Mobile Number (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiPhone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-12 w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm"
                  placeholder="For Order Updates"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Special Instructions</label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                  <FiFileText className="w-4 h-4" />
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="pl-12 w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-medium text-sm resize-none"
                  placeholder="E.g. Extra sugar, No ice..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[65px] bg-gradient-to-r from-primary to-orange-500 text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-3"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>PLACE ORDER NOW <FiArrowLeft className="rotate-180 w-4 h-4" /></>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black text-muted uppercase tracking-widest opacity-50 text-center">
               ✓ Direct Order to Kitchen • Pay at Counter
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

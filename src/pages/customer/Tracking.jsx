import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, isDummyConfig } from '../../firebase/config';
import { FiArrowLeft, FiCheckCircle, FiClock, FiCoffee, FiShoppingBag, FiSmile } from 'react-icons/fi';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const STATUS_STEPS = [
  { id: 'Pending', label: 'Order Received', icon: FiShoppingBag },
  { id: 'Accepted', label: 'Accepted', icon: FiCheckCircle },
  { id: 'Preparing', label: 'Preparing', icon: FiCoffee },
  { id: 'Ready', label: 'Ready', icon: FiClock },
  { id: 'Served', label: 'Served', icon: FiSmile },
];

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order') || sessionStorage.getItem('lastOrderId');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Dummy order for preview if Firebase not connected
    if (isDummyConfig) {
      setOrder({
        orderNumber: orderId.startsWith('ORD') ? orderId : 'ORD1024',
        status: 'Preparing',
        estimatedTime: '10 mins',
        items: [{ name: 'Cappuccino', quantity: 2, price: 180 }],
        total: 378
      });
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (docSnap) => {
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          setOrder(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return <div className="flex-1 flex justify-center items-center h-screen">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-4">
        <div className="text-center mt-20">
          <h2 className="text-xl font-bold mb-2">No Active Order</h2>
          <p className="text-gray-500 mb-6">We couldn't find your order details.</p>
          <button 
            onClick={() => navigate('/menu')}
            className="bg-primary text-white px-6 py-2 rounded-xl"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(step => step.id === order.status) || 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate('/menu')} className="p-2 -ml-2 text-gray-600">
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold ml-2">Track Order</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Info Card */}
        <div className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-orange-500/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-primary-100 text-sm">Order Number</p>
              <h2 className="text-2xl font-bold">{order.orderNumber || orderId.slice(-6).toUpperCase()}</h2>
            </div>
            <div className="text-right">
              <p className="text-primary-100 text-sm">Total</p>
              <p className="text-xl font-bold">₹{order.total?.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 flex justify-between items-center backdrop-blur-sm">
            <span>Estimated Time</span>
            <span className="font-bold">{order.estimatedTime || 'N/A'}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-6">Order Status</h3>
          
          <div className="relative pl-4 space-y-8">
            {/* Vertical Line */}
            <div className="absolute left-[1.6rem] top-2 bottom-4 w-0.5 bg-gray-200"></div>

            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative flex items-center gap-4">
                  <div 
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center z-10 relative transition-colors duration-300",
                      isCompleted ? "bg-primary text-white shadow-md shadow-orange-200" : "bg-gray-200 text-gray-400"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {isCurrent && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-primary rounded-full"
                      />
                    )}
                  </div>
                  <div className={clsx("flex-1", isCompleted ? "text-gray-800" : "text-gray-400")}>
                    <p className={clsx("font-medium", isCurrent && "text-primary font-bold")}>
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Items Ordered</h3>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                </span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

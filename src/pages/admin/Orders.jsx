import { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, isDummyConfig } from '../../firebase/config';
import { FiClock, FiCheck, FiX, FiCoffee, FiSmile, FiAlertCircle, FiEye, FiUser, FiHash, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CATEGORIES = [
  { id: 'Active', label: 'Incoming', statuses: ['Pending', 'Accepted'] },
  { id: 'Kitchen', label: 'In Kitchen', statuses: ['Preparing'] },
  { id: 'Ready', label: 'Ready', statuses: ['Ready'] },
  { id: 'Completed', label: 'Served', statuses: ['Served', 'Cancelled'] },
];

const DUMMY_ORDERS = [
  {
    id: 'ord1',
    orderNumber: 'ORD1024',
    tableNumber: 'T05',
    customerName: 'Shivank',
    status: 'Pending',
    total: 504,
    items: [
      { name: 'Cappuccino', quantity: 2, price: 180 },
      { name: 'Classic Burger', quantity: 1, price: 120 }
    ],
    createdAt: new Date(Date.now() - 5 * 60000)
  },
  {
    id: 'ord2',
    orderNumber: 'ORD1025',
    tableNumber: 'T02',
    customerName: 'Rahul',
    status: 'Served',
    total: 350,
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 350 }
    ],
    createdAt: new Date(Date.now() - 15 * 60000)
  }
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isDummyConfig) {
      setOrders(DUMMY_ORDERS);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setOrders(DUMMY_ORDERS); 
      } else {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setOrders(ordersData);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Firestore error (orders):", error);
      setOrders(DUMMY_ORDERS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtered orders based on active tab and search query
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (order.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [orders, searchQuery]);

  const categorizedOrders = useMemo(() => {
    const groups = {};
    STATUS_CATEGORIES.forEach(cat => {
      groups[cat.id] = filteredOrders.filter(order => cat.statuses.includes(order.status));
    });
    return groups;
  }, [filteredOrders]);

  const updateStatus = async (orderId, newStatus) => {
    if (orderId.startsWith('ord')) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Demo Order updated to ${newStatus}`);
      return;
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Ready': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Served': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled': return 'bg-rose-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Refreshing Orders...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Order Management</h1>
          <p className="text-muted font-bold text-xs uppercase tracking-widest mt-1">Real-time status tracking & history</p>
        </div>
        
        {/* Admin Search Bar */}
        <div className="relative w-full md:w-64">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 w-4 h-4" />
           </div>
           <input 
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm font-bold transition-all shadow-sm"
             placeholder="Search by name or ID..."
           />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white rounded-2xl w-fit shadow-sm border border-gray-100">
        {STATUS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={clsx(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 whitespace-nowrap",
              activeTab === cat.id
                ? "bg-primary text-white shadow-lg shadow-orange-200"
                : "text-muted hover:bg-gray-50"
            )}
          >
            {cat.label}
            <span className={clsx(
              "px-2 py-0.5 rounded-lg text-[10px]",
              activeTab === cat.id ? "bg-white/20 text-white" : "bg-gray-100 text-muted"
            )}>
              {categorizedOrders[cat.id]?.length || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Order Display */}
      {activeTab === 'Completed' ? (
        /* HORIZONTAL LIST VIEW FOR SERVED ORDERS */
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-muted text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                  <th className="p-5">Order #</th>
                  <th className="p-5">Table</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5 text-center">Amount</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-center">Finished</th>
                  <th className="p-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {categorizedOrders['Completed'].map((order) => (
                    <motion.tr 
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-5 font-black text-gray-400 text-xs tracking-tighter">#{order.orderNumber}</td>
                      <td className="p-5 font-bold text-dark">{order.tableNumber}</td>
                      <td className="p-5 font-bold text-muted text-sm">{order.customerName || 'Guest'}</td>
                      <td className="p-5 text-center font-black text-dark italic">₹{order.total?.toFixed(2)}</td>
                      <td className="p-5 text-center">
                        <span className={clsx("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", getStatusColor(order.status))}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-5 text-center text-xs text-muted font-bold">
                        {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="bg-white text-primary border-2 border-orange-50 hover:border-primary p-2 rounded-xl transition-all shadow-sm"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {categorizedOrders['Completed'].length === 0 && (
              <div className="py-20 text-center text-muted font-bold uppercase tracking-widest text-xs">No order history available</div>
            )}
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW FOR ACTIVE ORDERS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {categorizedOrders[activeTab].map((order) => (
              <motion.div 
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full"
              >
                <div className="p-5 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{order.orderNumber}</span>
                      <h3 className="font-black text-2xl text-dark leading-none mt-1 tracking-tighter">{order.tableNumber}</h3>
                    </div>
                    <span className={clsx("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border shadow-sm", getStatusColor(order.status))}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-muted text-xs gap-2 font-bold uppercase tracking-wider">
                    <FiClock className="w-3.5 h-3.5" />
                    <span>{formatDistanceToNow(order.createdAt, { addSuffix: true })}</span>
                    <span className="opacity-30">•</span>
                    <span className="text-primary">{order.customerName || 'Guest'}</span>
                  </div>
                </div>

                <div className="p-5 bg-gray-50/50 flex-1 space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted font-bold">
                        <span className="text-primary mr-2 italic">{item.quantity}x</span> 
                        {item.name}
                      </span>
                      <span className="text-dark font-black tracking-tight">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  {order.notes && (
                    <div className="mt-4 p-3 bg-white text-primary text-[11px] rounded-xl border border-orange-100 italic flex gap-2 font-medium shadow-sm">
                      <FiAlertCircle className="shrink-0 mt-0.5 w-3.5 h-3.5" />
                      <span>"{order.notes}"</span>
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-gray-50 bg-white mt-auto">
                  <div className="flex justify-between items-center mb-5 px-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bill Amount</span>
                    <span className="text-xl font-black text-dark tracking-tighter italic">₹{order.total?.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => updateStatus(order.id, 'Accepted')}
                          className="flex-1 bg-primary hover:bg-orange-600 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                        >
                          <FiCheck className="w-4 h-4" /> Accept
                        </button>
                        <button 
                          onClick={() => updateStatus(order.id, 'Cancelled')}
                          className="px-4 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 py-3.5 rounded-2xl font-black transition-all border border-gray-100"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {order.status === 'Accepted' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'Preparing')}
                        className="w-full bg-dark hover:bg-black text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                      >
                        <FiCoffee className="w-4 h-4" /> Start Prep
                      </button>
                    )}

                    {order.status === 'Preparing' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'Ready')}
                        className="w-full bg-success hover:opacity-90 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                      >
                        <FiCheck className="w-4 h-4" /> Mark Ready
                      </button>
                    )}

                    {order.status === 'Ready' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'Served')}
                        className="w-full bg-primary hover:bg-orange-600 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                      >
                        <FiSmile className="w-4 h-4" /> Served
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {categorizedOrders[activeTab].length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-50"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                 <FiCheck className="w-10 h-10" strokeWidth={3} />
              </div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Nothing to show</h3>
            </motion.div>
          )}
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-dark font-black text-2xl shadow-sm border border-gray-100">
                    {selectedOrder.tableNumber}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-dark tracking-tighter uppercase leading-none">Order Details</h2>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5 flex items-center gap-2">
                       <FiHash className="text-primary" /> {selectedOrder.orderNumber} • {format(selectedOrder.createdAt, 'hh:mm a')}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 bg-white hover:bg-gray-100 rounded-2xl transition-all shadow-sm border border-gray-100">
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[60vh] space-y-8">
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-xs font-black text-muted uppercase tracking-widest">
                     <FiUser className="text-primary w-3.5 h-3.5" /> Customer Info
                   </div>
                   <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                      <span className="font-bold text-dark">{selectedOrder.customerName || 'Anonymous Guest'}</span>
                      <span className={clsx("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", getStatusColor(selectedOrder.status))}>
                        {selectedOrder.status}
                      </span>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-xs font-black text-muted uppercase tracking-widest">
                     <FiCoffee className="text-primary w-3.5 h-3.5" /> Order Content
                   </div>
                   <div className="space-y-3 px-1">
                     {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-dark">{item.name}</span>
                              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Qty: {item.quantity}</span>
                           </div>
                           <span className="font-black text-dark tracking-tight">₹{item.price * item.quantity}</span>
                        </div>
                     ))}
                   </div>
                </div>

                {selectedOrder.notes && (
                  <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 italic text-[11px] font-bold text-primary flex gap-3 shadow-sm">
                    <FiAlertCircle className="shrink-0 w-4 h-4" />
                    <span>"{selectedOrder.notes}"</span>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                   <span className="text-xs font-black text-muted uppercase tracking-[0.2em]">Final Total</span>
                   <span className="text-3xl font-black text-primary tracking-tighter italic font-serif">₹{selectedOrder.total?.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-4 bg-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-gray-200 hover:bg-black transition-all"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

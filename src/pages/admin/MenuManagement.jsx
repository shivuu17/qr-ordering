import { useState, useEffect } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { FiEdit2, FiTrash2, FiPlus, FiImage, FiX, FiCheck, FiPercent } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db, isDummyConfig } from '../../firebase/config';
import { doc, deleteDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function MenuManagement() {
  const { menuItems, categories, loading } = useMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: 0,
    category: '',
    image: '',
    available: true,
    isVeg: true,
    isBestseller: false,
    rating: 4.5,
    prepTime: '15 min'
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({ ...editingItem });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        discount: 0,
        category: categories[0]?.name || '',
        image: '',
        available: true,
        isVeg: true,
        isBestseller: false,
        rating: 4.5,
        prepTime: '15 min'
      });
    }
  }, [editingItem, categories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isDummyConfig) {
      toast.success(editingItem ? 'Item updated (Demo)' : 'Item added (Demo)');
      setIsModalOpen(false);
      return;
    }

    try {
      if (editingItem) {
        await updateDoc(doc(db, 'menuItems', editingItem.id), formData);
        toast.success('Item updated successfully');
      } else {
        await addDoc(collection(db, 'menuItems'), formData);
        toast.success('Item added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      if (isDummyConfig) {
        toast.success('Item deleted (Demo)');
        return;
      }
      try {
        await deleteDoc(doc(db, 'menuItems', id));
        toast.success('Item deleted');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete item');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading menu items...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500">Add, edit or update discounts on your menu items.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 font-bold"
        >
          <FiPlus /> ADD ITEM
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="p-5">Product Info</th>
                <th className="p-5 text-center">Price</th>
                <th className="p-5 text-center text-primary">Discount</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0 shadow-sm">
                        <img src={item.image || 'https://images.unsplash.com/photo-1541167760496-162939113a09?q=80&w=150&auto=format&fit=crop'} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{item.name}</p>
                        <p className="text-xs font-bold text-primary uppercase tracking-tighter">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-center font-bold text-gray-900 italic">₹{item.price}</td>
                  <td className="p-5 text-center">
                    {item.discount > 0 ? (
                      <span className="bg-orange-100 text-primary px-2.5 py-1 rounded-lg text-xs font-black flex items-center justify-center gap-1 w-fit mx-auto">
                        <FiPercent className="w-3 h-3" /> {item.discount}% OFF
                      </span>
                    ) : (
                      <span className="text-gray-300 font-bold text-xs">NO DISCOUNT</span>
                    )}
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.available ? 'Available' : 'Sold Out'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                        className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Side/Centered Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{editingItem ? 'Update Menu Item' : 'Create New Item'}</h2>
                  <p className="text-sm font-medium text-gray-500 italic">Make sure to add attractive images & discounts</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <FiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold"
                      placeholder="e.g. Hazelnut Latte"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold appearance-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Base Price (₹)</label>
                    <input 
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-black text-xl"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Discount */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                      <FiPercent className="w-3 h-3" /> Discount Percentage
                    </label>
                    <input 
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-orange-50/50 border-2 border-orange-100 rounded-2xl focus:border-primary outline-none transition-all font-black text-xl text-primary"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-medium italic"
                    placeholder="Describe the taste, ingredients and vibe..."
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Image URL</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiImage />
                    </div>
                    <input 
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-11 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-medium text-sm"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Inventory Status</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, available: true }))}
                      className={clsx(
                        "flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-2",
                        formData.available 
                          ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-100" 
                          : "bg-white border-gray-100 text-gray-400 hover:border-green-200"
                      )}
                    >
                      <FiCheck className={clsx("w-4 h-4", !formData.available && "opacity-0")} /> Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, available: false }))}
                      className={clsx(
                        "flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-2",
                        !formData.available 
                          ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-100" 
                          : "bg-white border-gray-100 text-gray-400 hover:border-rose-200"
                      )}
                    >
                      <FiX className={clsx("w-4 h-4", formData.available && "opacity-0")} /> Out of Stock
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isVeg"
                      checked={formData.isVeg}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded-lg border-2 border-gray-300 text-green-600 focus:ring-green-500 accent-green-600" 
                    />
                    <span className="text-sm font-bold text-gray-700">Pure Veg</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isBestseller"
                      checked={formData.isBestseller}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded-lg border-2 border-gray-300 text-primary focus:ring-primary accent-primary" 
                    />
                    <span className="text-sm font-bold text-gray-700 italic">⭐ Bestseller</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                  >
                    <FiCheck className="w-5 h-5" /> {editingItem ? 'Save Changes' : 'Confirm & Add'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

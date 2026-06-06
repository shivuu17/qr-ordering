import { useState, useMemo } from 'react';
import { useMenu } from '../../hooks/useMenu';
import ProductCard from '../../components/ui/ProductCard';
import { FiSearch, FiZap, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Menu() {
  const { categories, menuItems, loading } = useMenu();
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  
  const tableNumber = sessionStorage.getItem('tableNumber');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [menuItems, activeCategory]);

  if (loading) {
    return (
      <div className="p-4 space-y-6 bg-background h-screen">
        <div className="h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-white rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background">
      {/* Compact Swiggy-style Header */}
      <div className="bg-white px-5 pt-6 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl text-white">
              <FiZap className="fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-lg font-black text-dark leading-none">Brew Haven</h1>
                <FiMapPin className="text-primary w-3 h-3" />
              </div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                {tableNumber ? `Dining at Table ${tableNumber}` : 'Local Café'}
              </p>
            </div>
          </div>
        </div>

        {/* Categories Pills - Small & Efficient */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
          <button
            onClick={() => setActiveCategory('All')}
            className={clsx(
              "px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all border",
              activeCategory === 'All'
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white text-muted border-gray-200"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={clsx(
                "px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all border flex items-center gap-1.5",
                activeCategory === cat.name
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white text-muted border-gray-200"
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-6">
        {/* Banner Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden h-40 bg-gradient-to-br from-primary to-orange-400 p-6 flex flex-col justify-center shadow-lg shadow-orange-200"
        >
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mb-10 blur-2xl"></div>
          <p className="text-orange-100 text-xs font-black uppercase tracking-widest mb-1">Today's Special</p>
          <h2 className="text-2xl font-black text-white leading-tight mb-2">20% OFF on <br />All Cappuccinos</h2>
          <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase border border-white/20">
            Limited Time Offer
          </div>
          <img 
            src="https://pngimg.com/uploads/mug_coffee/mug_coffee_PNG16824.png" 
            alt="Coffee" 
            className="absolute -right-4 -bottom-4 w-40 h-40 object-contain drop-shadow-2xl opacity-90"
          />
        </motion.div>

        {/* Menu Grid - 2 columns for better browsing */}
        <div>
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-black text-dark text-lg uppercase tracking-tight"> Artisanal Menu </h3>
             <span className="text-[10px] font-black text-primary bg-orange-50 px-2 py-1 rounded-md border border-orange-100 uppercase tracking-widest">{filteredItems.length} items</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                  onClick={(p) => console.log(p)} 
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <p className="text-muted font-bold text-sm">No items found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

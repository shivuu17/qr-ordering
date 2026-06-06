import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiShoppingBag, FiList } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import clsx from 'clsx';

export default function BottomNav() {
  const location = useLocation();
  const { itemCount } = useCart();
  
  const navItems = [
    { name: 'Menu', path: '/menu', icon: FiHome },
    { name: 'Search', path: '/search', icon: FiSearch },
    { name: 'Basket', path: '/cart', icon: FiShoppingBag, badge: itemCount },
    { name: 'Orders', path: '/tracking', icon: FiList },
  ];

  if (['/', '/checkout'].includes(location.pathname) || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-2 pb-safe z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center relative py-1 px-3 rounded-2xl transition-all duration-300"
            >
              <div className="relative">
                <Icon className={clsx(
                  "w-5 h-5 transition-all duration-300", 
                  isActive ? "text-primary stroke-[2.5px] scale-110" : "text-gray-400 stroke-[2px]"
                )} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={clsx(
                "text-[9px] mt-1 font-bold uppercase tracking-widest transition-all duration-300",
                isActive ? "text-primary opacity-100" : "text-gray-400 opacity-60"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

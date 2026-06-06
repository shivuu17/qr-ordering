import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiList, FiCoffee, FiTag, FiLogOut } from 'react-icons/fi';
import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';
import clsx from 'clsx';

export default function AdminLayout() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const isDummy = db.app.options.apiKey === "dummy_api_key";

  if (!currentUser && !isDummy) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    if (!isDummy) {
      await signOut(auth);
    } else {
      window.location.href = '/admin/login'; // Simple redirect for dummy mode
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiHome },
    { name: 'Orders', path: '/admin/orders', icon: FiList },
    { name: 'Menu', path: '/admin/menu', icon: FiCoffee },
    { name: 'Categories', path: '/admin/categories', icon: FiTag },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-primary flex items-center gap-2">
            <FiCoffee /> Admin Panel
          </span>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-white" 
                        : "text-gray-600 hover:bg-orange-50 hover:text-primary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:hidden justify-between">
          <span className="text-lg font-bold text-primary">Admin Panel</span>
          <button onClick={handleLogout} className="text-red-600 p-2">
            <FiLogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden bg-white border-t border-gray-200 flex justify-around p-2 pb-safe">
           {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={clsx(
                    "flex flex-col items-center justify-center p-2 rounded-lg",
                    isActive ? "text-primary" : "text-gray-500"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
}

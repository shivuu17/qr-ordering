import { useState, useMemo } from 'react';
import { useMenu } from '../../hooks/useMenu';
import ProductCard from '../../components/ui/ProductCard';
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const { menuItems } = useMenu();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.category?.toLowerCase().includes(lowerQuery)
    );
  }, [menuItems, query]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 border-b border-gray-100 sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
          <FiArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3 py-2">
          <FiSearch className="text-gray-400 w-5 h-5" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu..."
            className="flex-1 bg-transparent border-none outline-none px-2 text-dark"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 p-1">
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {query.trim() === '' ? (
          <div className="text-center mt-20 text-gray-500">
            <FiSearch className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Type to search for your favorite items</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">Found {filteredItems.length} results</p>
            {filteredItems.map(item => (
              <ProductCard key={item.id} product={item} onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20 text-gray-500">
            <p>No items found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

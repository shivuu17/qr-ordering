import { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';

export default function Categories() {
  const { categories, loading } = useMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      if (db.app.options.apiKey === "dummy_api_key") {
        toast.success('Category deleted (Dummy)');
        return;
      }
      try {
        await deleteDoc(doc(db, 'categories', id));
        toast.success('Category deleted');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete category');
      }
    }
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingCat(null);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading categories...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500">Manage your menu categories.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-colors"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-800">{cat.name}</span>
            <div className="flex gap-1">
              <button 
                onClick={() => openEditModal(cat)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(cat.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingCat ? 'Edit Category' : 'Add New Category'}</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input 
                type="text" 
                defaultValue={editingCat ? editingCat.name : ''}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                placeholder="e.g. Coffee"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  toast.success(editingCat ? 'Category updated (Dummy)' : 'Category added (Dummy)');
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

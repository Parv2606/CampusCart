// Modal to edit an existing product in MongoDB Atlas via PUT /api/products/:id
import React from 'react';
import { Edit3, X } from '../icons.jsx';

export default function EditProductModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit
}) {
  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto site-container">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full flex flex-col shadow-xl overflow-hidden animate-scale-up max-h-[92vh] my-auto">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Edit Product Listing</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Update item details directly in MongoDB Atlas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Item Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 font-medium"
              >
                <option value="Books & Notes">Books & Notes</option>
                <option value="Electronics">Electronics</option>
                <option value="Calculators">Calculators</option>
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="Bicycles">Bicycles</option>
                <option value="Furniture">Furniture</option>
                <option value="Sports Equipment">Sports Equipment</option>
                <option value="Other Essentials">Other Essentials</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 font-medium"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 font-medium"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-blue-600"
              placeholder="Describe item condition, accessories, and campus hand-off details..."
            />
          </div>

          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

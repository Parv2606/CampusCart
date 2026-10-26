// Core React and icon components
import React, { useState } from 'react';
import { X, Calculator, Tag, ArrowRight, Check } from '../icons.jsx';

// Interactive campus fair-price calculator modal dialog
export default function ResaleCalculatorModal({ isOpen, onClose, onApplyToListing }) {
  // Calculator input state variables
  const [category, setCategory] = useState('Calculators');
  const [originalPrice, setOriginalPrice] = useState(2500);
  const [semestersUsed, setSemestersUsed] = useState(2);
  const [condition, setCondition] = useState('Like New');

  // If modal is closed, do not render
  if (!isOpen) return null;

  // Depreciation formula based on campus market wear and category
  const conditionMultipliers = {
    'Brand New': 0.85,
    'Like New': 0.68,
    'Good': 0.52,
    'Fair': 0.38
  };

  const semesterDecay = Math.max(0.65, 1 - (semestersUsed * 0.08));
  const categoryMultiplier = category === 'Books & Notes' ? 0.6 : category === 'Calculators' ? 0.75 : 0.65;
  const estimatedPrice = Math.max(
    100,
    Math.round(originalPrice * (conditionMultipliers[condition] || 0.6) * semesterDecay * (categoryMultiplier / 0.65))
  );

  const studentSavingsPercent = Math.round(((originalPrice - estimatedPrice) / originalPrice) * 100);

  // Apply suggested price back to parent listing form
  const handleApply = () => {
    if (onApplyToListing) {
      onApplyToListing({
        category,
        suggestedPrice: estimatedPrice,
        condition
      });
    }
    onClose();
  };

  return (
    // Modal backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 animate-fade-in overflow-y-auto">
      {/* Dialog container */}
      <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full flex flex-col shadow-lg overflow-hidden animate-scale-up max-h-[92vh] my-auto">
        {/* Modal header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Campus Fair-Price Estimator</h3>
              <p className="text-xs text-slate-500">Calculate recommended student resale value</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Calculator"
            className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive form controls */}
        <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700 overflow-y-auto">
          {/* Category selection */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">Item Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600"
            >
              <option value="Calculators">Calculators (TI-84, Casio FX)</option>
              <option value="Books & Notes">Textbooks & Academic Notes</option>
              <option value="Electronics">Electronics & Headphones</option>
              <option value="Bicycles">Bicycles & Campus Mobility</option>
              <option value="Lab Equipment">Lab Equipment & Calipers</option>
              <option value="Furniture">Hostel / Dorm Furniture</option>
            </select>
          </div>

          {/* Original price range slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-900">Original Purchase Price</label>
              <span className="font-bold text-slate-900">₹{Number(originalPrice).toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="200"
              max="20000"
              step="100"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>₹200</span>
              <span>₹10,000</span>
              <span>₹20,000</span>
            </div>
          </div>

          {/* Semesters used and physical condition inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-900 block mb-1">Semesters Used</label>
              <select
                value={semestersUsed}
                onChange={(e) => setSemestersUsed(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600"
              >
                <option value={1}>1 Semester (Recent)</option>
                <option value={2}>2 Semesters (1 Year)</option>
                <option value={3}>3 Semesters</option>
                <option value={4}>4 Semesters (2 Years)</option>
                <option value={6}>6+ Semesters (Senior)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">Physical Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600"
              >
                <option value="Brand New">Brand New (Unopened)</option>
                <option value="Like New">Like New (Flawless)</option>
                <option value="Good">Good (Minor wear)</option>
                <option value="Fair">Fair (Well used)</option>
              </select>
            </div>
          </div>

          {/* Estimation calculation results card */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 space-y-2 mt-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">Fair Campus Resale Value</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  ₹{estimatedPrice.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {studentSavingsPercent}% Buyer Savings
                </span>
                <p className="text-[10px] text-slate-500 mt-1">High probability of same-day campus trade</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 border-t border-blue-200 pt-2">
              Recommended Hand-Off: <span className="font-semibold text-slate-800">Central Library Quad</span> • Typical student hand-off takes ~15 minutes.
            </p>
          </div>
        </div>

        {/* Modal footer with action buttons */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-md border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-md bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Listing</span>
          </button>
        </div>
      </div>
    </div>
  );
}


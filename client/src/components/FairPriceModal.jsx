// Campus Fair-Price Tool Modal Component
import React, { useState } from 'react';
import { Calculator, X, Check } from '../icons.jsx';

export default function FairPriceModal({ isOpen, onClose, onApplyToListing }) {
  const [category, setCategory] = useState('Calculators');
  const [originalPrice, setOriginalPrice] = useState(2500);
  const [semestersUsed, setSemestersUsed] = useState(2);
  const [condition, setCondition] = useState('Like New');

  if (!isOpen) return null;

  // Depreciation formula based on campus market wear and category
  const conditionMultipliers = {
    'Brand New': 0.85,
    'Like New': 0.70,
    'Good': 0.55,
    'Fair': 0.40
  };

  const semesterDecay = Math.max(0.65, 1 - (semestersUsed * 0.08));
  const categoryMultiplier = category === 'Books & Notes' ? 0.6 : category === 'Calculators' ? 0.75 : 0.65;
  const estimatedPrice = Math.max(
    100,
    Math.round(originalPrice * (conditionMultipliers[condition] || 0.6) * semesterDecay * (categoryMultiplier / 0.65))
  );

  const studentSavingsPercent = Math.max(0, Math.round(((originalPrice - estimatedPrice) / originalPrice) * 100));

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full flex flex-col shadow-2xl overflow-hidden animate-scale-up max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Campus Fair-Price Tool</h3>
              <p className="text-xs text-slate-500">Calculate recommended student peer resale value</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Calculator"
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Controls */}
        <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700 overflow-y-auto">
          {/* Category */}
          <div>
            <label className="font-bold text-slate-900 block mb-1.5">Item Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            >
              <option value="Calculators">Calculators (TI-84, Casio FX, Scientific)</option>
              <option value="Books & Notes">Textbooks, Reference Books & Notes</option>
              <option value="Electronics">Electronics, Headphones & Peripherals</option>
              <option value="Bicycles">Bicycles & Campus Mobility</option>
              <option value="Lab Equipment">Lab Equipment, Coats & Instruments</option>
              <option value="Furniture">Hostel / Dorm Furniture</option>
              <option value="Other Essentials">Other Campus Essentials</option>
            </select>
          </div>

          {/* Original purchase price slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-900">Original Purchase Price (New)</label>
              <span className="font-black text-slate-900 text-sm">₹{Number(originalPrice).toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="200"
              max="25000"
              step="100"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>₹200</span>
              <span>₹12,500</span>
              <span>₹25,000</span>
            </div>
          </div>

          {/* Semesters & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-900 block mb-1.5">Semesters Used</label>
              <select
                value={semestersUsed}
                onChange={(e) => setSemestersUsed(Number(e.target.value))}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value={1}>1 Semester (Recent)</option>
                <option value={2}>2 Semesters (1 Academic Year)</option>
                <option value={3}>3 Semesters</option>
                <option value={4}>4 Semesters (2 Years)</option>
                <option value={6}>6+ Semesters (Senior / Grad)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1.5">Physical Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-[#f8fafc] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="Brand New">Brand New (Unopened)</option>
                <option value="Like New">Like New (Flawless)</option>
                <option value="Good">Good (Minor normal wear)</option>
                <option value="Fair">Fair (Noticeable wear)</option>
              </select>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 space-y-2.5 mt-2">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                  Recommended Fair Resale Value
                </span>
                <div className="text-3xl font-black text-slate-900 mt-0.5 tracking-tight">
                  ₹{estimatedPrice.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="bg-blue-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs inline-block">
                  {studentSavingsPercent}% Savings
                </span>
                <p className="text-[10px] text-slate-500 font-medium mt-1">High campus demand</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 border-t border-blue-200/60 pt-2 leading-relaxed">
              Based on campus student exchange demand at your university. Items priced at this rate typically close within 24 hours.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Apply to My Listing</span>
          </button>
        </div>
      </div>
    </div>
  );
}

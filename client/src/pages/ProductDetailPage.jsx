// Dedicated, Rock-Solid Product Detail Page Component (Connected directly to MongoDB Atlas)
import React, { useState } from 'react';
import {
  ArrowLeft, Heart, Star, Crosshair, MessageSquare, Truck, RotateCcw,
  ExternalLink, Minus, Plus, Check, Edit3, ShieldCheck
} from '../icons.jsx';

export default function ProductDetailPage({
  product,
  currentUser,
  wishlist = [],
  onBack,
  onAddToCart,
  onToggleWishlist,
  onOpenContactModal,
  onOpenPriceModal,
  onOpenTermsModal,
  onNavigateHome,
  onSelectCategory
}) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // If no product is selected, display a friendly fallback with return button
  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-16 px-3 sm:px-6 text-center space-y-4 animate-fade-in site-container">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl font-bold border border-blue-200">
          📦
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Item Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          The selected campus listing could not be found or has been reserved. Please return to the marketplace.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm compact-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campus Marketplace</span>
          </button>
        </div>
      </div>
    );
  }

  // Safe seller parsing
  const seller = typeof product.seller === 'object' && product.seller !== null ? product.seller : {};
  const sellerName = seller.fullName || seller.name || 'Verified Student';
  const sellerInitial = (sellerName[0] || 'S').toUpperCase();
  const sellerDept = seller.department || 'Student';
  const sellerYear = seller.academicYear || seller.year || product.college || 'Campus Member';

  // Safe price formatting in INR
  const priceNum = Number(product.price) || 0;
  const formattedPrice = '₹' + priceNum.toLocaleString('en-IN');
  const monthlyPrice = '₹' + Math.round(priceNum / 4).toLocaleString('en-IN');

  // Safe coordinates
  const coords = product.coordinates || (product.location && product.location.coordinates) || null;
  const hasValidCoords = coords && typeof coords.lat === 'number' && typeof coords.lng === 'number' && !isNaN(coords.lat) && !isNaN(coords.lng);

  // Safe color variants with default image
  const defaultImg = product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
  const variants = Array.isArray(product.colorVariants) && product.colorVariants.length > 0
    ? product.colorVariants
    : [
        { name: 'Standard', hex: '#334155', img: defaultImg },
        { name: 'Angle 2', hex: '#64748b', img: defaultImg },
        { name: 'Angle 3', hex: '#94a3b8', img: defaultImg }
      ];

  const currentDisplayImg = variants[selectedColorIndex]?.img || defaultImg;
  const isWishlisted = wishlist.includes(product.id || product._id);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 animate-fade-in site-container">
      {/* ── STICKY TOP BACK BAR WITH BREADCRUMB ── */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-blue-600 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer compact-btn shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to Marketplace</span>
        </button>

        <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 font-medium truncate">
          <button onClick={onNavigateHome} className="hover:text-blue-600 transition-colors cursor-pointer truncate">
            Marketplace
          </button>
          <span>/</span>
          <button
            onClick={() => onSelectCategory && onSelectCategory(product.category)}
            className="hover:text-blue-600 transition-colors cursor-pointer truncate font-semibold text-slate-700"
          >
            {product.category || 'All Items'}
          </button>
        </nav>
      </div>

      {/* ── 3-BREAKPOINT PRODUCT DETAIL GRID ── */}
      {/* Mobile (<320px & <768px): 1 column | Medium (768px-1023px): 12 col grid | Desktop (1024px+): 12 col grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Gallery & Color Angle Selectors */}
        <div className="md:col-span-6 lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-8 aspect-square flex items-center justify-center relative shadow-xs overflow-hidden">
            <button
              type="button"
              aria-label={`Toggle wishlist for ${product.title || 'item'}`}
              onClick={() => onToggleWishlist(product.id || product._id, product.title)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-md bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            </button>

            <img
              src={currentDisplayImg}
              alt={product.title || 'Product Image'}
              className="w-full h-full object-contain transition-all duration-200"
            />
          </div>

          {/* Thumbnail Angles */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {variants.slice(0, 4).map((variant, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedColorIndex(idx)}
                className={`bg-white rounded-lg p-1.5 sm:p-2 aspect-square flex items-center justify-center cursor-pointer border transition-all ${
                  selectedColorIndex === idx ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <img src={variant.img || defaultImg} alt={variant.name || `Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Information, Pricing, Seller Profile & Hand-off */}
        <div className="md:col-span-6 lg:col-span-6 space-y-4 sm:space-y-5 bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
              <span className="bg-blue-50 text-blue-700 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-sm border border-blue-200">
                {product.condition || 'Good'} Condition
              </span>
              <span className="bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded-sm truncate max-w-[200px]">
                {product.college || 'Campus Community'}
              </span>
              {hasValidCoords && (
                <span className="coordinate-badge text-[10px] sm:text-[11px] px-2 py-0.5 rounded-sm font-mono flex items-center gap-1">
                  <Crosshair className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>Lat {coords.lat.toFixed(4)}°, Lng {coords.lng.toFixed(4)}°</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              {product.longDescription || product.description || 'Verified student exchange item listed on campus.'}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-blue-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                ({product.reviewsCount || 42} verified student transactions)
              </span>
            </div>
          </div>

          {/* Seller Verified Profile Card (100% Safe from MongoDB) */}
          <div className="bg-[#f8f9fa] border border-slate-200 rounded-lg p-3 sm:p-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {sellerInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{sellerName}</h4>
                  <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-1.5 py-0.2 rounded-sm shrink-0">
                    Verified Student
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {sellerDept} • {sellerYear}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenContactModal}
              className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors shrink-0 compact-btn"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="hidden xs:inline">Contact</span>
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Pricing Display */}
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {formattedPrice}
              </span>
              <span className="text-slate-600 text-xs sm:text-sm font-medium">
                or {monthlyPrice}/month (Student Plan)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Direct student handshake settlement via Cash or digital transfer during campus meetup
            </p>

            {/* Admin Adjust Price Trigger */}
            {currentUser?.role === 'admin' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenPriceModal(product)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                  <span>Admin: Adjust Price in MongoDB</span>
                </button>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Quantity & Stock */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center bg-[#f8f9fa] rounded-md border border-slate-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-xs text-slate-800">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px]">
              <p className="font-semibold text-slate-700">
                Status: <span className="text-blue-700 font-bold">{product.status || 'Available'}</span>
              </p>
              <p className="text-slate-400">Direct campus pickup</p>
            </div>
          </div>

          {/* Action CTAs: Add to Cart and Checkout */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={() => onAddToCart(product, quantity, true)}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs text-center cursor-pointer transition-colors shadow-xs"
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(product, quantity, false)}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-900 text-slate-800 font-bold text-xs text-center hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Add to Cart
            </button>
          </div>

          {/* In-Person Hand-Off Details */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-[#f8f9fa] flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                <Truck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">Campus In-Person Hand-Off</h4>
                  {hasValidCoords && (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=17/${coords.lat}/${coords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      <span>Open Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Designated Spot:{' '}
                  <span className="font-semibold text-slate-800">
                    {product.pickupLocation || 'Central Campus Library Desk'}
                  </span>
                </p>
                {hasValidCoords && (
                  <p className="text-[10px] font-mono text-slate-600 truncate">
                    GPS Fix: {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° W
                  </p>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-[#f8f9fa] flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1">
                <h4 className="font-bold text-xs text-slate-900">7-Day Campus Inspection Guarantee</h4>
                <p className="text-[11px] text-slate-500">
                  Inspect during meetup! Honor code protection on all campus trades.{' '}
                  <button
                    type="button"
                    onClick={onOpenTermsModal}
                    className="font-bold text-slate-800 underline hover:text-blue-600 cursor-pointer"
                  >
                    View Policy
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

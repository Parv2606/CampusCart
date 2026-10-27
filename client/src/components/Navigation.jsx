// Unified Navigation Component combining Responsive Navbar (<320px, Medium, Large) & Mobile Drawer
import React from 'react';
import {
  ShoppingCart, Search, User, Plus, Receipt, ShieldAlert,
  GraduationCap, ArrowLeft, Menu, X, ChevronRight, LogIn, LogOut, Package, Calculator
} from '../icons.jsx';

export default function Navigation({
  currentView,
  currentUser,
  activeUniversity,
  searchQuery,
  cartTotalItems,
  transactionsCount,
  popularCategories = [],
  isMobileMenuOpen,
  onToggleMobileMenu,
  onSearchChange,
  onOpenUniversityModal,
  onOpenSellModal,
  onOpenAuthModal,
  onOpenCart,
  onOpenCalculator,
  onNavigateHome,
  onNavigateOrders,
  onNavigateAdmin,
  onNavigateMyListings,
  onBackToMarketplace,
  onLogout,
  onSelectCategory
}) {
  return (
    <>
      {/* ── STICKY TOP NAVBAR ── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 w-full site-container">
        {/* ROW 1: PRIMARY HEADER */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Brand Logo & Back Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer focus:outline-none shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:bg-blue-600 transition-colors">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 whitespace-nowrap nav-brand-title">
                  Campus<span className="text-blue-600">Cart</span>
                </span>
                <span className="hidden sm:block text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-1 whitespace-nowrap">
                  Student Exchange
                </span>
              </div>
            </button>

            {/* Quick Back to Marketplace button when in detail, checkout, or subviews */}
            {currentView !== 'home' && (
              <button
                type="button"
                onClick={onBackToMarketplace}
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] sm:text-xs font-bold border border-blue-200 transition-colors cursor-pointer shrink-0 compact-btn"
                title="Return to Catalog"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Back</span>
              </button>
            )}

            {/* University Campus Selector Badge (Medium & Large screens) */}
            <button
              type="button"
              onClick={onOpenUniversityModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
              title={`Active Campus: ${activeUniversity}`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate max-w-[120px] md:max-w-[180px] text-[11px] sm:text-xs">
                {activeUniversity}
              </span>
              <span className="text-[9px] bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0">
                Change
              </span>
            </button>
          </div>

          {/* Fluid Search Input (Hidden on mobile < 640px, visible on md and lg) */}
          <div className="hidden sm:block flex-1 max-w-xs md:max-w-md lg:max-w-lg mx-2 sm:mx-3 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search campus items, books, calculators..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#f8fafc] hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm rounded-lg pl-3 pr-8 py-1.5 sm:py-2 focus:outline-none focus:border-blue-600 border border-slate-200 transition-colors truncate"
              />
              <div className="absolute right-2.5 text-slate-400 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Admin Dashboard CTA */}
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={onNavigateAdmin}
                className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Hub</span>
              </button>
            )}

            {/* Sell Item CTA Button */}
            <button
              type="button"
              onClick={onOpenSellModal}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0 compact-btn"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">Sell Item</span>
              <span className="xs:hidden">Sell</span>
            </button>

            {/* Fair-Price Estimator CTA (Desktop) */}
            <button
              type="button"
              onClick={onOpenCalculator}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Campus Fair-Price Estimator"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Fair-Price Tool</span>
            </button>

            {/* My Orders / Transactions CTA (Desktop) */}
            <button
              type="button"
              onClick={onNavigateOrders}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer relative ${
                currentView === 'my-listings'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Orders</span>
              {transactionsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            {/* Cart Icon Button with Badge */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* User Account / Sign In Pill (Desktop) */}
            <div className="hidden md:flex items-center">
              {currentUser ? (
                <button
                  type="button"
                  onClick={onNavigateOrders}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors cursor-pointer text-xs font-bold text-slate-800"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                    {(currentUser.fullName || currentUser.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[90px] truncate">{currentUser.fullName || currentUser.name}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* 3-Lines Hamburger Menu Button (<768px Mobile & Tablet) */}
            <button
              type="button"
              onClick={() => onToggleMobileMenu(true)}
              className="md:hidden p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0 focus:outline-none"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
          </div>
        </div>

        {/* ROW 2: Mobile Search Bar (<640px) */}
        <div className="sm:hidden px-2 pb-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search campus items..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#f8fafc] text-slate-800 placeholder-slate-400 text-xs rounded-lg pl-3 pr-8 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-600 truncate"
            />
            <div className="absolute right-2.5 text-slate-400 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </nav>

      {/* ── RESPONSIVE MOBILE SLIDE-OUT DRAWER (<768px & <320px) ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => onToggleMobileMenu(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-5/6 max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-black text-sm sm:text-base tracking-tight">
                    Campus<span className="text-blue-400">Cart</span>
                  </span>
                  <p className="text-[9px] sm:text-[10px] text-slate-300">Student Marketplace</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleMobileMenu(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Campus Pill */}
            <div className="p-3 sm:p-4 border-b border-slate-100 bg-[#f8fafc]">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Active Campus
              </div>
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-xs font-bold text-slate-800 truncate">{activeUniversity}</span>
                <button
                  type="button"
                  onClick={() => {
                    onToggleMobileMenu(false);
                    onOpenUniversityModal();
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md shrink-0 cursor-pointer hover:bg-blue-100"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-2.5 sm:p-3 space-y-1 text-xs font-bold text-slate-700 flex-1">
              <button
                type="button"
                onClick={() => {
                  onNavigateHome();
                  onToggleMobileMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer ${
                  currentView === 'home' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span>Campus Catalog</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenSellModal();
                  onToggleMobileMenu(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-600 text-white font-extrabold shadow-xs transition-colors cursor-pointer hover:bg-blue-700 mt-2"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4" />
                  <span>+ Sell New Item</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenCart();
                  onToggleMobileMenu(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 text-slate-500" />
                  <span>Cart</span>
                </div>
                {cartTotalItems > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-blue-600 text-white">
                    {cartTotalItems} items
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenCalculator) onOpenCalculator();
                  onToggleMobileMenu(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-slate-700 font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span>Fair-Price Tool</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigateOrders();
                  onToggleMobileMenu(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer ${
                  currentView === 'my-listings' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-slate-500" />
                  <span>My Orders & Listings</span>
                </div>
                {transactionsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigateAdmin();
                    onToggleMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer ${
                    currentView === 'admin' ? 'bg-amber-100 text-amber-900 font-extrabold' : 'hover:bg-amber-50 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Admin Dashboard</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}

              {/* Popular Categories in Drawer */}
              {popularCategories.length > 0 && (
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <div className="px-2 pb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Categories
                  </div>
                  <div className="space-y-0.5">
                    {popularCategories.slice(0, 5).map(cat => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat.name);
                          onToggleMobileMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{cat.displayName || cat.name}</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Account Section in Drawer Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                      {(currentUser.fullName || currentUser.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate flex-1">
                      <div className="text-xs font-black text-slate-900 truncate">
                        {currentUser.fullName || currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {currentUser.studentId || currentUser.email}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onToggleMobileMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuthModal();
                    onToggleMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Student Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

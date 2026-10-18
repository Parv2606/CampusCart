import React from 'react';

// Gray placeholder skeleton blocks while content loads (No jitter, no blank flashes)
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between space-y-4 animate-pulse">
      <div className="relative rounded-md bg-slate-200 aspect-square flex items-center justify-center overflow-hidden">
        <div className="w-12 h-12 rounded-md bg-slate-300/70" />
      </div>

      <div className="space-y-2.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="h-3.5 bg-slate-200 rounded w-1/4" />
          <div className="h-3.5 bg-slate-200 rounded w-1/3" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-4/5" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-1/3" />
        <div className="h-8 bg-slate-200 rounded-md w-24" />
      </div>
    </div>
  );
}

export function CatalogGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

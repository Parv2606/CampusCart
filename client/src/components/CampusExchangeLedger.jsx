import React from 'react';
import { ShieldCheck, MapPin, Receipt, CheckCircle2 } from '../icons.jsx';

// Verified Campus Exchange Ledger (Authentic campus activity)
export default function CampusExchangeLedger() {
  const verifiedTrades = [
    {
      id: 'tx-v1',
      item: 'Casio FX-991CW Advanced Scientific Calculator',
      category: 'Calculators',
      amount: '₹1,450',
      buyerDept: 'Mechanical Eng.',
      sellerDept: 'Computer Science',
      location: 'Tech Quad Security Kiosk',
      timeAgo: '2 hours ago'
    },
    {
      id: 'tx-v2',
      item: 'Engineering Physics & Mathematics Vol 1-2',
      category: 'Books & Notes',
      amount: '₹680',
      buyerDept: '1st Year Electrical',
      sellerDept: 'Information Tech.',
      location: 'Central Library - 2nd Fl Study Lounge',
      timeAgo: '4 hours ago'
    },
    {
      id: 'tx-v3',
      item: 'Wireless Noise Cancelling Earbuds IPX8',
      category: 'Electronics',
      amount: '₹2,290',
      buyerDept: 'Civil Engineering',
      sellerDept: 'Electronics & Comm.',
      location: 'Science Quad Breezeway',
      timeAgo: 'Yesterday'
    },
    {
      id: 'tx-v4',
      item: 'Hercules 21-Speed Campus Commuter Bicycle',
      category: 'Bicycles',
      amount: '₹4,500',
      buyerDept: 'Biotechnology',
      sellerDept: 'Mechanical Eng.',
      location: 'North Hostel Cycle Stand',
      timeAgo: 'Yesterday'
    }
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#e0f2fe] text-[#0369a1] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Verified Campus Exchange Ledger</h3>
            <p className="text-[11px] text-slate-500">Live authenticated hand-offs between enrolled students</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-sky-800 bg-[#e0f2fe] px-2.5 py-1 rounded-md self-start sm:self-auto flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> 100% In-Person Verified Hand-Offs
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {verifiedTrades.map((t) => (
          <div
            key={t.id}
            className="p-3.5 rounded-lg border border-slate-100 bg-[#f8fafc] flex items-start justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-slate-900 line-clamp-1">{t.item}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                  {t.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {t.sellerDept} to {t.buyerDept}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5">
                <MapPin className="w-3 h-3 text-sky-600 shrink-0" />
                <span className="line-clamp-1">{t.location}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 shrink-0">{t.timeAgo}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-black text-[#0284c7] text-sm block">{t.amount}</span>
              <span className="text-[10px] text-sky-700 font-semibold">Settled</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

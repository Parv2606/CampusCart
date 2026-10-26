// Core React and icon components
import React from 'react';
import { X, ShieldCheck, FileText } from '../icons.jsx';

// Terms of service modal dialog for campus peer exchange rules
export default function TermsModal({ isOpen, onClose }) {
  // If modal is closed, do not render
  if (!isOpen) return null;

  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 animate-fade-in overflow-y-auto">
      {/* Dialog container */}
      <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full max-h-[88vh] flex flex-col shadow-lg overflow-hidden animate-scale-up my-auto">
        {/* Modal header with title and close button */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">CampusCart Terms of Service</h3>
              <p className="text-xs text-slate-500">Student Peer-to-Peer Campus Marketplace Agreement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Terms of Service"
            className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable legal terms content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 leading-relaxed">
          {/* Section 1: Campus affiliation and student eligibility */}
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">1. Campus Affiliation & Student Eligibility</h4>
            <p>
              CampusCart is an exclusive collegiate exchange network designed strictly for currently enrolled university students, faculty, and campus staff. By listing or purchasing items, you certify that you hold a valid university student identification number (e.g. 24BCE327) and are authorized to access campus grounds for physical hand-off.
            </p>
          </section>

          {/* Section 2: In-person safety and meetup hubs */}
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">2. In-Person Hand-Off Safety & Designated Hubs</h4>
            <p>
              To ensure personal security, all physical transactions must take place at university-designated public hubs during daylight or supervised hours. Recommended hubs include:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Central Library: 2nd Floor Study Lounge Desk (Lat 30.2849, Lng -97.7341)</li>
              <li>Engineering Education Complex: Tech Quad Security Kiosk (Lat 30.2882, Lng -97.7356)</li>
              <li>Student Center: Campus Post Office & Dining Commons</li>
            </ul>
            <p className="pt-1">
              Never accept meetups in private dorm rooms or off-campus unmonitored locations with unknown individuals.
            </p>
          </section>

          {/* Section 3: Prohibited items list */}
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">3. Prohibited University Items</h4>
            <p>
              Sellers are strictly barred from listing or exchanging:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Academic honor code violations (stolen examination papers, unauthorized test answer keys, paid proxy coursework).</li>
              <li>Alcohol, tobacco, e-cigarettes, prescription pharmaceuticals, and controlled substances.</li>
              <li>Weapons, hazardous laboratory chemicals, or unauthorized university equipment.</li>
              <li>Counterfeit electronics or pirated digital courseware.</li>
            </ul>
          </section>

          {/* Section 4: Transparent pricing rules */}
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">4. Transparent Pricing & Peer Settlement</h4>
            <p>
              All prices must be listed transparently with zero hidden fees. Payments are settled between peers directly via cash handshake or instant peer-to-peer digital transfer upon physical inspection of the item at the designated campus meetup hub. CampusCart does not collect payment processing fees from students.
            </p>
          </section>

          {/* Section 5: Inspection and protection period */}
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">5. 7-Day Campus Inspection & Honor Protection</h4>
            <p>
              Buyers are granted the right to inspect goods (functional test of calculators, battery check on headphones, textbook edition check) during meetup. If an undisclosed defect is discovered within 7 calendar days, both parties agree to resolve through the CampusCart Honor Mediation Desk.
            </p>
          </section>

          {/* Section 6: Limitation of liability */}
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">6. Limitation of University Liability</h4>
            <p>
              CampusCart is an independent student platform and not an official corporate retailer. The university administration assumes no direct tort liability for individual peer agreements. Users participate in good faith adhering to the Student Honor Code.
            </p>
          </section>
        </div>

        {/* Modal footer with confirmation button */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Effective Academic Year 2025-2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { X, Shield, Lock } from '../icons.jsx';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full max-h-[88vh] flex flex-col shadow-lg overflow-hidden animate-scale-up my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">CampusCart Privacy Policy</h3>
              <p className="text-xs text-slate-500">Student Data Protection & Campus FERPA Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Privacy Policy"
            className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 leading-relaxed">
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">1. Commitment to Student Privacy</h4>
            <p>
              CampusCart respects the privacy rights of all enrolled students. We operate under stringent privacy principles designed to protect student records in alignment with the Family Educational Rights and Privacy Act (FERPA) and Indian digital data protection standards.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">2. Information Collected & Student ID Safeguards</h4>
            <p>
              We collect only the bare minimum data required to facilitate safe campus trades:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Full Student Name & University Roll Number for peer trust verification.</li>
              <li>College affiliation and academic department (e.g. Computer Science and Engineering).</li>
              <li>Official campus email address for authentication and buyer-seller correspondence.</li>
              <li>Item listing details: condition, asking price, and campus photos.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">3. Campus Geolocation & Coordinate Masking</h4>
            <p>
              To protect personal residential safety, precise dorm room numbers and private hostel quarters are never published on the open catalog. Our geocoding system only references public university landmarks (such as the Central Library Study Desk or Tech Quad Gate). Full hand-off specifics are revealed only when a meetup is mutually confirmed.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">4. Zero Commercial Monetization or Ad Tracking</h4>
            <p>
              We maintain a zero-commercial monetization policy:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Your personal information is never sold, leased, or traded to third-party marketing brokers or advertisers.</li>
              <li>We do not place third-party behavioral ad trackers or cross-site fingerprinting scripts.</li>
              <li>Student transaction records are archived solely for buyer protection and fraud resolution.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">5. Cryptographic Password Security & Session Control</h4>
            <p>
              Student account passwords are encrypted using multi-round salted BCrypt hashing. Authentication tokens are issued via stateless JSON Web Tokens (JWT) stored in secure browser cookies or encrypted storage. Passwords are never stored in plaintext format.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">6. Account Deletion & Right to Be Forgotten</h4>
            <p>
              Graduating or departing students may request full deletion of their account profile and archived listings at any time by contacting the CampusCart Admin Desk or through the Student Profile management panel.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Strict Student Protection Standard</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Acknowledge Privacy Terms
          </button>
        </div>
      </div>
    </div>
  );
}

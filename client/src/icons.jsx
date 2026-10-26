// Core React library
import React from 'react';

// Reusable SVG wrapper component with consistent 1.75px stroke
const IconBase = ({ children, className = "w-4 h-4", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

// Shopping cart icon
export const ShoppingCart = (props) => (
  <IconBase {...props}>
    <path d="M2 3h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h9.6a1.5 1.5 0 0 0 1.5-1.2L22 6H6" />
    <circle cx="9.5" cy="19.5" r="1.5" />
    <circle cx="17.5" cy="19.5" r="1.5" />
  </IconBase>
);

export const Search = (props) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </IconBase>
);

export const Heart = ({ fill = "none", className = "w-4 h-4", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
  </svg>
);

export const User = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="7.5" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </IconBase>
);

export const Star = ({ fill = "none", className = "w-4 h-4", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const ChevronDown = (props) => (
  <IconBase {...props}>
    <path d="m6 9 6 6 6-6" />
  </IconBase>
);

export const Check = (props) => (
  <IconBase {...props}>
    <path d="M4 12.5 9 17.5 20 6.5" />
  </IconBase>
);

export const CheckCircle2 = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 5-5" />
  </IconBase>
);

// Delivery and action icons
export const Truck = (props) => (
  <IconBase {...props}>
    <rect x="2" y="5" width="13" height="11" rx="1" />
    <path d="M15 9h4l3 3v4h-7V9z" />
    <circle cx="6" cy="18.5" r="2" />
    <circle cx="18" cy="18.5" r="2" />
  </IconBase>
);

export const RotateCcw = (props) => (
  <IconBase {...props}>
    <path d="M3 12a9 9 0 1 0 2.64-6.36L2 9" />
    <path d="M2 3v6h6" />
  </IconBase>
);

export const X = (props) => (
  <IconBase {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </IconBase>
);

export const Plus = (props) => (
  <IconBase {...props}>
    <path d="M12 5v14M5 12h14" />
  </IconBase>
);

export const Minus = (props) => (
  <IconBase {...props}>
    <path d="M5 12h14" />
  </IconBase>
);

export const ArrowRight = (props) => (
  <IconBase {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </IconBase>
);

export const ArrowLeft = (props) => (
  <IconBase {...props}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </IconBase>
);

// Security and verification badge icons
export const Shield = (props) => (
  <IconBase {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </IconBase>
);

export const ShieldCheck = (props) => (
  <IconBase {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
);

export const ShieldAlert = (props) => (
  <IconBase {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4M12 16h.01" />
  </IconBase>
);

export const CreditCard = (props) => (
  <IconBase {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="6" y1="15" x2="10" y2="15" />
  </IconBase>
);

// Location and input visibility icons
export const MapPin = (props) => (
  <IconBase {...props}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </IconBase>
);

export const Phone = (props) => (
  <IconBase {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </IconBase>
);

export const Eye = (props) => (
  <IconBase {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);

export const EyeOff = (props) => (
  <IconBase {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </IconBase>
);

export const SlidersHorizontal = (props) => (
  <IconBase {...props}>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" fill="currentColor" />
    <circle cx="16" cy="12" r="2" fill="currentColor" />
    <circle cx="10" cy="18" r="2" fill="currentColor" />
  </IconBase>
);

export const Package = (props) => (
  <IconBase {...props}>
    <path d="M12 2.5 3.5 7v10L12 21.5l8.5-4.5V7L12 2.5z" />
    <path d="M3.8 7.2 12 11.5l8.2-4.3" />
    <line x1="12" y1="11.5" x2="12" y2="21.5" />
  </IconBase>
);

export const Trash2 = (props) => (
  <IconBase {...props}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </IconBase>
);

// Academic category and messaging icons
export const BookOpen = (props) => (
  <IconBase {...props}>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H11v18H4.5A2.5 2.5 0 0 0 2 22.5V4.5z" />
    <path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H13v18h6.5A2.5 2.5 0 0 1 22 22.5V4.5z" />
  </IconBase>
);

export const Bike = (props) => (
  <IconBase {...props}>
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M12 17.5V12l3-3h3.5" />
    <path d="m5.5 17.5 4.5-8 5 4.5" />
    <path d="M9 6h3" />
  </IconBase>
);

export const Layers = (props) => (
  <IconBase {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 12 12 17 22 12" />
    <polyline points="2 17 12 22 22 17" />
  </IconBase>
);

export const Tag = (props) => (
  <IconBase {...props}>
    <path d="M20.59 13.41 12 4.83A2 2 0 0 0 10.59 4.24H4a2 2 0 0 0-2 2v6.59a2 2 0 0 0 .59 1.41l8.59 8.59a2 2 0 0 0 2.83 0l6.58-6.58a2 2 0 0 0 0-2.84z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </IconBase>
);

export const MessageSquare = (props) => (
  <IconBase {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </IconBase>
);

export const Edit3 = (props) => (
  <IconBase {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 18.5 3 20l1.5-4L16.5 3.5z" />
  </IconBase>
);

export const AlertTriangle = (props) => (
  <IconBase {...props}>
    <path d="m10.29 3.86-8.29 14.5A2 2 0 0 0 3.71 21h16.58a2 2 0 0 0 1.71-2.64l-8.29-14.5a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </IconBase>
);

export const Send = (props) => (
  <IconBase {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </IconBase>
);

// Geolocation and map navigation icons
export const Navigation = (props) => (
  <IconBase {...props}>
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </IconBase>
);

export const Crosshair = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </IconBase>
);

export const Globe = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </IconBase>
);

export const ExternalLink = (props) => (
  <IconBase {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </IconBase>
);

export const Loader2 = ({ className = "w-4 h-4 animate-spin", ...props }) => (
  <IconBase className={className} {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </IconBase>
);

export const Compass = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </IconBase>
);

export const Receipt = (props) => (
  <IconBase {...props}>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="12" y2="15" />
  </IconBase>
);

// Authentication and student utility icons
export const Lock = (props) => (
  <IconBase {...props}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </IconBase>
);

export const LogIn = (props) => (
  <IconBase {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </IconBase>
);

export const LogOut = (props) => (
  <IconBase {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </IconBase>
);

export const UserPlus = (props) => (
  <IconBase {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </IconBase>
);

export const Calculator = (props) => (
  <IconBase {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <rect x="7" y="5" width="10" height="3" rx="0.5" />
    <line x1="8" y1="12" x2="8.01" y2="12" />
    <line x1="12" y1="12" x2="12.01" y2="12" />
    <line x1="16" y1="12" x2="16.01" y2="12" />
    <line x1="8" y1="16" x2="8.01" y2="16" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
    <line x1="16" y1="16" x2="16.01" y2="16" />
  </IconBase>
);

export const Scale = (props) => (
  <IconBase {...props}>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </IconBase>
);

export const FileText = (props) => (
  <IconBase {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </IconBase>
);

export const GraduationCap = (props) => (
  <IconBase {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </IconBase>
);


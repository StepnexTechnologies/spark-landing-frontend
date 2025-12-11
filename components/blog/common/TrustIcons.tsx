// Trust & Authority badge icons
export const TrustIconSVGs = {
  experience: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="20" rx="2" stroke="#9747FF" strokeWidth="2"/>
      <path d="M4 12H28" stroke="#9747FF" strokeWidth="2"/>
      <path d="M10 6V2" stroke="#9747FF" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 6V2" stroke="#9747FF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  expertise: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L20 10L28 11L22 17L24 26L16 22L8 26L10 17L4 11L12 10L16 2Z" stroke="#9747FF" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  verified: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L19 8L26 9L21 14L22 21L16 18L10 21L11 14L6 9L13 8L16 2Z" fill="#9747FF" fillOpacity="0.1"/>
      <path d="M12 16L15 19L21 13" stroke="#9747FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="16" r="12" stroke="#9747FF" strokeWidth="2"/>
    </svg>
  ),
  awards: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 20C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4C11.5817 4 8 7.58172 8 12C8 16.4183 11.5817 20 16 20Z" stroke="#9747FF" strokeWidth="2"/>
      <path d="M12 19V28L16 26L20 28V19" stroke="#9747FF" strokeWidth="2"/>
    </svg>
  ),
  following: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="10" r="4" stroke="#9747FF" strokeWidth="2"/>
      <path d="M4 24C4 20 7.5 17 12 17C16.5 17 20 20 20 24" stroke="#9747FF" strokeWidth="2"/>
      <circle cx="22" cy="12" r="3" stroke="#9747FF" strokeWidth="2"/>
      <path d="M28 24C28 21 25.5 19 22 19" stroke="#9747FF" strokeWidth="2"/>
    </svg>
  ),
  featured: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="18" rx="2" stroke="#9747FF" strokeWidth="2"/>
      <circle cx="12" cy="15" r="3" stroke="#9747FF" strokeWidth="2"/>
      <path d="M18 13H24" stroke="#9747FF" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 17H22" stroke="#9747FF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export type TrustIconType = keyof typeof TrustIconSVGs;

interface TrustBadgeProps {
  icon: TrustIconType;
  label: string;
  value: string;
  className?: string;
}

export function TrustBadge({ icon, label, value, className = "" }: TrustBadgeProps) {
  return (
    <div className={`flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 ${className}`}>
      <div className="mb-2">{TrustIconSVGs[icon]}</div>
      <p className="text-[#9747FF] text-sm font-medium">{label}</p>
      <p className="text-gray-600 text-sm">{value}</p>
    </div>
  );
}

interface TrustBadgesGridProps {
  items: Array<{ icon: TrustIconType; label: string; value: string }>;
  columns?: 2 | 3 | 6;
  className?: string;
}

export function TrustBadgesGrid({ items, columns = 3, className = "" }: TrustBadgesGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    6: "grid-cols-3 md:grid-cols-6",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {items.map((item, index) => (
        <TrustBadge key={index} {...item} />
      ))}
    </div>
  );
}

export default TrustIconSVGs;

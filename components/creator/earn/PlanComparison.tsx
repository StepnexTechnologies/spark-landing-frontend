'use client';

import { Check, X } from 'lucide-react';
import { forwardRef } from 'react';

// ============================================
// TYPES
// ============================================

export interface ComparisonRow {
  feature: string;
  free: string | boolean;
  pro: string | boolean;
}

interface PlanComparisonProps {
  comparisonData?: ComparisonRow[];
  showTitle?: boolean;
  showActionButtons?: boolean;
  showPricing?: boolean;
  onGetProMonthly?: () => void;
  onGetProAnnually?: () => void;
  className?: string;
  currentBillingCycle?: 'monthly' | 'yearly' | null;
}

// ============================================
// DEFAULT DATA
// ============================================

export const defaultComparisonData: ComparisonRow[] = [
  { feature: 'Monthly Invoices', free: '4 Free Forever', pro: 'Unlimited' },
  { feature: 'Automated AI Payment Reminders', free: '1(+300% limited period)', pro: '10' },
  { feature: 'Manual Payment Reminders', free: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Client Address Book', free: '12 Clients', pro: '100 Clients' },
  { feature: 'Automated Proof Of Work', free: false, pro: true },
  { feature: 'Pocket CFO', free: 'Essential', pro: 'Advanced' },
  { feature: 'Income Statement', free: 'Upto 6 months', pro: 'Upto 12 months' },
  { feature: 'CA Ready Record Exports', free: 'Basic CSV', pro: 'Tax/ GST Compliant CSV' },
];

// Indian pricing data (INR)
export const indianPricingData: ComparisonRow[] = [
  { feature: 'Price (Monthly)', free: '₹0/month (First Year)', pro: '₹199/month' },
  { feature: 'Price (Annual)', free: 'N/A', pro: '₹1,199/year (50% off)' },
];

// ============================================
// BUTTON COMPONENT (INLINE)
// ============================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outlined';
  label: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'outlined', label, className = '', disabled, ...props }, ref) => {
    const baseStyles =
      'rounded-full transition-all duration-200 py-3 px-5 font-medium text-sm md:text-base';

    const variantStyles = {
      primary:
        'text-white bg-[#8B5CF6] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed',
      outlined:
        'border border-white/50 text-white bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {label}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ============================================
// MAIN COMPONENT
// ============================================

// Helper to render cell value
const CellValue = ({ value }: { value: string | boolean }) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-white" />
    ) : (
      <X className="w-5 h-5 text-white/60" />
    );
  }
  return <>{value}</>;
};

const PlanComparison = forwardRef<HTMLDivElement, PlanComparisonProps>(
  (
    {
      comparisonData = defaultComparisonData,
      showTitle = true,
      showActionButtons = false,
      showPricing = false,
      onGetProMonthly,
      onGetProAnnually,
      className = '',
      currentBillingCycle = null,
    },
    ref
  ) => {
    const isMonthlyCurrentPlan = currentBillingCycle === 'monthly';
    const isYearlyCurrentPlan = currentBillingCycle === 'yearly';

    // Combine comparison data with pricing if showPricing is true
    const displayData = showPricing
      ? [...indianPricingData, ...comparisonData]
      : comparisonData;

    return (
      // Main container: bg-white 10% opacity, p-5
      <div
        ref={ref}
        className={`bg-[#FFFFFF1A] rounded-[20px] p-5 ${className}`}
      >
        {/* Title with p-[10px] */}
        {showTitle && (
          <h2 className="text-xl md:text-[18px] font-semibold text-white text-center md:text-left pb-[10px]">
            Plan Comparison
          </h2>
        )}

        {/* Mobile Layout - Vertical (Free/Pro as columns) */}
        <div className="md:hidden">
          {/* Table container with rounded-[4px] and light pink background */}
          <div className="bg-[#F5E8F566] rounded-[14px] overflow-hidden">
            {/* Column Headers */}
            <div className="grid grid-cols-2 bg-[#EDD9ED4D] px-2 py-3">
              <span className="text-base font-semibold text-white text-center">
                Free
              </span>
              <span className="text-base font-semibold text-white text-center">
                Pro
              </span>
            </div>

            {/* Comparison Rows */}
            <div className="flex flex-col">
              {displayData.map((row, index) => (
                <div key={index} className="flex flex-col">
                  {/* Feature Name Row - lighter pink background */}
                  <div className="bg-[#EDD9ED33] px-3 py-2.5 text-center">
                    <span className="text-sm text-white font-medium">
                      {row.feature}
                    </span>
                  </div>

                  {/* Values Row - light pink background */}
                  <div className="grid grid-cols-2 bg-[#F5E8F50D] px-3">
                    <span className="text-sm text-white font-normal text-center flex items-center justify-center py-2">
                      <CellValue value={row.free} />
                    </span>
                    <span className="text-sm text-white font-normal text-center flex items-center justify-center py-2">
                      <CellValue value={row.pro} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Horizontal table (Free/Pro as rows, features as columns) */}
        <div className="hidden md:block w-full max-w-full overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Table with rounded-[14px] and gap between rows */}
          <div className="inline-flex flex-col gap-[2px] rounded-[14px] overflow-hidden z-10 min-w-full">
            {/* Header row - bg-[#F2F2F2] 20% */}
            <div className="flex bg-[#F2F2F220] w-max min-w-full">
              <div className="p-3 text-left text-[16px] font-semibold text-white w-[80px] shrink-0 bg-[#F2F2F233]">
                Plan
              </div>
              {displayData.map((row, index) => (
                <div
                  key={index}
                  className="text-center text-[13px] font-semibold text-white w-[140px] shrink-0 flex items-center justify-center bg-[#F2F2F233] p-3"
                >
                  {row.feature}
                </div>
              ))}
            </div>
            {/* Free row - bg-[#F2F2F2] 20% */}
            <div className="flex bg-[#F2F2F203] w-max min-w-full">
              <div className="p-3 text-left text-[15px] font-semibold text-white w-[80px] shrink-0 bg-[#F2F2F233]">
                Free
              </div>
              {displayData.map((row, index) => (
                <div
                  key={index}
                  className="text-center text-[13px] text-white w-[140px] shrink-0 flex items-center justify-center bg-[#F2F2F233] p-3"
                >
                  <CellValue value={row.free} />
                </div>
              ))}
            </div>
            {/* Pro row - bg-[#F2F2F2] 20% */}
            <div className="flex bg-[#F2F2F203] w-max min-w-full">
              <div className="p-3 text-left text-[15px] font-semibold text-white w-[80px] shrink-0 bg-[#F2F2F233]">
                Pro
              </div>
              {displayData.map((row, index) => (
                <div
                  key={index}
                  className="text-center text-[13px] text-white w-[140px] shrink-0 flex items-center justify-center bg-[#F2F2F233] p-3"
                >
                  <CellValue value={row.pro} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActionButtons && (
          <div className="flex items-center gap-1.5 p-2 mt-4">
            <Button
              variant="outlined"
              onClick={isMonthlyCurrentPlan ? undefined : onGetProMonthly}
              label={isMonthlyCurrentPlan ? 'Current Plan' : 'Get Pro Monthly'}
              className="flex-1"
              disabled={isMonthlyCurrentPlan}
            />
            <Button
              variant="primary"
              onClick={isYearlyCurrentPlan ? undefined : onGetProAnnually}
              label={isYearlyCurrentPlan ? 'Current Plan' : 'Get Pro Annually'}
              className="flex-1"
              disabled={isYearlyCurrentPlan}
            />
          </div>
        )}
      </div>
    );
  }
);

PlanComparison.displayName = 'PlanComparison';

export default PlanComparison;

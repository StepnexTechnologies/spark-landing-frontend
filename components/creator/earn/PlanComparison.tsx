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
  { feature: 'Automated AI Payment Reminders', free: '1 (+300% limited period)', pro: '10' },
  { feature: 'Manual Payment Reminders', free: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Client Address Book', free: '12 Clients', pro: '100 Clients' },
  { feature: 'Automated Proof of Work', free: false, pro: true },
  { feature: 'Pocket CFO', free: 'Essential', pro: 'Advanced' },
  { feature: 'Income Statement', free: 'Upto 6 months', pro: 'Upto 12 months' },
  { feature: 'CA Ready Record Exports', free: 'Basic CSV', pro: 'Tax/ GST Compliant CSV' },
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
        'border border-[#8B5CF6] text-[#8B5CF6] bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed',
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
      <Check className="w-5 h-5 text-[#34C759]" />
    ) : (
      <X className="w-5 h-5 text-red-400" />
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
      onGetProMonthly,
      onGetProAnnually,
      className = '',
      currentBillingCycle = null,
    },
    ref
  ) => {
    const isMonthlyCurrentPlan = currentBillingCycle === 'monthly';
    const isYearlyCurrentPlan = currentBillingCycle === 'yearly';

    return (
      <div ref={ref} className={`flex flex-col gap-6 ${className}`}>
        {/* Title */}
        {showTitle && (
          <h2 className="text-xl md:text-[22px] font-semibold text-[#999999] text-center md:text-left">
            Plan Comparison
          </h2>
        )}

        {/* Mobile Layout - Vertical (Free/Pro as columns) */}
        <div className="md:hidden">
          {/* Column Headers */}
          <div className="grid grid-cols-2 px-2 mb-4">
            <span className="text-base font-semibold text-[#6B7280] text-center">
              Free
            </span>
            <span className="text-base font-semibold text-[#6B7280] text-center">
              Pro
            </span>
          </div>

          {/* Comparison Rows */}
          <div className="flex flex-col gap-1.5 px-2">
            {comparisonData.map((row, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                {/* Feature Name Row */}
                <div className="bg-[#F2F2F2] rounded-lg px-3 py-2.5 text-center">
                  <span className="text-sm text-[#999999] font-medium">
                    {row.feature}
                  </span>
                </div>

                {/* Values Row */}
                <div className="grid grid-cols-2 bg-white rounded-lg px-3">
                  <span className="text-sm text-[#999999] font-normal text-center flex items-center justify-center py-2">
                    <CellValue value={row.free} />
                  </span>
                  <span className="text-sm text-[#999999] font-normal text-center flex items-center justify-center py-2">
                    <CellValue value={row.pro} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Horizontal table (Free/Pro as rows, features as columns) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header row with features */}
            <thead>
              <tr>
                <th className="p-3 text-left text-base font-semibold text-[#6B7280] bg-[#F2F2F2] rounded-tl-lg min-w-[80px]">
                  Plan
                </th>
                {comparisonData.map((row, index) => (
                  <th
                    key={index}
                    className={`p-3 text-center text-sm font-medium text-[#999999] bg-[#F2F2F2] min-w-[120px] ${
                      index === comparisonData.length - 1 ? 'rounded-tr-lg' : ''
                    }`}
                  >
                    {row.feature}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Free row */}
              <tr className="border-b border-[#F2F2F2]">
                <td className="p-3 text-left text-base font-semibold text-[#6B7280] bg-[#F9F9F9]">
                  Free
                </td>
                {comparisonData.map((row, index) => (
                  <td
                    key={index}
                    className="p-3 text-center text-sm text-[#999999]"
                  >
                    <span className="flex items-center justify-center">
                      <CellValue value={row.free} />
                    </span>
                  </td>
                ))}
              </tr>
              {/* Pro row */}
              <tr>
                <td className="p-3 text-left text-base font-semibold text-[#6B7280] bg-[#F9F9F9] rounded-bl-lg">
                  Pro
                </td>
                {comparisonData.map((row, index) => (
                  <td
                    key={index}
                    className={`p-3 text-center text-sm text-[#999999] ${
                      index === comparisonData.length - 1 ? 'rounded-br-lg' : ''
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <CellValue value={row.pro} />
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        {showActionButtons && (
          <div className="flex items-center gap-1.5 p-2">
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

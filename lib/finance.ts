export const CENTRAL_BANK_LTV_NEW = 0.60;
export const CENTRAL_BANK_LTV_USED = 0.70;

export interface LeaseCalculation {
  isEligible: boolean;
  gap: number;
  monthlyRental: number;
  totalCost: number;
  totalInterest: number;
  loanAmount: number;
}

export function calculateLeasing(
  bikePrice: number, 
  durationMonths: number, 
  factorPer100k: number, 
  userCash: number, 
  condition: 'new' | 'used' = 'new'
): LeaseCalculation {
  
  const ltvLimit = condition === 'new' ? CENTRAL_BANK_LTV_NEW : CENTRAL_BANK_LTV_USED;
  const maxLoanAllowed = bikePrice * ltvLimit;

  let loanAmount = bikePrice - userCash;
  const gap = loanAmount - maxLoanAllowed;
  const isEligible = gap <= 0;

  const effectiveLoan = isEligible ? loanAmount : maxLoanAllowed;

  // Factor Method: (Loan / 100,000) * Factor
  const monthlyRental = (effectiveLoan / 100000) * factorPer100k;
  const totalLeaseCost = monthlyRental * durationMonths;
  const totalInterest = totalLeaseCost - effectiveLoan;

  return {
    isEligible,
    gap: gap > 0 ? gap : 0,
    monthlyRental: Math.round(monthlyRental),
    totalCost: Math.round(totalLeaseCost),
    totalInterest: Math.round(totalInterest),
    loanAmount: effectiveLoan
  };
}
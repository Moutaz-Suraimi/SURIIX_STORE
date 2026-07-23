import { useState, useEffect } from 'react';

export type PlanPackage = 'Starter' | 'Basic' | 'Professional' | string;

export interface PlanLimits {
  maxProducts: number;
  customDomain: boolean;
  coupons: boolean;
  offers: boolean;
  advancedReports: boolean;
  prioritySupport: boolean;
  whiteLabel: boolean;
  pwa: boolean;
  apiAccess: boolean;
  loyaltyPoints: boolean;
  maxStaff: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  Starter: {
    maxProducts: 100,
    customDomain: false,
    coupons: false,
    offers: false,
    advancedReports: false,
    prioritySupport: false,
    whiteLabel: false,
    pwa: false,
    apiAccess: false,
    loyaltyPoints: false,
    maxStaff: 1, 
  },
  Basic: {
    maxProducts: 500,
    customDomain: false,
    coupons: true,
    offers: true,
    advancedReports: true,
    prioritySupport: false,
    whiteLabel: false,
    pwa: false,
    apiAccess: false,
    loyaltyPoints: false,
    maxStaff: 3,
  },
  Professional: {
    maxProducts: Infinity, 
    customDomain: true,
    coupons: true,
    offers: true,
    advancedReports: true,
    prioritySupport: true,
    whiteLabel: true,
    pwa: true,
    apiAccess: true,
    loyaltyPoints: true,
    maxStaff: Infinity, 
  }
};

export const useFeatureAccess = (userPackage: PlanPackage = 'Starter') => {
  const lowerPackage = (userPackage || '').toLowerCase();
  
  let mappedPackage = 'Starter';
  // Check for Pro
  if (lowerPackage.includes('احترافي') || lowerPackage.includes('professional') || lowerPackage.includes('vip') || lowerPackage.includes('pro')) {
    mappedPackage = 'Professional';
  } 
  // Check for Basic
  else if (lowerPackage.includes('اساسي') || lowerPackage.includes('أساسي') || lowerPackage.includes('basic')) {
    mappedPackage = 'Basic';
  }
  // Otherwise Starter

  // Gracefully fallback to Starter if the package is not recognized
  const limits = PLAN_LIMITS[mappedPackage] || PLAN_LIMITS['Starter'];

  return {
    package: userPackage,
    limits,
    canAddProduct: (currentProductCount: number) => currentProductCount < limits.maxProducts,
    canAddStaff: (currentStaffCount: number) => currentStaffCount < limits.maxStaff,
    hasFeature: (featureName: keyof PlanLimits) => !!limits[featureName],
  };
};

export default useFeatureAccess;

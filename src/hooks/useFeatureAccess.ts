import { useState, useEffect } from 'react';

export type PlanPackage = 'Basic' | 'Professional' | 'Business' | string;

export interface PlanLimits {
  maxProducts: number;
  customDomain: boolean;
  loyaltyPoints: boolean;
  maxStaff: number;
  advancedReports: boolean;
  prioritySupport: boolean;
  whiteLabel: boolean;
  pwa: boolean;
  apiAccess: boolean;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  Basic: {
    maxProducts: 100,
    customDomain: false,
    loyaltyPoints: false,
    maxStaff: 1, // Only the owner
    advancedReports: false,
    prioritySupport: false,
    whiteLabel: false,
    pwa: false,
    apiAccess: false,
  },
  Professional: {
    maxProducts: 1000,
    customDomain: true,
    loyaltyPoints: true,
    maxStaff: 3,
    advancedReports: true,
    prioritySupport: true,
    whiteLabel: false,
    pwa: false,
    apiAccess: false,
  },
  Business: {
    maxProducts: Infinity, // Unlimited
    customDomain: true,
    loyaltyPoints: true,
    maxStaff: Infinity, // Unlimited
    advancedReports: true,
    prioritySupport: true,
    whiteLabel: true,
    pwa: true,
    apiAccess: true,
  }
};

export const useFeatureAccess = (userPackage: PlanPackage = 'Basic') => {
  // Gracefully fallback to basic if the package is not recognized
  const limits = PLAN_LIMITS[userPackage] || PLAN_LIMITS['Basic'];

  return {
    package: userPackage,
    limits,
    canAddProduct: (currentProductCount: number) => currentProductCount < limits.maxProducts,
    canAddStaff: (currentStaffCount: number) => currentStaffCount < limits.maxStaff,
    hasFeature: (featureName: keyof PlanLimits) => !!limits[featureName],
  };
};

export default useFeatureAccess;

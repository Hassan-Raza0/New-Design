// Phone Model Detection Utility
export interface DetectionResult {
  model: string;
  confidence: number;
  isValid: boolean;
  category: 'iphone' | 'samsung' | 'other' | 'invalid';
}

export interface ModelPricing {
  price: number;
  deductible: number;
  badge: 'green' | 'blue' | 'gold';
}

// Model pricing mapping based on your requirements
export const modelPricing: Record<string, ModelPricing> = {
  // iPhone 6, 7, 8 = $5
  'iPhone 6': { price: 5, deductible: 29, badge: 'green' },
  'iPhone 7': { price: 5, deductible: 29, badge: 'green' },
  'iPhone 8': { price: 5, deductible: 29, badge: 'green' },
  
  // iPhone 7 Plus, 8 Plus = $8
  'iPhone 7 Plus': { price: 8, deductible: 39, badge: 'blue' },
  'iPhone 8 Plus': { price: 8, deductible: 39, badge: 'blue' },
  
  // iPhone X, XS, XR = $9
  'iPhone X': { price: 9, deductible: 49, badge: 'blue' },
  'iPhone XS': { price: 9, deductible: 49, badge: 'blue' },
  'iPhone XR': { price: 9, deductible: 49, badge: 'blue' },
  
  // iPhone 11, 12, 13 = $10
  'iPhone 11': { price: 10, deductible: 59, badge: 'blue' },
  'iPhone 11 Pro': { price: 10, deductible: 59, badge: 'blue' },
  'iPhone 11 Pro Max': { price: 10, deductible: 59, badge: 'blue' },
  'iPhone 12': { price: 10, deductible: 59, badge: 'blue' },
  'iPhone 12 Pro': { price: 10, deductible: 59, badge: 'blue' },
  'iPhone 12 Pro Max': { price: 10, deductible: 59, badge: 'blue' },
  'iPhone 13': { price: 10, deductible: 59, badge: 'blue' },
  'iPhone 13 Pro': { price: 10, deductible: 59, badge: 'blue' },
  
  // iPhone 13 Pro Max to 16 Pro Max = $12
  'iPhone 13 Pro Max': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 14': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 14 Plus': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 14 Pro': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 14 Pro Max': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 15': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 15 Plus': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 15 Pro': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 15 Pro Max': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 16': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 16 Plus': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 16 Pro': { price: 12, deductible: 79, badge: 'gold' },
  'iPhone 16 Pro Max': { price: 12, deductible: 79, badge: 'gold' },
  
  // Samsung models = $12
  'Samsung Galaxy S24': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy S24+': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy S24 Ultra': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy S23': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy S23+': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy S23 Ultra': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy S22': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy S22+': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy S22 Ultra': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy Note 20': { price: 12, deductible: 79, badge: 'gold' },
  'Samsung Galaxy Note 20 Ultra': { price: 12, deductible: 79, badge: 'gold' },
};

export const phoneModels = Object.keys(modelPricing);

// Plan types
export interface PlanType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export const planTypes: PlanType[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    basePrice: 0, // Will be calculated based on device
    description: 'Essential protection for your device',
    features: [
      'Screen repair coverage',
      'Basic accidental damage',
      '24/7 customer support',
      '2 claims per year'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    basePrice: 19.99,
    description: 'Complete protection with premium features',
    features: [
      'Everything in Basic',
      'Theft protection',
      'Water damage coverage',
      'Unlimited claims',
      'Express replacement'
    ],
    popular: true
  },
  {
    id: 'family',
    name: 'Family Plan',
    basePrice: 34.99,
    description: 'Protect up to 5 devices under one plan',
    features: [
      'Up to 5 devices',
      'All Premium features',
      'Family dashboard',
      'Shared deductibles',
      'Device tracking',
      'Group discounts'
    ]
  }
];

// Calculate plan price based on device and plan type
export const calculatePlanPrice = (deviceModel: string, planType: string): number => {
  const devicePricing = modelPricing[deviceModel];
  if (!devicePricing) return 0;

  switch (planType) {
    case 'basic':
      return devicePricing.price;
    case 'premium':
      return 19.99;
    case 'family':
      return 34.99;
    default:
      return devicePricing.price;
  }
};

// Validate image file
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please upload only image files (JPG, PNG)' };
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  
  return { isValid: true };
};

// Get badge color for pricing
export const getBadgeColor = (badge: string): string => {
  switch (badge) {
    case 'green': return 'bg-green-100 text-green-800 border-green-200';
    case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Format confidence percentage
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};
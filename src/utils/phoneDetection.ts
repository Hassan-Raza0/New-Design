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

// Simulate AI model detection (in production, this would call your ML model)
export const detectPhoneModel = async (imageFile: File): Promise<DetectionResult> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Simulate different detection scenarios
      const random = Math.random();
      
      if (random < 0.1) {
        // 10% chance of invalid/non-phone detection
        resolve({
          model: 'Invalid',
          confidence: 0.3,
          isValid: false,
          category: 'invalid'
        });
      } else if (random < 0.8) {
        // 70% chance of successful iPhone detection
        const iPhoneModels = phoneModels.filter(model => model.includes('iPhone'));
        const randomModel = iPhoneModels[Math.floor(Math.random() * iPhoneModels.length)];
        resolve({
          model: randomModel,
          confidence: 0.85 + Math.random() * 0.14, // 85-99% confidence
          isValid: true,
          category: 'iphone'
        });
      } else {
        // 20% chance of Samsung detection
        const samsungModels = phoneModels.filter(model => model.includes('Samsung'));
        const randomModel = samsungModels[Math.floor(Math.random() * samsungModels.length)];
        resolve({
          model: randomModel,
          confidence: 0.85 + Math.random() * 0.14,
          isValid: true,
          category: 'samsung'
        });
      }
    }, 2000 + Math.random() * 1000); // 2-3 seconds processing time
  });
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
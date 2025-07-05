import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, ArrowRight, Smartphone, Shield, Zap, Clock, Star, AlertCircle, CreditCard, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { modelPricing, getBadgeColor, phoneModels, planTypes, calculatePlanPrice } from '../utils/phoneDetection';

interface QuoteForm {
  deviceType: string;
  deviceModel: string;
  planType: string;
  accessoriesCoverage: boolean;
}

interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const QuotePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quote, setQuote] = useState<any>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuoteForm>();
  const { register: registerPayment, handleSubmit: handlePaymentSubmit, watch: watchPayment, setValue: setPaymentValue, formState: { errors: paymentErrors } } = useForm<PaymentForm>();
  
  const selectedDeviceType = watch('deviceType');
  const selectedModel = watch('deviceModel');
  const selectedPlan = watch('planType');
  const accessoriesCoverage = watch('accessoriesCoverage');

  const cardNumber = watchPayment('cardNumber');
  const expiryDate = watchPayment('expiryDate');

  // Optional Add-ons
  const addOns = [
    {
      id: 'accessories',
      name: 'Accessories Coverage',
      price: 1.99,
      description: 'Covers chargers, cases, screen protectors, and other accessories',
      popular: true
    },
    {
      id: 'extended',
      name: 'Extended Warranty',
      price: 2.99,
      description: 'Additional 12 months warranty coverage beyond manufacturer',
      popular: false
    },
    {
      id: 'data',
      name: 'Data Recovery',
      price: 3.99,
      description: 'Professional data recovery service for damaged devices',
      popular: false
    }
  ];

  const calculateQuote = (data: QuoteForm) => {
    const modelData = modelPricing[data.deviceModel as keyof typeof modelPricing];
    const planData = planTypes.find(p => p.id === data.planType);
    if (!modelData || !planData) return;

    const planPrice = calculatePlanPrice(data.deviceModel, data.planType);
    const accessoriesPrice = data.accessoriesCoverage ? 1.99 : 0;
    const totalPrice = planPrice + accessoriesPrice;

    const mockQuote = {
      deviceType: data.deviceType,
      deviceModel: data.deviceModel,
      planType: data.planType,
      planName: planData.name,
      monthlyPrice: planPrice,
      accessoriesCoverage: data.accessoriesCoverage,
      accessoriesPrice: accessoriesPrice,
      totalPrice: totalPrice,
      yearlyPrice: totalPrice * 12,
      deductible: modelData.deductible,
      badge: modelData.badge,
      trialDays: 30,
      features: planData.features
    };

    setQuote(mockQuote);
    setCurrentStep(2);
  };

const handlePayment = async (data: PaymentForm) => {
  setPaymentProcessing(true);

  try {
    const res = await fetch('http://localhost:3000/api/payment/create-payment', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(quote.totalPrice * 100),
 // Stripe takes amount in cents
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
        name: data.cardholderName
      })
    });

    const result = await res.json();

    if (result.success) {
      setCurrentStep(3);
    } else {
      alert('Payment failed: ' + result.message);
    }
  } catch (error) {
    console.error(error);
    alert('Something went wrong');
  }

  setPaymentProcessing(false);
};

  // Payment validation utilities
  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  };

  const validateExpiryDate = (expiry: string): boolean => {
    const [month, year] = expiry.split('/');
    if (!month || !year) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;
    
    return true;
  };

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(' ') : '';
  };

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-6 w-6" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-24 h-1 mx-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Select Device & Plan</span>
              <span>Payment Details</span>
              <span>Confirmation</span>
            </div>
          </div>

          {/* Step 1: Device & Plan Selection */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-12"
            >
              <div className="text-center mb-8">
                <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-10 w-10 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Get Your Instant Quote
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Select your device and protection plan to get an instant quote. 
                  No photos needed - just choose your model and plan.
                </p>
              </div>

              <form onSubmit={handleSubmit(calculateQuote)} className="space-y-8">
                {/* Device Type Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Device Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input
                        {...register('deviceType', { required: 'Please select device type' })}
                        type="radio"
                        value="phone"
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-xl p-6 text-center transition-all ${
                        selectedDeviceType === 'phone' 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <Smartphone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <span className="font-semibold">Phone</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        {...register('deviceType')}
                        type="radio"
                        value="tablet"
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-xl p-6 text-center transition-all ${
                        selectedDeviceType === 'tablet' 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <span className="font-semibold">Tablet</span>
                      </div>
                    </label>
                  </div>
                  {errors.deviceType && (
                    <p className="text-red-600 text-sm mt-2">{errors.deviceType.message}</p>
                  )}
                </div>

                {/* Device Model Selection */}
                {selectedDeviceType && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Device Model *
                    </label>
                    <select
                      {...register('deviceModel', { required: 'Please select your device model' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    >
                      <option value="">Choose your device model</option>
                      <optgroup label="iPhone Models">
                        {phoneModels.filter(model => model.includes('iPhone')).map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Samsung Models">
                        {phoneModels.filter(model => model.includes('Samsung')).map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {errors.deviceModel && (
                      <p className="text-red-600 text-sm mt-2">{errors.deviceModel.message}</p>
                    )}
                  </div>
                )}

                {/* Plan Type Selection */}
                {selectedModel && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Protection Plan *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {planTypes.map((plan) => (
                        <label key={plan.id} className="cursor-pointer">
                          <input
                            {...register('planType', { required: 'Please select a plan' })}
                            type="radio"
                            value={plan.id}
                            className="sr-only"
                          />
                          <div className={`border-2 rounded-xl p-6 transition-all relative ${
                            selectedPlan === plan.id 
                              ? 'border-blue-500 bg-blue-50 shadow-lg' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            {plan.popular && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                  Most Popular
                                </span>
                              </div>
                            )}
                            <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                            <div className="text-2xl font-bold text-blue-600 mb-2">
                              {plan.id === 'basic' 
                                ? `$${modelPricing[selectedModel]?.price || 0}`
                                : `$${plan.basePrice}`}
                              <span className="text-sm text-gray-600">/month</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {plan.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.planType && (
                      <p className="text-red-600 text-sm mt-2">{errors.planType.message}</p>
                    )}
                  </div>
                )}

                {/* Optional Add-ons */}
                {selectedPlan && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Optional Add-ons
                    </label>
                    <div className="space-y-4">
                      {addOns.map((addon) => (
                        <div key={addon.id} className={`border-2 rounded-xl p-4 transition-all ${
                          addon.popular ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
                        }`}>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              {...register('accessoriesCoverage')}
                              type="checkbox"
                              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-900">{addon.name}</span>
                                <span className="text-purple-600 font-bold">+${addon.price}/month</span>
                              </div>
                              <p className="text-gray-600 text-sm mt-1">{addon.description}</p>
                              {addon.popular && (
                                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold mt-2">
                                  Popular Add-on
                                </span>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deductible Info Box */}
                {selectedModel && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                      <div>
                        <h4 className="font-semibold text-yellow-900">Deductible Information</h4>
                        <p className="text-yellow-800">
                          Deductible: ${modelPricing[selectedModel]?.deductible} (Based on device model and condition)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                {selectedModel && selectedPlan && (
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center"
                  >
                    Get My Quote
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </button>
                )}
              </form>
            </motion.div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 2 && quote && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Quote Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6 text-center">Your Quote Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Device:</span>
                      <span className="font-semibold">{quote.deviceModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Plan:</span>
                      <span className="font-semibold">{quote.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Base Price:</span>
                      <span className="font-semibold">${quote.monthlyPrice}/month</span>
                    </div>
                    {quote.accessoriesCoverage && (
                      <div className="flex justify-between">
                        <span className="text-blue-200">Accessories:</span>
                        <span className="font-semibold">+${quote.accessoriesPrice}/month</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Total Monthly:</span>
                      <span className="font-bold text-xl">${quote.totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Deductible:</span>
                      <span className="font-semibold">${quote.deductible}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Trial Period:</span>
                      <span className="font-semibold">{quote.trialDays} days FREE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Information</h2>
                  <p className="text-gray-600">Secure payment processing with 256-bit SSL encryption</p>
                </div>

                <form onSubmit={handlePaymentSubmit(handlePayment)} className="space-y-6">
                  {/* Card Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        {...registerPayment('cardNumber', { 
                          required: 'Card number is required',
                          validate: (value) => validateCardNumber(value) || 'Invalid card number'
                        })}
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(cardNumber || '')}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setPaymentValue('cardNumber', formatted);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {paymentErrors.cardNumber && (
                        <p className="text-red-600 text-sm mt-1">{paymentErrors.cardNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        {...registerPayment('expiryDate', { 
                          required: 'Expiry date is required',
                          validate: (value) => validateExpiryDate(value) || 'Invalid expiry date'
                        })}
                        type="text"
                        placeholder="MM/YY"
                        value={formatExpiryDate(expiryDate || '')}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          setPaymentValue('expiryDate', formatted);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {paymentErrors.expiryDate && (
                        <p className="text-red-600 text-sm mt-1">{paymentErrors.expiryDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        {...registerPayment('cvv', { 
                          required: 'CVV is required',
                          validate: (value) => validateCVV(value) || 'Invalid CVV'
                        })}
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {paymentErrors.cvv && (
                        <p className="text-red-600 text-sm mt-1">{paymentErrors.cvv.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        {...registerPayment('cardholderName', { required: 'Cardholder name is required' })}
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {paymentErrors.cardholderName && (
                        <p className="text-red-600 text-sm mt-1">{paymentErrors.cardholderName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          {...registerPayment('billingAddress', { required: 'Billing address is required' })}
                          type="text"
                          placeholder="123 Main Street"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {paymentErrors.billingAddress && (
                          <p className="text-red-600 text-sm mt-1">{paymentErrors.billingAddress.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          {...registerPayment('city', { required: 'City is required' })}
                          type="text"
                          placeholder="New York"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {paymentErrors.city && (
                          <p className="text-red-600 text-sm mt-1">{paymentErrors.city.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <select
                          {...registerPayment('state', { required: 'State is required' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select State</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                          <option value="IL">Illinois</option>
                        </select>
                        {paymentErrors.state && (
                          <p className="text-red-600 text-sm mt-1">{paymentErrors.state.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          {...registerPayment('zipCode', { required: 'ZIP code is required' })}
                          type="text"
                          placeholder="10001"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {paymentErrors.zipCode && (
                          <p className="text-red-600 text-sm mt-1">{paymentErrors.zipCode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Lock className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-900">Secure Payment</h4>
                        <p className="text-green-800 text-sm">Your payment information is encrypted and secure</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Back to Quote
                    </button>
                    <button
                      type="submit"
                      disabled={paymentProcessing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {paymentProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Secure Payment
                          <Lock className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && quote && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-8">
                Your quote has been saved and payment processed. You can now proceed to complete your registration.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Quote Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Device:</span>
                    <span className="font-semibold">{quote.deviceModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-semibold">{quote.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Total:</span>
                    <span className="font-bold text-lg">${quote.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => window.location.href = '/register'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Complete Registration
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Get Another Quote
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuotePage;
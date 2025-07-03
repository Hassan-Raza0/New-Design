import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, ArrowRight, Smartphone, Shield, Zap, Clock, Star, AlertCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { modelPricing, getBadgeColor, phoneModels, planTypes, calculatePlanPrice, addOns } from '../utils/phoneDetection';

interface QuoteForm {
  deviceType: string;
  deviceModel: string;
  customDeviceName?: string;
  planType: string;
  selectedAddOns: string[];
}

const QuotePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quote, setQuote] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuoteForm>();
  
  const selectedDeviceType = watch('deviceType');
  const selectedModel = watch('deviceModel');
  const selectedPlan = watch('planType');

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateQuote = (data: QuoteForm) => {
    const deviceModel = data.deviceModel === 'other' ? 'Other Device' : data.deviceModel;
    const modelData = modelPricing[deviceModel as keyof typeof modelPricing];
    const planData = planTypes.find(p => p.id === data.planType);
    if (!modelData || !planData) return;

    const planPrice = calculatePlanPrice(deviceModel, data.planType);
    const addOnsCost = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);

    const mockQuote = {
      deviceType: data.deviceType,
      deviceModel: data.deviceModel === 'other' ? data.customDeviceName || 'Other Device' : deviceModel,
      planType: data.planType,
      planName: planData.name,
      monthlyPrice: planPrice,
      addOnsCost: addOnsCost,
      totalPrice: planPrice + addOnsCost,
      yearlyPrice: (planPrice + addOnsCost) * 12,
      deductible: modelData.deductible,
      badge: modelData.badge,
      trialDays: 30,
      features: planData.features,
      selectedAddOns: selectedAddOns.map(id => addOns.find(a => a.id === id)).filter(Boolean)
    };

    setQuote(mockQuote);
    setCurrentStep(2);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-6 w-6" /> : step}
                  </div>
                  {step < 2 && (
                    <div className={`w-24 h-1 mx-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Select Device & Plan</span>
              <span>Your Quote</span>
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
                      <optgroup label="Other">
                        <option value="other">Other (Please specify)</option>
                      </optgroup>
                    </select>
                    {errors.deviceModel && (
                      <p className="text-red-600 text-sm mt-2">{errors.deviceModel.message}</p>
                    )}
                  </div>
                )}

                {/* Custom Device Name Input */}
                {selectedModel === 'other' && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                      Device Name *
                    </label>
                    <input
                      {...register('customDeviceName', { 
                        required: selectedModel === 'other' ? 'Please enter your device name' : false 
                      })}
                      type="text"
                      placeholder="Enter your device name (e.g., Google Pixel 8, OnePlus 12)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                    {errors.customDeviceName && (
                      <p className="text-red-600 text-sm mt-2">{errors.customDeviceName.message}</p>
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
                                ? `$${modelPricing[selectedModel === 'other' ? 'Other Device' : selectedModel]?.price || 0}`
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addOns.map((addon) => (
                        <div
                          key={addon.id}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all relative ${
                            selectedAddOns.includes(addon.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleAddOnToggle(addon.id)}
                        >
                          {addon.popular && (
                            <div className="absolute -top-2 -right-2">
                              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                Popular
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{addon.name}</h4>
                            <div className="flex items-center">
                              <span className="text-blue-600 font-bold">+${addon.price}</span>
                              <div className={`ml-2 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                selectedAddOns.includes(addon.id)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-gray-300'
                              }`}>
                                {selectedAddOns.includes(addon.id) && (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{addon.description}</p>
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
                          Deductible: ${modelPricing[selectedModel === 'other' ? 'Other Device' : selectedModel]?.deductible} (Based on device model and condition)
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

          {/* Step 2: Quote Results */}
          {currentStep === 2 && quote && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Quote Card */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 lg:p-12 text-white">
                <div className="text-center mb-8">
                  <div className="bg-white bg-opacity-20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4">Your Instant Quote</h2>
                  <p className="text-blue-100 text-xl">
                    🎉 1-Month Free Trial • No Photos Required for Quote
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <span className={`px-4 py-2 rounded-full text-lg font-bold ${getBadgeColor(quote.badge)} text-gray-900`}>
                        ${quote.totalPrice}/month
                      </span>
                      <span className="text-blue-200">after trial</span>
                    </div>
                    
                    <div className="space-y-4">
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
                        <span className="font-semibold">${quote.monthlyPrice}</span>
                      </div>
                      {quote.addOnsCost > 0 && (
                        <div className="flex justify-between">
                          <span className="text-blue-200">Add-ons:</span>
                          <span className="font-semibold">+${quote.addOnsCost}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-blue-300 pt-2">
                        <span className="text-blue-200">Total Monthly:</span>
                        <span className="font-semibold text-lg">${quote.totalPrice}</span>
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

                    {/* Selected Add-ons */}
                    {quote.selectedAddOns.length > 0 && (
                      <div className="mt-6 bg-white bg-opacity-20 rounded-xl p-4">
                        <h4 className="font-semibold mb-2">Selected Add-ons:</h4>
                        {quote.selectedAddOns.map((addon: any, index: number) => (
                          <div key={index} className="flex justify-between text-blue-100 text-sm">
                            <span>{addon.name}</span>
                            <span>+${addon.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Trial Info */}
                    <div className="mt-6 bg-white bg-opacity-20 rounded-xl p-4">
                      <h4 className="font-semibold mb-2">🎉 1-Month Free Trial</h4>
                      <p className="text-blue-100 text-sm mb-2">
                        $1 charged today to verify your card (non-refundable)
                      </p>
                      <p className="text-blue-100 text-sm">
                        Plan starts after 30 days based on your device
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-4 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
                      Start Free Trial
                    </button>
                    <button className="w-full border-2 border-white hover:bg-white hover:text-blue-600 py-4 px-8 rounded-xl font-bold text-lg transition-all">
                      Save Quote
                    </button>
                    
                    <div className="text-center text-sm mt-6">
                      <p className="text-blue-200 mb-2">You have 30 days left in your trial</p>
                      <p className="text-blue-200">You can cancel anytime before trial ends to avoid full charge</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  What's Included in Your {quote.planName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {quote.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  {[
                    { icon: Zap, title: 'Fast Claims', desc: 'Instant processing' },
                    { icon: Clock, title: 'Same-Day Repair', desc: 'Most repairs in 4hrs' },
                    { icon: Shield, title: 'Full Coverage', desc: 'Comprehensive protection' },
                    { icon: Star, title: '24/7 Support', desc: 'Always here to help' }
                  ].map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-blue-100 p-3 rounded-xl w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Back Button */}
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors"
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
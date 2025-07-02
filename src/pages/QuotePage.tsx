import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, ArrowRight, Smartphone, Shield, Zap, Clock, Star, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import PhoneDetection from '../components/PhoneDetection';
import { modelPricing, getBadgeColor } from '../utils/phoneDetection';

interface QuoteForm {
  deviceType: string;
  deviceModel: string;
  purchaseDate: string;
}

const QuotePage: React.FC = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [quote, setQuote] = useState<any>(null);
  const [detectedModel, setDetectedModel] = useState<string>('');
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuoteForm>();
  
  const selectedDeviceType = watch('deviceType');
  const selectedModel = watch('deviceModel');

  const handleModelDetected = (model: string, confidence: number) => {
    setDetectedModel(model);
    setDetectionConfidence(confidence);
    setValue('deviceModel', model);
  };

  const handleImagesUploaded = (front: File | null, back: File | null) => {
    setFrontImage(front);
    setBackImage(back);
    
    // Auto-advance to next step when both images are uploaded
    if (front && back && currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 1000);
    }
  };

  const handleModelChange = (model: string) => {
    setValue('deviceModel', model);
    setDetectedModel(model);
  };

  const calculateQuote = (data: QuoteForm) => {
    const modelData = modelPricing[data.deviceModel as keyof typeof modelPricing];
    if (!modelData) return;

    const mockQuote = {
      deviceType: data.deviceType,
      deviceModel: data.deviceModel,
      monthlyPrice: modelData.price,
      yearlyPrice: modelData.price * 12,
      deductible: modelData.deductible,
      badge: modelData.badge,
      trialDays: 30,
      detectionConfidence: detectionConfidence,
      wasDetected: detectionConfidence > 0
    };

    setQuote(mockQuote);
    setCurrentStep(3);
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
              <span>Upload & Detect</span>
              <span>Device Details</span>
              <span>Your Quote</span>
            </div>
          </div>

          {/* Step 1: AI Phone Detection */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-12"
            >
              <div className="text-center mb-8">
                <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  AI-Powered Device Detection
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Upload clear photos of your device and our AI will automatically detect your model and provide an instant quote.
                </p>
              </div>

              {/* Device Type Selection */}
              <div className="mb-8">
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

              {/* Phone Detection Component */}
              {selectedDeviceType && (
                <PhoneDetection
                  onModelDetected={handleModelDetected}
                  onImagesUploaded={handleImagesUploaded}
                  selectedModel={selectedModel}
                  onModelChange={handleModelChange}
                />
              )}

              {/* Continue Button */}
              {(frontImage && backImage) || selectedModel ? (
                <div className="mt-8">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center"
                  >
                    Continue to Details
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </button>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* Step 2: Device Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-12"
            >
              <div className="text-center mb-8">
                <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Device Details Confirmed
                </h2>
                {detectedModel && detectionConfidence > 0 && (
                  <div className="bg-green-50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-center space-x-4">
                      <Zap className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          AI Detected: {detectedModel}
                        </h3>
                        <p className="text-gray-600">
                          Confidence: {Math.round(detectionConfidence * 100)}% • You can confirm or edit below
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit(calculateQuote)} className="space-y-8">
                {/* Model Selection with AI Detection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Device Model *
                  </label>
                  <PhoneDetection
                    onModelDetected={handleModelDetected}
                    onImagesUploaded={handleImagesUploaded}
                    selectedModel={selectedModel}
                    onModelChange={handleModelChange}
                  />
                  <input
                    {...register('deviceModel', { required: 'Please select your device model' })}
                    type="hidden"
                    value={selectedModel || ''}
                  />
                  {errors.deviceModel && (
                    <p className="text-red-600 text-sm mt-2">{errors.deviceModel.message}</p>
                  )}
                </div>

                {/* Show pricing when model is selected */}
                {selectedModel && modelPricing[selectedModel as keyof typeof modelPricing] && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Plan Preview</h3>
                        <div className="flex items-center space-x-3">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getBadgeColor(modelPricing[selectedModel as keyof typeof modelPricing].badge)}`}>
                            ${modelPricing[selectedModel as keyof typeof modelPricing].price}/month
                          </span>
                          <span className="text-gray-600">
                            Deductible: ${modelPricing[selectedModel as keyof typeof modelPricing].deductible}
                          </span>
                        </div>
                      </div>
                      <Shield className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                )}

                {/* Deductible Info Box */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">Deductible Information</h4>
                      <p className="text-yellow-800">Deductible: $29 – $99 (Based on device condition and model)</p>
                    </div>
                  </div>
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    When did you purchase this device? *
                  </label>
                  <input
                    {...register('purchaseDate', { required: 'Purchase date is required' })}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  {errors.purchaseDate && (
                    <p className="text-red-600 text-sm mt-2">{errors.purchaseDate.message}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-4 px-8 rounded-xl font-bold text-lg transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center"
                  >
                    Get My Quote
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Quote Results */}
          {currentStep === 3 && quote && (
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
                  <h2 className="text-4xl font-bold mb-4">Your AI-Generated Quote</h2>
                  <p className="text-blue-100 text-xl">
                    {quote.wasDetected ? '🤖 AI-Detected Model' : '📱 Manually Selected'} • 1-Month Free Trial
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <span className={`px-4 py-2 rounded-full text-lg font-bold ${getBadgeColor(quote.badge)} text-gray-900`}>
                        ${quote.monthlyPrice}/month
                      </span>
                      <span className="text-blue-200">after trial</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-blue-200">Device:</span>
                        <span className="font-semibold">{quote.deviceModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Monthly Plan:</span>
                        <span className="font-semibold">${quote.monthlyPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Deductible:</span>
                        <span className="font-semibold">${quote.deductible}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Trial Period:</span>
                        <span className="font-semibold">{quote.trialDays} days FREE</span>
                      </div>
                      {quote.wasDetected && (
                        <div className="flex justify-between">
                          <span className="text-blue-200">AI Confidence:</span>
                          <span className="font-semibold">{Math.round(quote.detectionConfidence * 100)}%</span>
                        </div>
                      )}
                    </div>

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
                  What's Included in Your Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Zap, title: 'AI Claims', desc: 'Instant processing' },
                    { icon: Clock, title: 'Same-Day Repair', desc: 'Most repairs in 4hrs' },
                    { icon: Shield, title: 'Full Coverage', desc: 'Theft & damage' },
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
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuotePage;
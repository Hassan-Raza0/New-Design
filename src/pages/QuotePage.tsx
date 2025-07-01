import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Upload, X, CheckCircle, ArrowRight, Smartphone, Shield, Zap, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

interface QuoteForm {
  devicePhotos: FileList;
  phoneCondition: string;
  purchaseDate: string;
  plan: string;
}

const QuotePage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [quote, setQuote] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuoteForm>();
  
  const selectedPlan = watch('plan');

  const plans = [
    {
      id: 'essential',
      name: 'Essential',
      price: 8.99,
      originalPrice: 12.99,
      features: ['Screen repair', 'Basic protection', '24/7 support'],
      popular: false,
      savings: 31
    },
    {
      id: 'complete',
      name: 'Complete',
      price: 16.99,
      originalPrice: 24.99,
      features: ['Everything in Essential', 'Theft coverage', 'Water damage', 'Unlimited claims'],
      popular: true,
      savings: 32
    },
    {
      id: 'family',
      name: 'Family',
      price: 29.99,
      originalPrice: 44.99,
      features: ['Up to 5 devices', 'All Complete features', 'Family dashboard'],
      popular: false,
      savings: 33
    }
  ];

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files).slice(0, 4 - uploadedImages.length);
    setUploadedImages(prev => [...prev, ...newImages]);
    
    if (newImages.length > 0) {
      setIsAnalyzing(true);
      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep(2);
      }, 2000);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const calculateQuote = (data: QuoteForm) => {
    const selectedPlanData = plans.find(p => p.id === data.plan);
    if (!selectedPlanData) return;

    const mockQuote = {
      plan: selectedPlanData,
      monthlyPrice: selectedPlanData.price,
      yearlyPrice: selectedPlanData.price * 12,
      savings: selectedPlanData.originalPrice * 12 - selectedPlanData.price * 12,
      deviceValue: 899, // Mock detected value
      coverage: 'Full replacement value',
      deductible: data.plan === 'essential' ? 25 : data.plan === 'complete' ? 50 : 0
    };

    setQuote(mockQuote);
    setCurrentStep(3);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
              <span>Upload Photos</span>
              <span>Device Details</span>
              <span>Your Quote</span>
            </div>
          </div>

          {/* Step 1: Photo Upload */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-12"
            >
              <div className="text-center mb-8">
                <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Camera className="h-10 w-10 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Take Photos of Your Device
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Our AI will analyze your device condition and provide an instant quote. 
                  Take clear photos from different angles.
                </p>
              </div>

              {/* Upload Area */}
              <div className="mb-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                
                <div 
                  onClick={triggerFileInput}
                  className="border-3 border-dashed border-blue-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Upload className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Click to upload or drag photos here
                  </h3>
                  <p className="text-gray-600">
                    Upload up to 4 photos • PNG, JPG up to 10MB each
                  </p>
                </div>
              </div>

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Device ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Analysis */}
              {isAnalyzing && (
                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Analyzing Your Device...
                  </h3>
                  <p className="text-gray-600">
                    Our advanced AI is examining your photos to determine device condition and value.
                  </p>
                </div>
              )}

              {/* Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-900 mb-2">📱 Front & Back</h4>
                  <p className="text-green-700 text-sm">Take clear photos of both front and back of your device</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h4 className="font-semibold text-yellow-900 mb-2">💡 Good Lighting</h4>
                  <p className="text-yellow-700 text-sm">Use natural light for best AI analysis results</p>
                </div>
              </div>
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
                  <Zap className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  AI Analysis Complete!
                </h2>
                <div className="bg-green-50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-center space-x-4">
                    <Smartphone className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">iPhone 15 Pro Detected</h3>
                      <p className="text-gray-600">Condition: Excellent • Value: $899</p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(calculateQuote)} className="space-y-8">
                {/* Purchase Date */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    When did you purchase this device?
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

                {/* Plan Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-6">
                    Choose Your Protection Plan
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <label key={plan.id} className="cursor-pointer">
                        <input
                          {...register('plan', { required: 'Please select a plan' })}
                          type="radio"
                          value={plan.id}
                          className="sr-only"
                        />
                        <div className={`border-2 rounded-2xl p-6 transition-all ${
                          selectedPlan === plan.id 
                            ? 'border-blue-500 bg-blue-50 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          {plan.popular && (
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                              Most Popular
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                          <div className="mb-4">
                            <span className="text-gray-400 line-through text-lg">${plan.originalPrice}</span>
                            <div className="text-3xl font-bold text-gray-900">${plan.price}</div>
                            <div className="text-green-600 font-semibold">Save {plan.savings}%</div>
                          </div>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.plan && (
                    <p className="text-red-600 text-sm mt-2">{errors.plan.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  Get My Quote
                  <ArrowRight className="ml-2 h-6 w-6" />
                </button>
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
                  <h2 className="text-4xl font-bold mb-4">Your Personalized Quote</h2>
                  <p className="text-blue-100 text-xl">Protection starts immediately after signup</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="text-6xl font-bold mb-2">
                      ${quote.monthlyPrice}
                      <span className="text-2xl text-blue-200">/month</span>
                    </div>
                    <div className="text-blue-200 mb-6">
                      ${quote.yearlyPrice}/year • Save ${quote.savings.toFixed(0)} annually
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-blue-200">Plan:</span>
                        <span className="font-semibold">{quote.plan.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Device Value:</span>
                        <span className="font-semibold">${quote.deviceValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Coverage:</span>
                        <span className="font-semibold">{quote.coverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Deductible:</span>
                        <span className="font-semibold">${quote.deductible}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-4 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
                      Get Protected Now
                    </button>
                    <button className="w-full border-2 border-white hover:bg-white hover:text-blue-600 py-4 px-8 rounded-xl font-bold text-lg transition-all">
                      Save Quote
                    </button>
                    
                    <div className="flex items-center justify-center space-x-6 text-sm mt-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span>No commitment</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span>Cancel anytime</span>
                      </div>
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
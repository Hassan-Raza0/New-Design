import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import PhoneDetection from '../components/PhoneDetection';
import { modelPricing, getBadgeColor } from '../utils/phoneDetection';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  deviceType: string;
  deviceModel: string;
  purchaseDate: string;
  terms: boolean;
}

const RegisterPage: React.FC = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [detectedModel, setDetectedModel] = useState<string>('');
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);
  const [trialDaysLeft, setTrialDaysLeft] = useState(30);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<RegisterForm>();
  
  const selectedDeviceType = watch('deviceType');
  const selectedModel = watch('deviceModel');
  const password = watch('password');

  const handleModelDetected = (model: string, confidence: number) => {
    setDetectedModel(model);
    setDetectionConfidence(confidence);
    setValue('deviceModel', model);
  };

  const handleImagesUploaded = (front: File | null, back: File | null) => {
    setFrontImage(front);
    setBackImage(back);
  };

  const handleModelChange = (model: string) => {
    setValue('deviceModel', model);
    setDetectedModel(model);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const userData = {
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode
      };

      const success = await registerUser(data.email, data.password, userData);
      
      if (success) {
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
    }
  };

  if (showSuccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
          >
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to CoverCell!</h2>
            <p className="text-gray-600 mb-6">
              Your registration is complete! Your free trial has started and you have 30 days 
              to experience our protection service.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Go to Sign In
            </button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-6 w-6" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>AI Upload</span>
              <span>Personal</span>
              <span>Summary</span>
              <span>Confirm</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Get Protected Today</h1>
              <p className="text-gray-600 mt-2">Start your 1-month free trial with AI-powered device detection</p>
              
              {/* Trial Info Banner */}
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-semibold">
                    You have {trialDaysLeft} days left in your trial
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: AI Image Upload & Detection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">AI Device Detection</h2>
                  
                  {/* Device Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        <div className={`border-2 rounded-lg p-4 text-center transition-all ${
                          selectedDeviceType === 'phone' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <Shield className="h-6 w-6 mx-auto mb-2 text-blue-600" />
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
                        <div className={`border-2 rounded-lg p-4 text-center transition-all ${
                          selectedDeviceType === 'tablet' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <Shield className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <span className="font-semibold">Tablet</span>
                        </div>
                      </label>
                    </div>
                    {errors.deviceType && (
                      <p className="text-red-600 text-sm mt-1">{errors.deviceType.message}</p>
                    )}
                  </div>

                  {/* AI Phone Detection */}
                  {selectedDeviceType && (
                    <PhoneDetection
                      onModelDetected={handleModelDetected}
                      onImagesUploaded={handleImagesUploaded}
                      selectedModel={selectedModel}
                      onModelChange={handleModelChange}
                    />
                  )}

                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedModel}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        {...register('firstName', { required: 'First name is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        {...register('lastName', { required: 'Last name is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                        })}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        {...register('phone', { required: 'Phone number is required' })}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          {...register('password', { 
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                          })}
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          {...register('confirmPassword', { 
                            required: 'Please confirm your password',
                            validate: value => value === password || 'Passwords do not match'
                          })}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        {...register('address', { required: 'Address is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.address && (
                        <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        {...register('city', { required: 'City is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <select
                        {...register('state', { required: 'State is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="IL">Illinois</option>
                      </select>
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        {...register('zipCode', { required: 'ZIP code is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.zipCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Device & Plan Summary */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Device & Plan Summary</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Date *
                    </label>
                    <input
                      {...register('purchaseDate', { required: 'Purchase date is required' })}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.purchaseDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.purchaseDate.message}</p>
                    )}
                  </div>

                  {/* Plan Summary Card */}
                  {selectedModel && modelPricing[selectedModel as keyof typeof modelPricing] && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Plan Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Device:</span>
                          <span className="font-semibold">{selectedModel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan:</span>
                          <span className="font-semibold">${modelPricing[selectedModel as keyof typeof modelPricing].price}/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trial:</span>
                          <span className="font-semibold text-green-600">1 month free</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deductible:</span>
                          <span className="font-semibold">${modelPricing[selectedModel as keyof typeof modelPricing].deductible}</span>
                        </div>
                        {detectionConfidence > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">AI Detection:</span>
                            <span className="font-semibold text-blue-600">{Math.round(detectionConfidence * 100)}% confidence</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Trial Information */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900">1-Month Free Trial</h4>
                        <p className="text-green-800 text-sm">$1 charged today to verify your card (non-refundable)</p>
                        <p className="text-green-800 text-sm">Plan starts after 30 days based on your device</p>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-900">Cancellation Policy</h4>
                        <p className="text-yellow-800 text-sm">You can cancel anytime before trial ends to avoid full charge.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Final Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Confirm Registration</h2>
                  
                  {/* Terms and Conditions */}
                  <div>
                    <label className="flex items-start space-x-3">
                      <input
                        {...register('terms', { required: 'You must accept the terms and conditions' })}
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{' '}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-red-600 text-sm mt-1">{errors.terms.message}</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Creating Account...' : 'Start Free Trial'}
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
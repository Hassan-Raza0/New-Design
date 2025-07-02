import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle, AlertCircle, Smartphone, Zap, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectPhoneModel, validateImageFile, modelPricing, phoneModels, getBadgeColor, formatConfidence, DetectionResult } from '../utils/phoneDetection';
import toast from 'react-hot-toast';

interface PhoneDetectionProps {
  onModelDetected: (model: string, confidence: number) => void;
  onImagesUploaded: (frontImage: File | null, backImage: File | null) => void;
  selectedModel?: string;
  onModelChange: (model: string) => void;
}

const PhoneDetection: React.FC<PhoneDetectionProps> = ({
  onModelDetected,
  onImagesUploaded,
  selectedModel,
  onModelChange
}) => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [showManualSelect, setShowManualSelect] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<'uploading' | 'processing' | 'complete'>('uploading');
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File, type: 'front' | 'back') => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    if (type === 'front') {
      setFrontImage(file);
    } else {
      setBackImage(file);
    }

    // Notify parent component
    const newFrontImage = type === 'front' ? file : frontImage;
    const newBackImage = type === 'back' ? file : backImage;
    onImagesUploaded(newFrontImage, newBackImage);

    // Start AI analysis when both images are uploaded
    if ((type === 'front' && backImage) || (type === 'back' && frontImage)) {
      await startAIAnalysis(newFrontImage || newBackImage);
    }
  };

  const startAIAnalysis = async (imageFile: File) => {
    setIsAnalyzing(true);
    setAnalysisStep('processing');
    setDetectionResult(null);

    try {
      const result = await detectPhoneModel(imageFile);
      setDetectionResult(result);
      setAnalysisStep('complete');

      if (result.isValid && result.confidence >= 0.9) {
        // High confidence detection
        onModelDetected(result.model, result.confidence);
        onModelChange(result.model);
        toast.success(`Detected: ${result.model} (${formatConfidence(result.confidence)} confidence)`);
      } else if (result.isValid && result.confidence >= 0.7) {
        // Medium confidence - show for confirmation
        onModelDetected(result.model, result.confidence);
        onModelChange(result.model);
        toast.success(`Detected: ${result.model} - Please confirm or change if needed`);
      } else {
        // Low confidence or invalid
        setShowManualSelect(true);
        toast.error("We couldn't detect a valid phone. Please upload a clear image or choose manually.");
      }
    } catch (error) {
      console.error('Detection failed:', error);
      setShowManualSelect(true);
      toast.error('Detection failed. Please select your model manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontImage(null);
    } else {
      setBackImage(null);
    }
    
    // Reset detection if no images
    if ((type === 'front' && !backImage) || (type === 'back' && !frontImage)) {
      setDetectionResult(null);
      setShowManualSelect(false);
      setAnalysisStep('uploading');
    }

    onImagesUploaded(
      type === 'front' ? null : frontImage,
      type === 'back' ? null : backImage
    );
  };

  const retryDetection = async () => {
    if (frontImage || backImage) {
      await startAIAnalysis(frontImage || backImage!);
    }
  };

  const confirmDetection = () => {
    if (detectionResult) {
      onModelDetected(detectionResult.model, detectionResult.confidence);
      toast.success('Model confirmed!');
    }
  };

  const triggerFileInput = (type: 'front' | 'back') => {
    if (type === 'front') {
      frontInputRef.current?.click();
    } else {
      backInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Front Image */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Front Image (IMEI must be visible) *
          </label>
          <input
            ref={frontInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'front')}
            className="hidden"
          />
          
          {frontImage ? (
            <div className="relative group">
              <img
                src={URL.createObjectURL(frontImage)}
                alt="Front view"
                className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
              />
              <button
                onClick={() => removeImage('front')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Front
              </div>
            </div>
          ) : (
            <div 
              onClick={() => triggerFileInput('front')}
              className="border-3 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Camera className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:text-blue-600 transition-colors" />
              <p className="text-gray-600 font-medium">Click to upload front image</p>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>

        {/* Back Image */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Back Image (Serial number must be visible) *
          </label>
          <input
            ref={backInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'back')}
            className="hidden"
          />
          
          {backImage ? (
            <div className="relative group">
              <img
                src={URL.createObjectURL(backImage)}
                alt="Back view"
                className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
              />
              <button
                onClick={() => removeImage('back')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Back
              </div>
            </div>
          ) : (
            <div 
              onClick={() => triggerFileInput('back')}
              className="border-3 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:text-blue-600 transition-colors" />
              <p className="text-gray-600 font-medium">Click to upload back image</p>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Status */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {analysisStep === 'processing' ? 'AI Analyzing Your Device...' : 'Processing Images...'}
                </h3>
                <p className="text-blue-700">
                  {analysisStep === 'processing' 
                    ? 'Our advanced AI is examining your photos to determine device model and condition.'
                    : 'Preparing images for analysis...'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detection Results */}
      <AnimatePresence>
        {detectionResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {detectionResult.isValid ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-8 w-8 text-green-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">
                        Model Detected: {detectionResult.model}
                      </h3>
                      <p className="text-green-700 mb-3">
                        Confidence: {formatConfidence(detectionResult.confidence)}
                      </p>
                      {modelPricing[detectionResult.model] && (
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getBadgeColor(modelPricing[detectionResult.model].badge)}`}>
                            ${modelPricing[detectionResult.model].price}/month
                          </span>
                          <span className="text-green-700 text-sm">
                            Deductible: ${modelPricing[detectionResult.model].deductible}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={confirmDetection}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowManualSelect(true)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Change Model
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="h-8 w-8 text-red-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 mb-2">
                        Couldn't detect phone
                      </h3>
                      <p className="text-red-700 mb-3">
                        We couldn't detect a valid phone. Please upload a clear image or choose manually.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={retryDetection}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Retry</span>
                    </button>
                    <button
                      onClick={() => setShowManualSelect(true)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Select Manually
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Model Selection */}
      <AnimatePresence>
        {(showManualSelect || (!detectionResult && (frontImage || backImage))) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Smartphone className="h-6 w-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Select Your Device Model</h3>
            </div>
            <select
              value={selectedModel || ''}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Choose your device model</option>
              <optgroup label="iPhone Models">
                {phoneModels.filter(model => model.includes('iPhone')).map((model) => (
                  <option key={model} value={model}>
                    {model} - ${modelPricing[model].price}/month
                  </option>
                ))}
              </optgroup>
              <optgroup label="Samsung Models">
                {phoneModels.filter(model => model.includes('Samsung')).map((model) => (
                  <option key={model} value={model}>
                    {model} - ${modelPricing[model].price}/month
                  </option>
                ))}
              </optgroup>
            </select>
            
            {selectedModel && modelPricing[selectedModel] && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedModel}</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getBadgeColor(modelPricing[selectedModel].badge)}`}>
                        ${modelPricing[selectedModel].price}/month
                      </span>
                      <span className="text-gray-600 text-sm">
                        Deductible: ${modelPricing[selectedModel].deductible}
                      </span>
                    </div>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            📱 Clear Photos
          </h4>
          <p className="text-green-700 text-sm">Take clear photos of both front and back of your device for best AI analysis results</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            💡 Good Lighting
          </h4>
          <p className="text-yellow-700 text-sm">Use natural light and ensure IMEI/serial numbers are visible for accurate detection</p>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetection;
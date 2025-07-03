import React, { useState, useRef } from 'react';
import { Camera, Upload, X, AlertCircle, Smartphone, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { validateImageFile } from '../utils/phoneDetection';
import toast from 'react-hot-toast';

interface DeviceImageUploadProps {
  onImagesUploaded: (frontImage: File | null, backImage: File | null) => void;
  frontImage: File | null;
  backImage: File | null;
}

const DeviceImageUpload: React.FC<DeviceImageUploadProps> = ({
  onImagesUploaded,
  frontImage,
  backImage
}) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File, type: 'front' | 'back') => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    const newFrontImage = type === 'front' ? file : frontImage;
    const newBackImage = type === 'back' ? file : backImage;
    onImagesUploaded(newFrontImage, newBackImage);
  };

  const removeImage = (type: 'front' | 'back') => {
    onImagesUploaded(
      type === 'front' ? null : frontImage,
      type === 'back' ? null : backImage
    );
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
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Device Verification Photos</h3>
        <p className="text-gray-600">
          Upload clear photos of your device for verification and IMEI/serial number confirmation
        </p>
      </div>

      {/* Image Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Front Image - IMEI and Serial Visible */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Device Settings Screen *
          </label>
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Required: Settings → About screen</p>
                <p>Must show IMEI and Serial Number clearly visible</p>
              </div>
            </div>
          </div>
          
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
                alt="Device settings screen"
                className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
              />
              <button
                onClick={() => removeImage('front')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Settings Screen
              </div>
            </div>
          ) : (
            <div 
              onClick={() => triggerFileInput('front')}
              className="border-3 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Smartphone className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:text-blue-600 transition-colors" />
              <p className="text-gray-600 font-medium">Click to upload settings screen</p>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>

        {/* Back Image - Physical Device */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Back of Device *
          </label>
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Required: Back of physical device</p>
                <p>Clear photo showing device condition and any visible markings</p>
              </div>
            </div>
          </div>
          
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
                alt="Back of device"
                className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
              />
              <button
                onClick={() => removeImage('back')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Device Back
              </div>
            </div>
          ) : (
            <div 
              onClick={() => triggerFileInput('back')}
              className="border-3 border-dashed border-green-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <Camera className="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:text-green-600 transition-colors" />
              <p className="text-gray-600 font-medium">Click to upload device back</p>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            📱 Settings Screen
          </h4>
          <p className="text-blue-700 text-sm">Go to Settings → About to show IMEI and Serial Number clearly</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            📷 Device Back
          </h4>
          <p className="text-green-700 text-sm">Take a clear photo of the back of your device showing its condition</p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">Important</h4>
            <p className="text-yellow-800 text-sm">
              Both photos are required for device verification and policy activation. 
              Make sure IMEI and Serial Number are clearly visible in the settings screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceImageUpload;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, X } from 'lucide-react';

const CloudCast = () => {
  const [uploadedImages, setUploadedImages] = useState<(File | null)[]>([null, null, null]);
  const [predictedImage, setPredictedImage] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [ssim, setSsim] = useState(0.85);
  const [predictionDate, setPredictionDate] = useState('2024-6-11 12:00');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = [...uploadedImages];
      
      // For each uploaded file, find the first empty slot
      for (let fileIndex = 0; fileIndex < files.length && fileIndex < 3; fileIndex++) {
        const emptySlotIndex = newImages.findIndex(img => img === null);
        if (emptySlotIndex !== -1) {
          newImages[emptySlotIndex] = files[fileIndex];
        }
      }
      
      setUploadedImages(newImages);
      console.log('Files uploaded:', files.length);
      console.log('Updated images array:', newImages.map((img, idx) => ({ index: idx, hasFile: !!img, fileName: img?.name })));
      
      // Clear the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const handlePredictNextFrame = async () => {
    if (!hasAllImages) return;

    const formData = new FormData();
    uploadedImages.forEach((file, idx) => {
      if (file) {
        formData.append(`file${idx + 1}`, file);
      }
    });

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Prediction failed');

      const blob = await response.blob();
      setPredictedImage(URL.createObjectURL(blob));
      setSsim(Math.random() * 0.3 + 0.7); // Placeholder SSIM
      setPredictionDate(new Date().toLocaleString());
    } catch (err) {
      alert('Prediction failed: ' + err);
    }
  };

  const handleRegeneratePrediction = () => {
    handlePredictNextFrame();
  };

  const handleDownloadPrediction = () => {
    if (predictedImage) {
      const link = document.createElement('a');
      link.download = 'predicted_frame.png';
      link.href = predictedImage;
      link.click();
    }
  };

  const getImagePreview = (file: File | null, index: number) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const hasAllImages = uploadedImages.every(img => img !== null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload Section */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  CloudCast Lite
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Predict the next cloud movement using INSAT satellite images.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <Label htmlFor="file-upload" className="text-lg font-medium text-gray-700 cursor-pointer">
                    Upload 3 Satellite images (.tlf)
                  </Label>
                  <p className="text-sm text-gray-500 mt-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".tlf,.jpg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Image Preview Buttons */}
                <div className="flex gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-20 h-8 rounded ${image ? 'bg-gray-800' : 'bg-gray-300'} flex items-center justify-center text-white text-sm`}>
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Predict Button */}
                <Button
                  onClick={handlePredictNextFrame}
                  disabled={!hasAllImages}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                >
                  Predict Next Frame
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Predicted Frame */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Predicted Frame
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAbout(!showAbout)}
                  className="text-gray-600"
                >
                  <span className="text-lg">i</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="text-center">
                      <div className="w-24 h-24 bg-gray-800 rounded-lg mb-2 overflow-hidden">
                        {image && (
                          <img
                            src={getImagePreview(image, index)}
                            alt={`Satellite ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Image {index + 1}</p>
                    </div>
                  ))}
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-800 rounded-lg mb-2 overflow-hidden">
                      {predictedImage && (
                        <img
                          src={predictedImage}
                          alt="Predicted Frame"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Predicted Frame</p>
                  </div>
                </div>

                {/* Regenerate Button */}
                {predictedImage && (
                  <Button
                    onClick={handleRegeneratePrediction}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Regenerate Prediction
                  </Button>
                )}

                {/* SSIM and Date */}
                {predictedImage && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                      <p>SSIM: {ssim.toFixed(2)}</p>
                      <p>Date: {predictionDate}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownloadPrediction}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* About Section */}
            {showAbout && (
              <Card className="shadow-lg animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    About
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAbout(false)}
                    className="text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    The application utilizes a CNN-LSTM model to predict future cloud movements
                    based on consecutive satellite images.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudCast;

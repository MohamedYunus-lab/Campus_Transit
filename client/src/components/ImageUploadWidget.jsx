import { useState } from 'react';

const ImageUploadWidget = ({ onImageUpload, currentImage, label = 'Upload Landmark Photo', helpText = 'Upload a landmark photo to help students identify this boarding point.' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Read file as Base64 first
    const base64Data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsDataURL(file);
    });
    setPreview(base64Data);

    // Upload to Cloudinary
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD || 'demo'; 
      const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || ''; 
      
      if (UPLOAD_PRESET) {
        formData.append('upload_preset', UPLOAD_PRESET);
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        onImageUpload(data.secure_url);
      } else {
        // Fallback: use data URL
        onImageUpload(base64Data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Using local preview.');
      // Fallback to data URL
      onImageUpload(base64Data);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-4 border-2 border-dashed border-primary-200 hover:border-primary transition-colors">
      <h4 className="text-label-bold mb-3 text-on-surface">{label}</h4>

      {/* Preview */}
      {preview && (
        <div className="mb-4 relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-sm h-40 object-cover rounded-lg shadow-card"
          />
          <button
            onClick={() => {
              setPreview('');
              onImageUpload('');
            }}
            className="absolute top-2 right-2 bg-error text-white p-2 rounded-full hover:bg-error-dark transition-colors"
            title="Remove image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Upload Input */}
      <div className="space-y-2">
        <label className="block">
          <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-primary-300 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-body-sm font-medium text-on-surface">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="text-body-sm text-on-surface-variant">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
          </div>
        </label>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-error-light rounded-lg border border-error">
            <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-body-sm text-error">{error}</p>
          </div>
        )}

        {/* Info */}
        {helpText && (
          <p className="text-body-sm text-on-surface-variant">
            {helpText}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUploadWidget;

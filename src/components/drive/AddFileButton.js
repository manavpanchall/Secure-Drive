import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { uploadFileToCloudinary } from "../../cloudinary";
import { database } from "../../firebase";
import { Upload, X, AlertCircle, CheckCircle, File, Loader2 } from "lucide-react";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!currentFolder || !file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds the limit of 10MB.");
      return;
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
      "application/pdf",
      "text/plain", "text/csv",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip", "application/x-rar-compressed", "application/x-7z-compressed"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload images, PDFs, documents, or archives.");
      return;
    }

    const id = uuidV4();
    setUploadingFiles(prev => [
      ...prev,
      { id, name: file.name, progress: 0, error: false, fileType: file.type },
    ]);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadingFiles(prev =>
        prev.map(uploadFile =>
          uploadFile.id === id
            ? { ...uploadFile, progress: Math.min(uploadFile.progress + 5, 90) }
            : uploadFile
        )
      );
    }, 300);

    try {
      setIsUploading(true);
      
      // Upload to Cloudinary
      const fileUrl = await uploadFileToCloudinary(file);
      clearInterval(progressInterval);
      
      // Update to 100%
      setUploadingFiles(prev =>
        prev.map(uploadFile =>
          uploadFile.id === id
            ? { ...uploadFile, progress: 100, error: false }
            : uploadFile
        )
      );

      // Save to Firestore
      await database.files.add({
        url: fileUrl,
        name: file.name,
        type: file.type,
        size: file.size,
        createdAt: database.getCurrentTimestamp(),
        folderId: currentFolder.id,
        userId: currentUser.uid,
      });

      // Remove after success
      setTimeout(() => {
        setUploadingFiles(prev =>
          prev.filter(uploadFile => uploadFile.id !== id)
        );
      }, 2000);

    } catch (error) {
      console.error("Error uploading file:", error);
      clearInterval(progressInterval);
      setUploadingFiles(prev =>
        prev.map(uploadFile =>
          uploadFile.id === id
            ? { ...uploadFile, error: true }
            : uploadFile
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) {
      return <span className="text-purple-500">🖼️</span>;
    } else if (fileType.includes('pdf')) {
      return <span className="text-red-500">📄</span>;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <span className="text-blue-500">📝</span>;
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <span className="text-green-500">📊</span>;
    } else if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) {
      return <span className="text-gray-500">📦</span>;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <label className="btn-primary flex items-center space-x-2 cursor-pointer relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300"></div>
        <div className="relative z-10 flex items-center space-x-2">
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Upload File</span>
        </div>
        <input
          type="file"
          onChange={handleUpload}
          className="hidden"
          disabled={isUploading}
        />
      </label>

      {/* Upload Progress Overlay */}
      {uploadingFiles.length > 0 && (
        <div className="fixed bottom-6 right-6 space-y-3 z-50 max-w-sm">
          {uploadingFiles.map(file => (
            <div
              key={file.id}
              className="bg-white rounded-2xl shadow-hard border border-gray-100 p-4 animate-slide-up"
              style={{ width: '320px' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getFileIcon(file.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.error ? 'Failed' : file.progress === 100 ? 'Completed' : 'Uploading...'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUploadingFiles(prev =>
                      prev.filter(uploadFile => uploadFile.id !== file.id)
                    );
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      file.error
                        ? "bg-red-500"
                        : file.progress === 100
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-primary-400 to-primary-600"
                    }`}
                    style={{ width: `${file.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-gradient"></div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {file.error ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : file.progress === 100 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span className="text-xs font-medium">
                      {file.error ? 'Failed' : `${Math.round(file.progress)}%`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {file.fileSize ? formatFileSize(file.fileSize) : '...'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
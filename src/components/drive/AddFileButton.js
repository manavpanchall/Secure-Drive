import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();

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
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "text/plain", "text/csv",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip", "application/x-rar-compressed"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload images, PDFs, documents, or archives.");
      return;
    }

    const id = uuidV4();
    setUploadingFiles(prev => [
      ...prev,
      { id, name: file.name, progress: 0, error: false },
    ]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadingFiles(prev =>
        prev.map(uploadFile =>
          uploadFile.id === id
            ? { ...uploadFile, progress: Math.min(uploadFile.progress + 10, 90) }
            : uploadFile
        )
      );
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would call your actual upload function
      // const fileUrl = await uploadFileToCloudinary(file);
      
      // Simulated success
      setUploadingFiles(prev =>
        prev.map(uploadFile =>
          uploadFile.id === id
            ? { ...uploadFile, progress: 100, error: false }
            : uploadFile
        )
      );

      // Remove after success
      setTimeout(() => {
        setUploadingFiles(prev =>
          prev.filter(uploadFile => uploadFile.id !== id)
        );
      }, 2000);

    } catch (error) {
      console.error("Error uploading file:", error);
      clearInterval(interval);
      setUploadingFiles(prev =>
        prev.map(uploadFile =>
          uploadFile.id === id
            ? { ...uploadFile, error: true }
            : uploadFile
        )
      );
    }
  };

  return (
    <>
      <label className="btn-primary flex items-center space-x-2 cursor-pointer">
        <Upload className="h-5 w-5" />
        <span className="hidden sm:inline">Upload File</span>
        <input
          type="file"
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-3 z-50 max-w-sm">
          {uploadingFiles.map(file => (
            <div
              key={file.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-slide-up"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {file.error ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : file.progress === 100 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setUploadingFiles(prev =>
                      prev.filter(uploadFile => uploadFile.id !== file.id)
                    );
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    file.error
                      ? "bg-red-500"
                      : file.progress === 100
                      ? "bg-green-500"
                      : "bg-primary-600"
                  }`}
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {file.error ? "Failed" : file.progress === 100 ? "Completed" : "Uploading..."}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(file.progress)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
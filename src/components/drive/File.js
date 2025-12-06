import React, { useState } from "react";
import { Download, MoreVertical, Eye, Share2, Calendar, AlertCircle } from "lucide-react";

export default function File({ file, selected, onSelect, viewMode = "grid" }) {
  const [showActions, setShowActions] = useState(false);

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!file.url) {
      alert("File URL not available");
      return;
    }
    
    try {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name || "download";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconClass = "h-5 w-5";
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return <div className={`${iconClass} text-purple-500`}>🖼️</div>;
    } else if (['pdf'].includes(extension)) {
      return <div className={`${iconClass} text-red-500`}>📄</div>;
    } else if (['doc', 'docx'].includes(extension)) {
      return <div className={`${iconClass} text-blue-500`}>📝</div>;
    } else if (['xls', 'xlsx'].includes(extension)) {
      return <div className={`${iconClass} text-green-500`}>📊</div>;
    } else if (['zip', 'rar', '7z', 'tar'].includes(extension)) {
      return <div className={`${iconClass} text-gray-500`}>📦</div>;
    } else if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
      return <div className={`${iconClass} text-red-400`}>🎬</div>;
    } else if (['mp3', 'wav', 'flac'].includes(extension)) {
      return <div className={`${iconClass} text-yellow-500`}>🎵</div>;
    } else {
      return <div className={`${iconClass} text-gray-500`}>📄</div>;
    }
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
          />
          <div className="flex-shrink-0">
            {getFileTypeIcon(file.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate flex-1"
                title={file.name}
              >
                {file.name}
              </a>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(file.createdAt)}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="absolute top-3 left-3 h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200 h-full">
        <div className="flex flex-col h-full">
          {/* File Icon */}
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              {getFileTypeIcon(file.name)}
            </div>
          </div>

          {/* File Name */}
          <h3 
            className="text-sm font-medium text-gray-900 truncate text-center mb-2"
            title={file.name}
          >
            {file.name}
          </h3>

          {/* File Info */}
          <div className="text-xs text-gray-500 text-center mb-3 flex items-center justify-center space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(file.createdAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-2 mt-auto pt-3 border-t border-gray-100">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Download, MoreVertical, Eye, Share2, Trash2, Calendar } from "lucide-react";

export default function File({ file, selected, onSelect, getFileIcon, viewMode = "grid" }) {
  const [showActions, setShowActions] = useState(false);

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatFileSize = (url) => {
    // This is a placeholder. In real app, you'd get size from metadata
    return "1.2 MB";
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 group">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <div className="p-2 bg-gray-100 rounded-lg">
            {getFileIcon(file.name)}
          </div>
          <div className="flex-1 min-w-0">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block"
            >
              {file.name}
            </a>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span>{formatFileSize(file.url)}</span>
              <span>•</span>
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
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="absolute top-3 left-3 h-4 w-4 text-primary-600 rounded focus:ring-primary-500 z-10 opacity-0 group-hover:opacity-100"
      />
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200">
        <div className="flex flex-col h-full">
          {/* File Icon */}
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              {getFileIcon(file.name)}
            </div>
          </div>

          {/* File Name */}
          <h3 className="text-sm font-medium text-gray-900 truncate text-center mb-2">
            {file.name}
          </h3>

          {/* File Info */}
          <div className="text-xs text-gray-500 text-center mb-3">
            <div className="flex items-center justify-center space-x-2">
              <span>{formatFileSize(file.url)}</span>
              <span>•</span>
              <span>{formatDate(file.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-2 mt-auto">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </a>
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
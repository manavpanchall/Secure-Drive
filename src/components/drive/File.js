import React, { useState } from "react";
import { 
  Download, 
  MoreVertical, 
  Eye, 
  Share2, 
  Calendar, 
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  ExternalLink,
  Info,
  Star
} from "lucide-react";

export default function File({ file, selected, onSelect, getFileIcon, viewMode = "grid" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (file.url) {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name || `download-${Date.now()}`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("File URL is missing");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return "Unknown";
    }
  };

  const formatFileSize = (size) => {
    if (!size) return "Unknown";
    const sizes = ['B', 'KB', 'MB', 'GB'];
    let sizeNum = size;
    
    // If size is not a number, generate a random size for demo
    if (typeof size !== 'number') {
      sizeNum = Math.floor(Math.random() * 1024 * 1024 * 10); // Random up to 10MB
    }
    
    const i = Math.floor(Math.log(sizeNum) / Math.log(1024));
    return `${(sizeNum / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileTypeIcon = (fileName, fileType) => {
    if (fileType) {
      if (fileType.includes('image')) return <ImageIcon className="h-5 w-5 text-purple-500" />;
      if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
      if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-5 w-5 text-blue-500" />;
      if (fileType.includes('sheet') || fileType.includes('excel')) return <FileText className="h-5 w-5 text-green-500" />;
      if (fileType.includes('video')) return <Video className="h-5 w-5 text-red-500" />;
      if (fileType.includes('audio')) return <Music className="h-5 w-5 text-yellow-500" />;
      if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return <Archive className="h-5 w-5 text-gray-500" />;
    }
    
    // Fallback to file extension
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return <ImageIcon className="h-5 w-5 text-purple-500" />;
    } else if (['pdf'].includes(extension)) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return <FileText className="h-5 w-5 text-green-500" />;
    } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
      return <Video className="h-5 w-5 text-red-500" />;
    } else if (['mp3', 'wav', 'flac', 'm4a'].includes(extension)) {
      return <Music className="h-5 w-5 text-yellow-500" />;
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return <Archive className="h-5 w-5 text-gray-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  if (viewMode === "list") {
    return (
      <div 
        className={`flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border transition-all duration-200 group ${
          selected 
            ? 'border-primary-300 bg-primary-50/50 shadow-sm' 
            : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="relative">
            <input
              type="checkbox"
              checked={selected}
              onChange={onSelect}
              className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300 cursor-pointer"
            />
          </div>
          
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl blur-sm opacity-30 group-hover:opacity-50"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-sm">
                {getFileTypeIcon(file.name, file.type)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-900 hover:text-primary-600 truncate block"
              >
                {file.name}
              </a>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>{formatFileSize(file.size)}</span>
                </div>
                <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pl-4">
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
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="absolute top-4 left-4 h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300 cursor-pointer z-10 opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity"
      />
      
      {/* Favorite button */}
      <button className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
      </button>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-soft p-5 transition-all duration-300 hover:shadow-hard hover:border-primary-200 hover:scale-[1.02] group-hover:bg-white">
        <div className="flex flex-col h-full">
          {/* File Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm">
                {getFileTypeIcon(file.name, file.type)}
              </div>
            </div>
          </div>

          {/* File Name */}
          <h3 className="text-sm font-semibold text-gray-900 truncate text-center mb-3 group-hover:text-primary-600 transition-colors">
            {file.name}
          </h3>

          {/* File Info */}
          <div className="text-xs text-gray-500 text-center mb-4">
            <div className="flex items-center justify-center space-x-3">
              <span className="font-medium">{formatFileSize(file.size)}</span>
              <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(file.createdAt)}</span>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-2 mt-auto">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 hover:scale-110"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-110"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </a>
            <button 
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-110"
              title="More options"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {/* Quick View Link */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1 text-xs text-primary-600 font-medium hover:text-primary-700"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Quick view</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
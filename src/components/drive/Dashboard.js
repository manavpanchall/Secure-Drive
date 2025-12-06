import React, { useState, useEffect } from "react"; // ✅ Added useEffect
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useFolder } from "../../hooks/useFolder";
import Navbar from "./Navbar";
import Folder from "./Folder";
import File from "./File";
import AddFolderButton from "./AddFolderButton";
import AddFileButton from "./AddFileButton";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import { database } from "../../firebase";
import { deleteFileFromCloudinary } from "../../cloudinary";
import { Link } from "react-router-dom";
import {
  FolderPlus,
  Upload,
  Download,
  Trash2,
  Grid,
  List,
  Filter,
  ChevronDown,
  HardDrive,
  Folder as FolderIcon,
  File as FileIcon,
  Zap,
  Sparkles,
  Plus
} from "lucide-react";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder);
  const { currentUser } = useAuth();
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  
  // Add sorting functionality
  const [sortedFiles, setSortedFiles] = useState([]);
  const [sortedFolders, setSortedFolders] = useState([]);

  // File type icons mapping
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      return <span className="text-purple-500">🖼️</span>;
    } else if (['pdf'].includes(extension)) {
      return <span className="text-red-500">📄</span>;
    } else if (['doc', 'docx'].includes(extension)) {
      return <span className="text-blue-500">📝</span>;
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return <span className="text-green-500">📊</span>;
    } else if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
      return <span className="text-red-500">🎬</span>;
    } else if (['mp3', 'wav', 'flac'].includes(extension)) {
      return <span className="text-yellow-500">🎵</span>;
    } else if (['zip', 'rar', '7z', 'tar'].includes(extension)) {
      return <span className="text-gray-500">📦</span>;
    } else {
      return <span className="text-gray-500">📄</span>;
    }
  };

  // ✅ Apply sorting whenever files/folders or sort criteria change
  useEffect(() => {
    const sortItems = (items) => {
      if (!items.length) return items;
      
      return [...items].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return sortOrder === 'asc' 
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
            
          case 'date':
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return sortOrder === 'asc' 
              ? dateA - dateB
              : dateB - dateA;
            
          case 'size':
            const sizeA = a.size || 0;
            const sizeB = b.size || 0;
            return sortOrder === 'asc' 
              ? sizeA - sizeB
              : sizeB - sizeA;
            
          case 'type':
            const typeA = a.name.split('.').pop() || '';
            const typeB = b.name.split('.').pop() || '';
            return sortOrder === 'asc' 
              ? typeA.localeCompare(typeB)
              : typeB.localeCompare(typeA);
            
          default:
            return 0;
        }
      });
    };

    setSortedFiles(sortItems(childFiles.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )));
    
    setSortedFolders(sortItems(childFolders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    )));
  }, [childFiles, childFolders, searchQuery, sortBy, sortOrder]);

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleFolderSelect = (folderId) => {
    setSelectedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleDelete = async () => {
    if (selectedFiles.length === 0 && selectedFolders.length === 0) {
      setError("Please select items to delete");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedFiles.length + selectedFolders.length} item(s)?`
    );
    
    if (!confirmDelete) return;

    try {
      setError("");

      // Delete selected files
      for (const fileId of selectedFiles) {
        const file = childFiles.find((f) => f.id === fileId);
        if (file && file.url) {
          try {
            await deleteFileFromCloudinary(file.url);
          } catch (cloudinaryError) {
            console.warn("Could not delete from Cloudinary:", cloudinaryError);
          }

          await database.files.doc(fileId).delete();
        }
      }

      // Delete selected folders
      for (const folderId of selectedFolders) {
        const folderFiles = await database.files
          .where("folderId", "==", folderId)
          .where("userId", "==", currentUser.uid)
          .get();

        for (const doc of folderFiles.docs) {
          const file = doc.data();
          if (file.url) {
            try {
              await deleteFileFromCloudinary(file.url);
            } catch (error) {
              console.warn("Could not delete file from Cloudinary:", error);
            }
          }
          await doc.ref.delete();
        }

        await database.folders.doc(folderId).delete();
      }

      setSelectedFiles([]);
      setSelectedFolders([]);
      
      setError("✅ Items deleted successfully!");
      setTimeout(() => setError(""), 3000);

    } catch (err) {
      console.error("Delete error:", err);
      setError("❌ Failed to delete items. Please try again.");
    }
  };

  const handleDownloadSelected = () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to download");
      return;
    }

    selectedFiles.forEach((fileId) => {
      const file = childFiles.find((f) => f.id === fileId);
      if (file && file.url) {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name || `download-${Date.now()}`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    
    setError("✅ Download started!");
    setTimeout(() => setError(""), 3000);
  };

  const handleDownloadAll = () => {
    if (childFiles.length === 0) {
      setError("No files to download");
      return;
    }

    childFiles.forEach((file) => {
      if (file.url) {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name || `download-${Date.now()}`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    
    setError("✅ Downloading all files!");
    setTimeout(() => setError(""), 3000);
  };

  const sortOptions = [
    { value: "name", label: "Name", icon: "A-Z" },
    { value: "date", label: "Date", icon: "📅" },
    { value: "size", label: "Size", icon: "📏" },
    { value: "type", label: "Type", icon: "📄" },
  ];

  const handleSort = (option) => {
    setSortBy(option);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setShowSortMenu(false);
  };

  const storageStats = {
    used: 2.5,
    total: 15,
    percentage: (2.5 / 15) * 100,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar onSearch={(query) => setSearchQuery(query)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Header - Simplified */}
        <div className="mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
              Welcome back, <span className="gradient-text">{currentUser?.displayName?.split(' ')[0] || 'User'}</span>!
            </h1>
            <p className="text-gray-600 mt-1">Manage your files and folders</p>
          </div>
        </div>

        {/* Storage Stats & Quick Stats Combined - Made Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Storage Stats Card */}
          <div className="lg:col-span-2 bg-gradient-to-r from-white to-blue-50/50 rounded-2xl shadow-soft border border-white/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                  <HardDrive className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Storage Overview</h3>
                  <p className="text-sm text-gray-600">{storageStats.used} GB of {storageStats.total} GB used</p>
                </div>
              </div>
              <Link 
                to="/upgrade" 
                className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="h-4 w-4">⚡</span>
                <span>Upgrade</span>
              </Link>
            </div>
            
            <div className="relative mb-2">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${storageStats.percentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-gradient"></div>
                </div>
              </div>
              <div 
                className="absolute top-0 h-3 w-0.5 bg-white shadow-lg"
                style={{ left: `${storageStats.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Free: {storageStats.total - storageStats.used} GB</span>
              <span className="font-medium text-primary-600">{Math.round(storageStats.percentage)}% used</span>
            </div>
            
            {/* Mobile Upgrade Button */}
            <div className="mt-4 lg:hidden">
              <Link 
                to="/upgrade" 
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span className="h-4 w-4">⚡</span>
                <span>Upgrade Storage</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats - Made Responsive */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 p-4 transition-all duration-300 hover:shadow-hard">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100/50 rounded-lg">
                  <FolderIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Folders</p>
                  <p className="text-xl font-bold text-gray-900">{childFolders.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 p-4 transition-all duration-300 hover:shadow-hard">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100/50 rounded-lg">
                  <FileIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Files</p>
                  <p className="text-xl font-bold text-gray-900">{childFiles.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 p-4 transition-all duration-300 hover:shadow-hard">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100/50 rounded-lg">
                  <Upload className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Storage</p>
                  <p className="text-xl font-bold text-gray-900">{storageStats.used} GB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Improved UI */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Actions Card - Improved Design */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">File Actions</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-primary-100 text-primary-600" : "text-gray-500 hover:text-gray-700"}`}
                    title="Grid View"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${viewMode === "list" ? "bg-primary-100 text-primary-600" : "text-gray-500 hover:text-gray-700"}`}
                    title="List View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <AddFileButton currentFolder={folder} />
                <AddFolderButton currentFolder={folder} />
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleDownloadAll}
                    disabled={childFiles.length === 0}
                    className="btn-secondary flex items-center justify-center space-x-2 py-2.5 text-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download All</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSelectedFiles(childFiles.map(f => f.id));
                      setSelectedFolders(childFolders.map(f => f.id));
                    }}
                    disabled={childFiles.length === 0 && childFolders.length === 0}
                    className="btn-secondary flex items-center justify-center space-x-2 py-2.5 text-sm"
                  >
                    <span>📋</span>
                    <span>Select All</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sort Card - Fixed Sorting */}
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-4">Sort Options</h4>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between transition-all duration-200 ${
                      sortBy === option.value 
                        ? "bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 border border-primary-200" 
                        : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                    {sortBy === option.value && (
                      <span className={`text-xs font-medium ${
                        sortOrder === "asc" ? "text-green-600" : "text-orange-600"
                      }`}>
                        {sortOrder === "asc" ? "A → Z" : "Z → A"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Current Sort Info */}
              {sortBy && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    Sorted by: <span className="font-medium text-gray-900">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                    <span className="mx-2">•</span>
                    Order: <span className="font-medium text-gray-900">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Selected Items Actions */}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) && (
              <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200">
                <h4 className="font-semibold text-primary-900 mb-3">Selected Items</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Files selected:</span>
                    <span className="font-semibold text-primary-600">{selectedFiles.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Folders selected:</span>
                    <span className="font-semibold text-primary-600">{selectedFolders.length}</span>
                  </div>
                  <div className="pt-3 border-t border-primary-200">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleDownloadSelected}
                        disabled={selectedFiles.length === 0}
                        className="btn-primary text-sm py-2"
                      >
                        Download
                      </button>
                      <button
                        onClick={handleDelete}
                        className="btn-danger text-sm py-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Files and Folders */}
          <div className="lg:col-span-3">
            {/* Toolbar - Simplified */}
            <div className="card mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <FolderBreadcrumbs currentFolder={folder} />
                  {searchQuery && (
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      Search: "{searchQuery}"
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">
                    {sortedFolders.length} folders • {sortedFiles.length} files
                  </div>
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className={`mb-6 p-4 rounded-xl ${
                error.includes("✅") ? "alert-success" : 
                error.includes("❌") ? "alert-danger" :
                "alert-info"
              }`}>
                <div className="flex items-center space-x-3">
                  {error.includes("✅") ? (
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">✓</span>
                    </div>
                  ) : error.includes("❌") ? (
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600">✗</span>
                    </div>
                  ) : (
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">!</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{error.replace(/[✅❌]/g, '')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="space-y-8">
              {/* Folders Section */}
              {sortedFolders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 font-display">Folders</h2>
                    <span className="text-sm text-gray-500">{sortedFolders.length} items</span>
                  </div>
                  <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}`}>
                    {sortedFolders.map(childFolder => (
                      <Folder
                        key={childFolder.id}
                        folder={childFolder}
                        selected={selectedFolders.includes(childFolder.id)}
                        onSelect={() => handleFolderSelect(childFolder.id)}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Files Section */}
              {sortedFiles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 font-display">Files</h2>
                    <span className="text-sm text-gray-500">{sortedFiles.length} items</span>
                  </div>
                  <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}`}>
                    {sortedFiles.map(childFile => (
                      <File
                        key={childFile.id}
                        file={childFile}
                        selected={selectedFiles.includes(childFile.id)}
                        onSelect={() => handleFileSelect(childFile.id)}
                        getFileIcon={getFileIcon}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {sortedFolders.length === 0 && sortedFiles.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                    <FolderPlus className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
                    {searchQuery ? "No results found" : "Your space is empty"}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchQuery 
                      ? `We couldn't find any files or folders matching "${searchQuery}"`
                      : "Upload your first file or create a folder to get started. Your files will be securely stored and accessible from anywhere."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <AddFileButton currentFolder={folder} />
                    <AddFolderButton currentFolder={folder} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <div className="flex flex-col items-end space-y-3">
          <div className="flex items-center space-x-3">
            {(selectedFiles.length > 0 || selectedFolders.length > 0) && (
              <div className="flex space-x-2 animate-slide-up">
                <button
                  onClick={handleDownloadSelected}
                  disabled={selectedFiles.length === 0}
                  className="btn-primary shadow-lg p-3 rounded-full"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={selectedFiles.length === 0 && selectedFolders.length === 0}
                  className="btn-danger shadow-lg p-3 rounded-full"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
            <button 
              onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
          
          {isFloatingMenuOpen && (
            <div className="space-y-2 animate-slide-up">
              <div className="bg-white rounded-xl shadow-hard p-2">
                <AddFileButton currentFolder={folder} />
                <AddFolderButton currentFolder={folder} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
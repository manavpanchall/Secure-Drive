import React, { useState } from "react";
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
import { Link } from "react-router-dom"; // Added missing import
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
} from "lucide-react";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder);
  const { currentUser } = useAuth(); // Added this line - FIXED 'currentUser is not defined'

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);

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

  // FIXED: Added handleFileSelect function
  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // FIXED: Added handleFolderSelect function
  const handleFolderSelect = (folderId) => {
    setSelectedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  // FIXED: Enhanced delete function
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
            // Try to delete from Cloudinary
            await deleteFileFromCloudinary(file.url);
          } catch (cloudinaryError) {
            console.warn("Could not delete from Cloudinary:", cloudinaryError);
            // Continue with Firestore deletion even if Cloudinary fails
          }

          // Delete from Firestore
          await database.files.doc(fileId).delete();
        }
      }

      // Delete selected folders (and their contents)
      for (const folderId of selectedFolders) {
        // First, delete all files in the folder
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

        // Delete the folder itself
        await database.folders.doc(folderId).delete();
      }

      // Clear selections
      setSelectedFiles([]);
      setSelectedFolders([]);

      // Show success message
      setError("✅ Items deleted successfully!");
      setTimeout(() => setError(""), 3000);

    } catch (err) {
      console.error("Delete error:", err);
      setError("❌ Failed to delete items. Please try again.");
    }
  };

  // FIXED: Enhanced download function
  const handleDownloadSelected = () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to download");
      return;
    }

    selectedFiles.forEach((fileId) => {
      const file = childFiles.find((f) => f.id === fileId);
      if (file && file.url) {
        // Create a hidden anchor element to trigger download
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

  // Sort functionality
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

  // Filter files and folders based on search
  const filteredFiles = childFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = childFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate storage stats
  const storageStats = {
    used: 2.5, // GB
    total: 15, // GB
    percentage: (2.5 / 15) * 100,
  };

  // Update the return section of Dashboard.js with this beautiful UI:

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar onSearch={(query) => setSearchQuery(query)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
                Welcome back, <span className="gradient-text">{currentUser?.displayName?.split(' ')[0] || 'User'}</span>!
              </h1>
              <p className="text-gray-600 mt-1">Your files are securely stored in the cloud</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-xl px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">All systems operational</span>
                </div>
              </div>
              <button className="btn-secondary flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Quick Actions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Storage Stats with Enhanced Design */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-white to-blue-50/50 rounded-2xl shadow-soft border border-white/50 p-6 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                      <HardDrive className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Storage Overview</h3>
                      <p className="text-sm text-gray-600">Your cloud storage usage</p>
                    </div>
                  </div>
                  <Link
                    to="/upgrade"
                    className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Upgrade Storage</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Used: {storageStats.used} GB</span>
                      <span className="text-gray-600">Total: {storageStats.total} GB</span>
                    </div>
                    <div className="relative">
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
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Free: {storageStats.total - storageStats.used} GB</span>
                      <span className="font-medium text-primary-600">{Math.round(storageStats.percentage)}% used</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats - Modern Design */}
              <div className="grid grid-cols-3 gap-4 lg:w-96">
                <div className="card-glass">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100/50 rounded-lg">
                      <FolderIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Folders</p>
                      <p className="text-2xl font-bold text-gray-900">{childFolders.length}</p>
                    </div>
                  </div>
                </div>

                <div className="card-glass">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100/50 rounded-lg">
                      <FileIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Files</p>
                      <p className="text-2xl font-bold text-gray-900">{childFiles.length}</p>
                    </div>
                  </div>
                </div>

                <div className="card-glass">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100/50 rounded-lg">
                      <Upload className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Storage</p>
                      <p className="text-2xl font-bold text-gray-900">{storageStats.used} GB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Upgrade Button */}
            <div className="mt-6 lg:hidden">
              <Link
                to="/upgrade"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>Upgrade Storage</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - File Actions */}
          <div className="lg:col-span-1">
            <div className="card space-y-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 text-lg">Quick Actions</h3>

              <div className="space-y-2">
                <AddFileButton currentFolder={folder} />
                <AddFolderButton currentFolder={folder} />

                <button
                  onClick={handleDownloadAll}
                  disabled={childFiles.length === 0}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
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
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <span>📋</span>
                  <span>Select All</span>
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">View Options</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 py-2.5 rounded-lg flex items-center justify-center space-x-2 ${viewMode === "grid"
                        ? "bg-primary-50 text-primary-600 border border-primary-200"
                        : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                      }`}
                  >
                    <Grid className="h-4 w-4" />
                    <span className="text-sm">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 py-2.5 rounded-lg flex items-center justify-center space-x-2 ${viewMode === "list"
                        ? "bg-primary-50 text-primary-600 border border-primary-200"
                        : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                      }`}
                  >
                    <List className="h-4 w-4" />
                    <span className="text-sm">List</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                <div className="space-y-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSort(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${sortBy === option.value
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                      {sortBy === option.value && (
                        <span className="text-xs">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Storage Tip */}
            <div className="card mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Pro Tip</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Organize files in folders to find them faster. Use descriptive names!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Files and Folders */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="card mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <FolderBreadcrumbs currentFolder={folder} />
                  {(selectedFiles.length > 0 || selectedFolders.length > 0) && (
                    <div className="flex items-center space-x-2">
                      <span className="badge-primary">
                        {selectedFiles.length + selectedFolders.length} selected
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleDownloadSelected}
                          disabled={selectedFiles.length === 0}
                          className="btn-primary text-sm px-3 py-1.5"
                        >
                          Download
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={selectedFiles.length === 0 && selectedFolders.length === 0}
                          className="btn-danger text-sm px-3 py-1.5"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="btn-secondary flex items-center space-x-2 text-sm"
                    >
                      <Filter className="h-4 w-4" />
                      <span>Sort: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className={`mb-6 p-4 rounded-xl ${error.includes("✅") ? "alert-success" :
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
              {filteredFolders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 font-display">Folders</h2>
                    <span className="text-sm text-gray-500">{filteredFolders.length} items</span>
                  </div>
                  <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}`}>
                    {filteredFolders.map(childFolder => (
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
              {filteredFiles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 font-display">Files</h2>
                    <span className="text-sm text-gray-500">{filteredFiles.length} items</span>
                  </div>
                  <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}`}>
                    {filteredFiles.map(childFile => (
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
              {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 animate-float">
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
                  className="btn-primary shadow-lg"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={selectedFiles.length === 0 && selectedFolders.length === 0}
                  className="btn-danger shadow-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
            <button
              onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>

          {isFloatingMenuOpen && (
            <div className="space-y-2 animate-slide-up">
              <AddFileButton currentFolder={folder} />
              <AddFolderButton currentFolder={folder} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
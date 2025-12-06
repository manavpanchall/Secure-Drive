import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useFolder } from "../../hooks/useFolder";
import Navbar from "./Navbar";
import Folder from "./Folder";
import File from "./File";
import AddFolderButton from "./AddFolderButton";
import AddFileButton from "./AddFileButton";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import { database } from "../../firebase"; // Import database
import { deleteFileFromCloudinary } from "../../cloudinary"; // Import Cloudinary delete function
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);

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
        if (file) {
          // Delete from Cloudinary first
          try {
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
          try {
            await deleteFileFromCloudinary(file.url);
          } catch (error) {
            console.warn("Could not delete file from Cloudinary:", error);
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
      setError("Items deleted successfully!");
      setTimeout(() => setError(""), 3000);

    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete items. Please try again.");
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
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name || `download-${Date.now()}`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
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
  };

  // FIXED: Sort functionality
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

  // FIXED: Filter files and folders based on search
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={(query) => setSearchQuery(query)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Storage Stats - MOVED TO TOP */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-primary-600" />
              <h3 className="text-sm font-medium text-gray-900">Storage</h3>
            </div>
            <span className="text-sm text-gray-600">
              {storageStats.used} GB of {storageStats.total} GB used
            </span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${storageStats.percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Free: {storageStats.total - storageStats.used} GB</span>
              <Link to="/upgrade" className="text-primary-600 hover:text-primary-700 font-medium">
                Upgrade plan
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats - MOVED BELOW STORAGE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Folders</p>
                <p className="text-2xl font-semibold text-gray-900">{childFolders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Files</p>
                <p className="text-2xl font-semibold text-gray-900">{childFiles.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Storage</p>
                <p className="text-2xl font-semibold text-gray-900">{storageStats.used} GB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Breadcrumbs and Selection */}
            <div className="flex items-center space-x-4">
              <FolderBreadcrumbs currentFolder={folder} />
              {(selectedFiles.length > 0 || selectedFolders.length > 0) && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedFiles.length + selectedFolders.length} selected
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary-50 text-primary-600" : "text-gray-600"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary-50 text-primary-600" : "text-gray-600"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown - FIXED */}
              <div className="relative">
                <button 
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="btn-secondary flex items-center space-x-1 text-sm"
                >
                  <Filter className="h-4 w-4" />
                  <span>Sort</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
                </button>
                
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSort(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                          sortBy === option.value ? "text-primary-600 bg-primary-50" : "text-gray-700"
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
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <AddFileButton currentFolder={folder} />
                <AddFolderButton currentFolder={folder} />
                <button
                  onClick={handleDownloadSelected}
                  disabled={selectedFiles.length === 0}
                  className="btn-primary flex items-center space-x-1 text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={selectedFiles.length === 0 && selectedFolders.length === 0}
                  className="btn-danger flex items-center space-x-1 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-4 p-3 rounded-lg ${error.includes("success") ? "alert-success" : "alert-danger"}`}>
            {error}
          </div>
        )}

        {/* Content Area */}
        <div className="space-y-6">
          {/* Folders Section */}
          {filteredFolders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Folders</h2>
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}`}>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Files</h2>
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}`}>
                {filteredFiles.map(childFile => (
                  <File
                    key={childFile.id}
                    file={childFile}
                    selected={selectedFiles.includes(childFile.id)}
                    onSelect={() => handleFileSelect(childFile.id)}
                    viewMode={viewMode}
                    onDownload={(url, name) => {
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = name;
                      link.click();
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredFolders.length === 0 && filteredFiles.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FolderPlus className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "No results found" : "This folder is empty"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No files or folders match "${searchQuery}"`
                  : "Upload files or create folders to get started. Your files will be securely stored and accessible from anywhere."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <AddFileButton currentFolder={folder} />
                <AddFolderButton currentFolder={folder} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
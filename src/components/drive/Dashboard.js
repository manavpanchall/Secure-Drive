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
import {
  FolderPlus,
  Upload,
  Download,
  Trash2,
  Grid,
  List,
  Filter,
  ChevronRight,
  HardDrive,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  AlertCircle,
  CheckCircle,
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();

  // Sort files and folders
  const sortedChildFolders = [...childFolders].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const sortedChildFiles = [...childFiles].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "size") {
      // For size sorting, we need file size data (you'll need to store file size in your database)
      return sortOrder === "asc"
        ? (a.size || 0) - (b.size || 0)
        : (b.size || 0) - (a.size || 0);
    }
    return 0;
  });

  // Filter files and folders based on search query
  const filteredFolders = sortedChildFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = sortedChildFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length && 
        selectedFolders.length === filteredFolders.length) {
      setSelectedFiles([]);
      setSelectedFolders([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
      setSelectedFolders(filteredFolders.map(f => f.id));
    }
  };

  const handleDelete = async () => {
    if (selectedFiles.length === 0 && selectedFolders.length === 0) {
      setError("Please select items to delete");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedFiles.length + selectedFolders.length} item(s)?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      // Delete selected files
      for (const fileId of selectedFiles) {
        const file = childFiles.find(f => f.id === fileId);
        if (file) {
          // Delete from Cloudinary (if using Cloudinary)
          if (file.url && file.url.includes("cloudinary")) {
            try {
              await deleteFileFromCloudinary(file.url);
            } catch (cloudinaryError) {
              console.error("Error deleting from Cloudinary:", cloudinaryError);
            }
          }
          
          // Delete from Firestore
          await database.files.doc(fileId).delete();
        }
      }

      // Delete selected folders
      for (const folderId of selectedFolders) {
        // Note: You should also delete all files inside the folder
        // This would require recursive deletion
        await database.folders.doc(folderId).delete();
      }

      setSuccess(`${selectedFiles.length + selectedFolders.length} item(s) deleted successfully`);
      setSelectedFiles([]);
      setSelectedFolders([]);

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete items. Please try again.");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleDownloadSelected = () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to download");
      setTimeout(() => setError(""), 3000);
      return;
    }

    selectedFiles.forEach(fileId => {
      const file = childFiles.find(f => f.id === fileId);
      if (file && file.url) {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });

    setSuccess(`${selectedFiles.length} file(s) downloading...`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDownloadAll = () => {
    if (filteredFiles.length === 0) {
      setError("No files to download");
      setTimeout(() => setError(""), 3000);
      return;
    }

    filteredFiles.forEach(file => {
      if (file.url) {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });

    setSuccess(`${filteredFiles.length} file(s) downloading...`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("asc");
    }
  };

  const storageStats = {
    used: 2.5, // GB - You should calculate this from actual data
    total: 15, // GB
    percentage: (2.5 / 15) * 100,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Storage Stats - Moved to top */}
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
            <div className="flex justify-between text-xs text-gray-500">
              <span>Free: {storageStats.total - storageStats.used} GB</span>
              <button 
                onClick={() => window.location.href = "/upgrade"}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Upgrade plan
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 alert-danger flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 alert-success flex items-center space-x-2 animate-fade-in">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

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

              {/* Sort Dropdown */}
              <div className="relative">
                <div className="dropdown">
                  <button className="btn-secondary flex items-center space-x-1 text-sm">
                    <Filter className="h-4 w-4" />
                    <span>Sort</span>
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </button>
                  <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 hidden">
                    <button 
                      onClick={() => handleSort("name")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                    <button 
                      onClick={() => handleSort("date")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                    <button 
                      onClick={() => handleSort("size")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Size {sortBy === "size" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Select All */}
              <button
                onClick={handleSelectAll}
                className="btn-secondary text-sm"
              >
                {(selectedFiles.length === filteredFiles.length && 
                  selectedFolders.length === filteredFolders.length && 
                  (filteredFiles.length > 0 || filteredFolders.length > 0))
                  ? "Deselect All" 
                  : "Select All"}
              </button>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <AddFileButton currentFolder={folder} />
                <AddFolderButton currentFolder={folder} />
                <button
                  onClick={handleDownloadSelected}
                  disabled={selectedFiles.length === 0}
                  className="btn-primary flex items-center space-x-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={selectedFiles.length === 0 && selectedFolders.length === 0}
                  className="btn-danger flex items-center space-x-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Folders Section */}
          {filteredFolders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Folders</h2>
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}`}>
                {filteredFolders.map(childFolder => (
                  <div
                    key={childFolder.id}
                    className={viewMode === "grid" ? "" : "w-full"}
                  >
                    <Folder
                      folder={childFolder}
                      selected={selectedFolders.includes(childFolder.id)}
                      onSelect={() => handleFolderSelect(childFolder.id)}
                      viewMode={viewMode}
                    />
                  </div>
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
                  <div
                    key={childFile.id}
                    className={viewMode === "grid" ? "" : "w-full"}
                  >
                    <File
                      file={childFile}
                      selected={selectedFiles.includes(childFile.id)}
                      onSelect={() => handleFileSelect(childFile.id)}
                      viewMode={viewMode}
                    />
                  </div>
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
              {!searchQuery && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <AddFileButton currentFolder={folder} />
                  <AddFolderButton currentFolder={folder} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats - Moved below storage progress */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Folders</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredFolders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Files</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredFiles.length}</p>
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
      </main>
    </div>
  );
}
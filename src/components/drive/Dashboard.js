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
} from "lucide-react";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("name"); // 'name', 'date', 'size'
  const { currentUser } = useAuth();

  // File type icons mapping
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
      return <Image className="h-5 w-5 text-purple-500" />;
    } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
      return <Video className="h-5 w-5 text-red-500" />;
    } else if (['mp3', 'wav', 'flac'].includes(extension)) {
      return <Music className="h-5 w-5 text-yellow-500" />;
    } else if (['zip', 'rar', '7z', 'tar'].includes(extension)) {
      return <Archive className="h-5 w-5 text-gray-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

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
    if (selectedFiles.length === childFiles.length) {
      setSelectedFiles([]);
      setSelectedFolders([]);
    } else {
      setSelectedFiles(childFiles.map(f => f.id));
      setSelectedFolders(childFolders.map(f => f.id));
    }
  };

  const handleDownloadSelected = () => {
    selectedFiles.forEach(fileId => {
      const file = childFiles.find(f => f.id === fileId);
      if (file) {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        link.click();
      }
    });
  };

  const storageStats = {
    used: 2.5, // GB
    total: 15, // GB
    percentage: (2.5 / 15) * 100,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Storage Stats */}
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
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Upgrade plan
              </button>
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

              {/* Sort Dropdown */}
              <div className="relative">
                <button className="btn-secondary flex items-center space-x-1 text-sm">
                  <Filter className="h-4 w-4" />
                  <span>Sort</span>
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </button>
              </div>

              {/* Select All */}
              <button
                onClick={handleSelectAll}
                className="btn-secondary text-sm"
              >
                {selectedFiles.length === childFiles.length ? "Deselect All" : "Select All"}
              </button>

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
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Folders Section */}
          {childFolders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Folders</h2>
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}`}>
                {childFolders.map(childFolder => (
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
          {childFiles.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Files</h2>
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}`}>
                {childFiles.map(childFile => (
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
          {childFolders.length === 0 && childFiles.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FolderPlus className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                This folder is empty
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Upload files or create folders to get started. Your files will be
                securely stored and accessible from anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <AddFileButton currentFolder={folder} />
                <AddFolderButton currentFolder={folder} />
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderPlus className="h-5 w-5 text-blue-600" />
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
                <FileText className="h-5 w-5 text-green-600" />
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
      </main>
    </div>
  );
}
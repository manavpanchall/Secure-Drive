import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../firebase";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import { 
  FolderPlus, 
  X, 
  Folder, 
  Check, 
  Sparkles,
  Loader2
} from "lucide-react";

export default function AddFolderButton({ currentFolder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a folder name");
      return;
    }

    if (currentFolder == null) {
      setError("Cannot create folder here");
      return;
    }

    const path = [...currentFolder.path];
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id });
    }

    setIsCreating(true);
    setError("");

    database.folders.add({
      name: name.trim(),
      parentId: currentFolder.id,
      userId: currentUser.uid,
      path: path,
      createdAt: database.getCurrentTimestamp(),
    })
    .then(() => {
      setName("");
      setIsOpen(false);
      
      // Show success message
      setTimeout(() => {
        // You could add a toast notification here
      }, 300);
    })
    .catch((err) => {
      console.error("Error creating folder:", err);
      setError("Failed to create folder. Please try again.");
    })
    .finally(() => {
      setIsCreating(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary flex items-center space-x-2 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white group-hover:bg-gray-50 transition-colors"></div>
        <div className="relative z-10 flex items-center space-x-2">
          <FolderPlus className="h-4 w-4" />
          <span className="hidden sm:inline">New Folder</span>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <FolderPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-display">
                      Create New Folder
                    </h3>
                    <p className="text-sm text-gray-600">
                      Organize your files with folders
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isCreating}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="form-label block text-sm font-semibold text-gray-700 mb-2">
                    Folder Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Folder className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                      }}
                      className="input-field pl-10"
                      placeholder="e.g., Project Documents, Photos, etc."
                      autoFocus
                      disabled={isCreating}
                    />
                  </div>
                  {error && (
                    <p className="text-red-600 text-sm mt-2">{error}</p>
                  )}
                </div>

                {/* Tips */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Naming Tips</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Use descriptive names (e.g., "Q4 Reports")</li>
                        <li>• Include dates if relevant (e.g., "2024 Photos")</li>
                        <li>• Keep names short but meaningful</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isCreating}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim() || isCreating}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Create Folder</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
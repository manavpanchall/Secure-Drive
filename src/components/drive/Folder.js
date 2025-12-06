import React from "react";
import { Link } from "react-router-dom";
import { 
  Folder as FolderIcon, 
  ChevronRight, 
  MoreVertical,
  Calendar,
  Users,
  Lock
} from "lucide-react";

export default function Folder({ folder, selected, onSelect, viewMode = "grid" }) {
  const getFolderEmoji = (folderName) => {
    const name = folderName.toLowerCase();
    if (name.includes('work') || name.includes('project')) return '💼';
    if (name.includes('photo') || name.includes('image')) return '🖼️';
    if (name.includes('video') || name.includes('movie')) return '🎬';
    if (name.includes('music') || name.includes('audio')) return '🎵';
    if (name.includes('doc') || name.includes('file')) return '📄';
    if (name.includes('download')) return '⬇️';
    if (name.includes('shared')) return '👥';
    if (name.includes('private') || name.includes('secure')) return '🔒';
    return '📁';
  };

  if (viewMode === "list") {
    return (
      <div className={`flex items-center justify-between p-4 bg-white rounded-xl border transition-all duration-200 group ${
        selected 
          ? 'border-primary-300 bg-primary-50/50 shadow-sm' 
          : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
      }`}>
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl blur-sm opacity-50 group-hover:opacity-70"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <FolderIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <Link
                to={{
                  pathname: `/folder/${folder.id}`,
                  state: { folder: folder },
                }}
                className="text-sm font-semibold text-gray-900 hover:text-primary-600 truncate block group"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getFolderEmoji(folder.name)}</span>
                  <span className="truncate">{folder.name}</span>
                </div>
              </Link>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Updated recently</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pl-4">
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="relative group">
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="absolute top-4 left-4 h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300 cursor-pointer z-10 opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity"
      />
      
      <Link
        to={{
          pathname: `/folder/${folder.id}`,
          state: { folder: folder },
        }}
        className="block bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-soft p-5 transition-all duration-300 hover:shadow-hard hover:border-primary-200 hover:scale-[1.02] group-hover:bg-white"
      >
        <div className="flex flex-col items-center text-center">
          {/* Folder Icon */}
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <FolderIcon className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
              <span className="text-lg">{getFolderEmoji(folder.name)}</span>
            </div>
          </div>

          {/* Folder Name */}
          <h3 className="text-sm font-semibold text-gray-900 truncate w-full mb-2 group-hover:text-primary-600 transition-colors">
            {folder.name}
          </h3>

          {/* Folder Info */}
          <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Folder</span>
            </div>
            <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <Lock className="h-3 w-3" />
              <span>Private</span>
            </div>
          </div>

          {/* Action Indicator */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-center space-x-1 text-xs text-primary-600 font-medium">
              <ChevronRight className="h-4 w-4" />
              <span>Open folder</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
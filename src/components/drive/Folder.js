import React from "react";
import { Link } from "react-router-dom";
import { Folder as FolderIcon, ChevronRight, MoreVertical } from "lucide-react";

export default function Folder({ folder, selected, onSelect, viewMode = "grid" }) {
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
          <div className="p-2 bg-blue-100 rounded-lg">
            <FolderIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <Link
              to={{
                pathname: `/folder/${folder.id}`,
                state: { folder: folder },
              }}
              className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block"
            >
              {folder.name}
            </Link>
            <p className="text-xs text-gray-500">Folder • Updated recently</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-gray-400" />
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
      <Link
        to={{
          pathname: `/folder/${folder.id}`,
          state: { folder: folder },
        }}
        className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-blue-100 rounded-lg mb-3">
            <FolderIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 truncate w-full mb-1">
            {folder.name}
          </h3>
          <p className="text-xs text-gray-500">Folder</p>
        </div>
      </Link>
    </div>
  );
}
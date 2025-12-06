import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { ROOT_FOLDER } from "../../hooks/useFolder";

export default function FolderBreadcrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) path = [...path, ...currentFolder.path];

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        to="/"
        className="text-gray-600 hover:text-primary-600 p-1 rounded-lg hover:bg-gray-100"
      >
        <Home className="h-4 w-4" />
      </Link>

      {path.map((folder, index) => (
        <div key={folder.id} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            to={{
              pathname: folder.id ? `/folder/${folder.id}` : "/",
              state: { folder: { ...folder, path: path.slice(1, index) } },
            }}
            className="text-gray-600 hover:text-primary-600 px-2 py-1 rounded-lg hover:bg-gray-100 truncate max-w-[120px]"
          >
            {folder.name}
          </Link>
        </div>
      ))}

      {currentFolder && (
        <>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900 px-2 py-1 truncate max-w-[150px]">
            {currentFolder.name}
          </span>
        </>
      )}
    </nav>
  );
}
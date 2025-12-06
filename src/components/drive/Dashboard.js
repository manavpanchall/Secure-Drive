import React, { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import Navbar from "./Navbar";
import AddFolderButton from "./AddFolderButton";
import Folder from "./Folder";
import { useFolder } from "../../hooks/useFolder";
import { useParams, useLocation } from "react-router-dom";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import AddFileButton from "./AddFileButton";
import File from "./File";
import { database } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [error, setError] = useState("");

  const handleFileSelect = (fileId) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  const handleFolderSelect = (folderId) => {
    if (selectedFolders.includes(folderId)) {
      setSelectedFolders(selectedFolders.filter((id) => id !== folderId));
    } else {
      setSelectedFolders([...selectedFolders, folderId]);
    }
  };

  const handleDelete = async () => {
    // ... existing delete code ...
  };

  const handleDownloadSelected = () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to download");
      return;
    }

    // Download selected files one by one
    selectedFiles.forEach((fileId) => {
      const file = childFiles.find((f) => f.id === fileId);
      if (file) {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name || "download";
        link.target = "_blank";
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

    // Download all files in the current folder
    childFiles.forEach((file) => {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name || "download";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <>
      <Navbar />
      <Container fluid>
        <div className="d-flex align-items-center">
          <FolderBreadcrumbs currentFolder={folder} />
          <div className="ms-auto d-flex align-items-center gap-2">
            {/* Upload Button */}
            <AddFileButton currentFolder={folder} />

            {/* Add Folder Button */}
            <AddFolderButton currentFolder={folder} />

            {/* Download All Button */}
            {childFiles.length > 0 && (
              <Button
                variant="outline-primary"
                onClick={handleDownloadAll}
                className="d-flex align-items-center"
                style={{
                  padding: "6px 12px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  fontWeight: "500",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s, border-color 0.3s",
                  whiteSpace: "nowrap",
                  height: "38px",
                }}
                title="Download all files in this folder"
              >
                <FontAwesomeIcon icon={faDownload} className="me-1" />
                Download All
              </Button>
            )}

            {/* Download Selected Button */}
            <Button
              variant="outline-primary"
              onClick={handleDownloadSelected}
              disabled={selectedFiles.length === 0}
              className="d-flex align-items-center"
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                borderRadius: "4px",
                fontWeight: "500",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s, border-color 0.3s",
                whiteSpace: "nowrap",
                height: "38px",
              }}
              title="Download selected files"
            >
              <FontAwesomeIcon icon={faDownload} className="me-1" />
              Download Selected ({selectedFiles.length})
            </Button>

            {/* Delete Selected Button */}
            <Button
              variant="outline-danger"
              onClick={handleDelete}
              disabled={selectedFiles.length === 0 && selectedFolders.length === 0}
              className="d-flex align-items-center"
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                borderRadius: "4px",
                fontWeight: "500",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s, border-color 0.3s",
                whiteSpace: "nowrap",
                height: "38px",
              }}
            >
              Delete Selected ({selectedFiles.length + selectedFolders.length})
            </Button>
          </div>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {/* Folders Section */}
        {childFolders.length > 0 && (
          <>
            <h5 className="mt-3 mb-2">Folders</h5>
            <div className="d-flex flex-wrap">
              {childFolders.map((childFolder) => (
                <div
                  key={childFolder.id}
                  style={{ maxWidth: "250px" }}
                  className="p-2"
                >
                  <Folder
                    folder={childFolder}
                    selected={selectedFolders.includes(childFolder.id)}
                    onSelect={() => handleFolderSelect(childFolder.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Files Section */}
        {childFiles.length > 0 && (
          <>
            <h5 className="mt-3 mb-2">Files</h5>
            <div className="d-flex flex-wrap">
              {childFiles.map((childFile) => (
                <div
                  key={childFile.id}
                  style={{ maxWidth: "350px" }}
                  className="p-2"
                >
                  <File
                    file={childFile}
                    selected={selectedFiles.includes(childFile.id)}
                    onSelect={() => handleFileSelect(childFile.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {childFolders.length === 0 && childFiles.length === 0 && (
          <div className="text-center mt-5">
            <h4>This folder is empty</h4>
            <p>Upload files or create folders to get started</p>
          </div>
        )}
      </Container>
    </>
  );
}
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
    try {
      setError("");

      // Delete selected files
      for (const fileId of selectedFiles) {
        const file = childFiles.find((f) => f.id === fileId);
        if (file) {
          // Delete from Firestore
          await database.files.doc(fileId).delete();
        }
      }

      // Delete selected folders
      for (const folderId of selectedFolders) {
        await database.folders.doc(folderId).delete();
      }

      // Clear selections
      setSelectedFiles([]);
      setSelectedFolders([]);
    } catch (err) {
      setError("Failed to delete items");
      console.error(err);
    }
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

            {/* Spacer between Add Folder and Delete Selected Button */}
            <div style={{ width: "8px" }}></div> {/* Add space here */}

            {/* Delete Selected Button */}
            <Button
              variant="outline-danger" // Use outline-danger for consistency
              onClick={handleDelete}
              disabled={selectedFiles.length === 0 && selectedFolders.length === 0}
              className="d-flex align-items-center"
              style={{
                padding: "6px 12px", // Consistent padding
                fontSize: "14px", // Consistent font size
                borderRadius: "4px", // Rounded corners
                fontWeight: "500", // Medium font weight
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
                whiteSpace: "nowrap", // Prevent text wrapping
                height: "38px", // Consistent height
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#dc3545"; // Solid red on hover
                e.target.style.color = "#fff"; // White text on hover
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent"; // Transparent background
                e.target.style.color = "#dc3545"; // Red text
              }}
            >
              Delete Selected
            </Button>
          </div>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {childFolders.length > 0 && (
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
        )}

        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map((childFile) => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
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
        )}
      </Container>
    </>
  );
}
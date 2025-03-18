import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { uploadFileToCloudinary } from "../../cloudinary";
import { database } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { ProgressBar, Toast } from "react-bootstrap";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!currentFolder || !file) return;

    // Check file size (e.g., 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds the limit of 10MB.");
      return;
    }

    // Check file type (e.g., allow only images and PDFs)
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, and PDF files are allowed.");
      return;
    }

    const id = uuidV4();
    setUploadingFiles((prev) => [
      ...prev,
      { id, name: file.name, progress: 0, error: false },
    ]);

    try {
      const fileUrl = await uploadFileToCloudinary(file);
      await database.files.add({
        url: fileUrl,
        name: file.name,
        createdAt: database.getCurrentTimestamp(),
        folderId: currentFolder.id,
        userId: currentUser.uid,
      });

      setUploadingFiles((prev) =>
        prev.filter((uploadFile) => uploadFile.id !== id)
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadingFiles((prev) =>
        prev.map((uploadFile) =>
          uploadFile.id === id ? { ...uploadFile, error: true } : uploadFile
        )
      );
    }
  };

  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 mr-2">
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploadingFiles.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1rem",
            maxWidth: "250px",
          }}
        >
          {uploadingFiles.map((file) => (
            <Toast
              key={file.id}
              onClose={() => {
                setUploadingFiles((prev) =>
                  prev.filter((uploadFile) => uploadFile.id !== file.id)
                );
              }}
            >
              <Toast.Header
                closeButton={file.error}
                className="text-truncate w-100 d-block"
              >
                {file.name}
              </Toast.Header>
              <Toast.Body>
                <ProgressBar
                  animated={!file.error}
                  variant={file.error ? "danger" : "primary"}
                  now={file.error ? 100 : file.progress * 100}
                  label={
                    file.error ? "Error" : `${Math.round(file.progress * 100)}%`
                  }
                />
              </Toast.Body>
            </Toast>
          ))}
        </div>
      )}
    </>
  );
}
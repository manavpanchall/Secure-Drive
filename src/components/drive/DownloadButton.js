import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function DownloadButton({ fileUrl, fileName }) {
  
  const handleDownload = () => {
    // Create a temporary anchor element for download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    link.target = "_blank"; // Open in new tab for large files
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline-primary"
      size="sm"
      onClick={handleDownload}
      title="Download file"
    >
      <FontAwesomeIcon icon={faDownload} /> Download
    </Button>
  );
}
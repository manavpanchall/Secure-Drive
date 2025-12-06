import React from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faDownload } from "@fortawesome/free-solid-svg-icons";

export default function File({ file, selected, onSelect }) {
  
  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create a temporary anchor element for download
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center flex-grow-1">
        <Form.Check
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="me-2"
        />
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-dark text-truncate flex-grow-1 text-start"
          style={{ textDecoration: "none" }}
        >
          <FontAwesomeIcon icon={faFile} className="mr-2" />
          {file.name}
        </a>
      </div>
      <Button
        variant="outline-primary"
        size="sm"
        onClick={handleDownload}
        className="ms-2"
        title="Download file"
      >
        <FontAwesomeIcon icon={faDownload} />
      </Button>
    </div>
  );
}
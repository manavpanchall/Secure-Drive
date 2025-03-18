import React from "react";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

export default function File({ file, selected, onSelect }) {
  return (
    <div className="d-flex align-items-center">
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
        className="btn btn-outline-dark text-truncate w-100"
      >
        <FontAwesomeIcon icon={faFile} className="mr-2" />
        {file.name}
      </a>
    </div>
  );
}
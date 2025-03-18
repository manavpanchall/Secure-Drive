import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

export default function Folder({ folder, selected, onSelect }) {
  return (
    <div className="d-flex align-items-center">
      <Form.Check
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="me-2"
      />
      <Button
        to={{
          pathname: `/folder/${folder.id}`,
          state: { folder: folder },
        }}
        variant="outline-dark"
        className="text-truncate w-100"
        as={Link}
      >
        <FontAwesomeIcon icon={faFolder} className="mr-2" />
        {folder.name}
      </Button>
    </div>
  );
}
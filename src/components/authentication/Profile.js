import React, { useState } from "react";
import { Card, Button, Alert, Image } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "../authentication/CenteredContainer";
import defaultAvatar from "../../assets/default-avatar.png";

export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  console.log("Profile component rendered"); // Debugging
  console.log("Current User:", currentUser); // Debugging

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  if (!currentUser) {
    console.log("No current user found"); // Debugging
    return <div>Loading...</div>; // Show a loading state if currentUser is not available
  }

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="text-center">
            <Image
              src={currentUser.photoURL || defaultAvatar}
              roundedCircle
              width="100"
              height="100"
              className="mb-3"
            />
            <p>
              <strong>Name:</strong> {currentUser.displayName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
          </div>
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </CenteredContainer>
  );
}
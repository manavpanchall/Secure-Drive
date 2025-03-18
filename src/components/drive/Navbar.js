import React from "react";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import defaultAvatar from "../../assets/default-avatar.png";

export default function NavbarComponent() {
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleProfileClick = () => {
    console.log("Profile clicked"); // Debugging
    history.push("/profile"); // Navigate to the profile page
  };

  const handleLogout = () => {
    logout();
    history.push("/login"); // Navigate to the login page after logout
  };

  return (
    <Navbar bg="primary" variant="dark" expand="sm" className="px-3">
      <Container fluid>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/">
          Secure Drive
        </Navbar.Brand>

        {/* Navbar Toggle for small screens */}
        <Navbar.Toggle aria-controls="navbar-content" />

        {/* Navbar Content */}
        <Navbar.Collapse id="navbar-content" className="justify-content-end">
          <Nav>
            {currentUser && (
              <Dropdown align="end" onSelect={(eventKey) => {
                if (eventKey === "profile") {
                  handleProfileClick();
                } else if (eventKey === "logout") {
                  handleLogout();
                }
              }}>
                {/* Dropdown Toggle */}
                <Dropdown.Toggle
                  variant="primary"
                  id="dropdown-profile"
                  className="d-flex align-items-center"
                >
                  <Image
                    src={currentUser.photoURL || defaultAvatar}
                    alt="Profile"
                    roundedCircle
                    width="30"
                    height="30"
                    className="me-2"
                  />
                  <span>{currentUser.displayName || currentUser.email}</span>
                </Dropdown.Toggle>

                {/* Dropdown Menu */}
                <Dropdown.Menu style={{ zIndex: 1000 }}>
                  <Dropdown.Item eventKey="profile">Profile</Dropdown.Item>
                  <Dropdown.Item eventKey="logout">Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
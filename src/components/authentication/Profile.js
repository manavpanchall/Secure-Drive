import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import CenteredContainer from "../authentication/CenteredContainer";
import { User, Mail, Calendar, LogOut, Edit, Shield, HardDrive } from "lucide-react";

export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

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
    return (
      <CenteredContainer>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer title="Profile" subtitle="Manage your account settings">
      {error && (
        <div className="alert-danger mb-4 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Header */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="h-24 w-24 rounded-full"
                />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>
            <button className="absolute bottom-4 right-0 bg-white p-2 rounded-full shadow-md hover:shadow-lg">
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900">
            {currentUser.displayName || "User"}
          </h2>
          <p className="text-gray-600">{currentUser.email}</p>
        </div>

        {/* Account Details */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Account Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Email</span>
              </div>
              <span className="font-medium">{currentUser.email}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Member Since</span>
              </div>
              <span className="font-medium">
                {currentUser.metadata?.creationTime
                  ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Account Status</span>
              </div>
              <span className="font-medium text-green-600">Verified</span>
            </div>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Storage</h3>
            </div>
            <span className="text-sm text-gray-600">2.5 GB of 15 GB used</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: "16.6%" }}></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/update-profile"
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Edit className="h-5 w-5" />
            <span>Update Profile</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="btn-danger w-full flex items-center justify-center space-x-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Security Note */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Your data is encrypted and secure. We use industry-standard security practices to protect your information.
            </p>
          </div>
        </div>
      </div>
    </CenteredContainer>
  );
}
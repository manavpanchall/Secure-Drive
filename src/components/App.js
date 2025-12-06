import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "./authentication/PrivateRoute";

// Authentication Components
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import ForgotPassword from "./authentication/ForgotPassword";
import Profile from "./authentication/Profile";
import UpdateProfile from "./authentication/UpdateProfile";

// Drive Components
import Dashboard from "./drive/Dashboard";

// Test Component (optional - can remove later)
import TestTailwind from "./TestTailwind";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          {/* Test Route - Remove this when everything is working */}
          <Route exact path="/test" component={TestTailwind} />
          
          {/* Drive Routes */}
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/folder/:folderId" component={Dashboard} />
          
          {/* Profile Routes */}
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          
          {/* Authentication Routes */}
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          
          {/* 404 Page - Keep this at the end */}
          <Route path="*">
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">Page not found</p>
                <p className="text-gray-500 mb-8">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <a
                  href="/"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Back to Home</span>
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
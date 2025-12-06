import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";
import { Mail, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <CenteredContainer
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
    >
      {error && (
        <div className="alert-danger flex items-center space-x-2 mb-4 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      
      {message && (
        <div className="alert-success flex items-center space-x-2 mb-4 p-3 rounded-lg">
          <CheckCircle className="h-5 w-5" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="form-label block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              ref={emailRef}
              required
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <span>{loading ? "Sending..." : "Reset Password"}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <Link
          to="/login"
          className="font-medium text-primary-600 hover:text-primary-700"
        >
          Back to Login
        </Link>
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          If you don't receive an email within a few minutes, check your spam folder.
        </p>
      </div>
    </CenteredContainer>
  );
}
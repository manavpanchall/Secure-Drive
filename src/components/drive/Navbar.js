import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Cloud,
  User,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Bell,
  Settings,
  HelpCircle,
  Zap,
  Sparkles,
} from "lucide-react";

export default function NavbarComponent({ onSearch }) {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNotifications, setHasNotifications] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileClick = () => {
    history.push("/profile");
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  const clearNotifications = () => {
    setHasNotifications(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100' 
        : 'bg-white/80 backdrop-blur-lg border-b border-white/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side: Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 rounded-xl blur group-hover:blur-lg transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-xl shadow-lg">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 font-display">
                  Secure<span className="gradient-text font-bold">Drive</span>
                </span>
                <span className="text-xs text-gray-500 -mt-1">Cloud Storage</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 ml-8">
              <Link 
                to="/" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/recent" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Recent
              </Link>
              <Link 
                to="/shared" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Shared
              </Link>
              <Link 
                to="/starred" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Starred
              </Link>
            </div>
          </div>

          {/* Center: Search bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search files, folders, and more..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Right side: Actions and User menu */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={clearNotifications}
                className="p-2 rounded-xl hover:bg-gray-100 relative transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {hasNotifications && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Upgrade Button */}
            <Link 
              to="/upgrade"
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Zap className="h-4 w-4" />
              <span>Upgrade</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Profile dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
                    <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="h-9 w-9 rounded-full"
                        />
                      ) : (
                        currentUser.displayName?.[0] || currentUser.email?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </p>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">
                        {currentUser.email?.includes('@gmail.com') ? 'Google' : 'Email'}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-primary-600 font-medium">Free Plan</span>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-hard border border-gray-100 py-2 z-50 animate-slide-down">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                          {currentUser.photoURL ? (
                            <img
                              src={currentUser.photoURL}
                              alt="Profile"
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            currentUser.displayName?.[0] || currentUser.email?.[0]?.toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {currentUser.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full">
                              {currentUser.email?.includes('@gmail.com') ? 'Google Account' : 'Email Account'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 group"
                      >
                        <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-primary-50 transition-colors">
                          <User className="h-4 w-4 text-gray-600 group-hover:text-primary-600" />
                        </div>
                        <span>Profile</span>
                      </button>
                      
                      <Link
                        to="/settings"
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 group"
                      >
                        <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-primary-50 transition-colors">
                          <Settings className="h-4 w-4 text-gray-600 group-hover:text-primary-600" />
                        </div>
                        <span>Settings</span>
                      </Link>
                      
                      <Link
                        to="/help"
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 group"
                      >
                        <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-primary-50 transition-colors">
                          <HelpCircle className="h-4 w-4 text-gray-600 group-hover:text-primary-600" />
                        </div>
                        <span>Help & Support</span>
                      </Link>

                      <div className="px-4 py-2.5 mt-1">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Sparkles className="h-4 w-4 text-amber-600" />
                            <span className="text-xs font-semibold text-amber-800">Upgrade to Pro</span>
                          </div>
                          <p className="text-xs text-amber-700 mb-2">Get 100GB storage & premium features</p>
                          <Link
                            to="/upgrade"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200"
                          >
                            <Zap className="h-3 w-3" />
                            <span>Upgrade Now</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 group"
                      >
                        <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 animate-slide-down">
            <div className="space-y-3">
              {/* Mobile Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search files..."
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Mobile Navigation */}
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  to="/" 
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-xl text-center transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/recent" 
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-xl text-center transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Recent
                </Link>
                <Link 
                  to="/shared" 
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-xl text-center transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shared
                </Link>
                <Link 
                  to="/starred" 
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-xl text-center transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Starred
                </Link>
              </div>
              
              {/* Upgrade button for mobile */}
              <Link 
                to="/upgrade"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg flex items-center justify-center space-x-2 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Zap className="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
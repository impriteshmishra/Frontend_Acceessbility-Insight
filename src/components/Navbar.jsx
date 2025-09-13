import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  Eye,
  Home,
  Search,
  HelpCircle,
  Info,
  History,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import { getUser } from "../api/getUser.api";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/slice/authSlice.js";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const showButton = location.pathname !== "/";
  const navigate = useNavigate();
  const { user } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  // console.log("isauth", isAuthenticated);

  const handleNavigate = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleRecentUrl = () => {
    navigate("/recent-scan");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Why Accessibility", href: "/why", icon: HelpCircle },
    { name: "About", href: "/about", icon: Info },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        try {
          const response = await getUser(user.id);
          dispatch(login(response.data));
          setDbUser(response.data);
        } catch (error) {
          // console.error("Error fetching user:", error);
        }
      } else {
        dispatch(logout());
        setDbUser(null);
      }
    };

    fetchUser();
  }, [user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest("nav")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav
      className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center cursor-pointer group"
            onClick={handleNavigate}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNavigate();
              }
            }}
          >
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="relative p-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Eye className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Accessibility
                </h1>
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Insight
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:text-indigo-600"
                  }`}
                >
                  <IconComponent className="w-4 h-4" aria-hidden="true" />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"></div>
                  )}
                </a>
              );
            })}
          </div>
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && (
              <button
                onClick={handleRecentUrl}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                <History className="w-4 h-4" />
                <span>Recent</span>
              </button>
            )}

            {showButton && (
              <button
                onClick={handleNavigate}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Search className="w-4 h-4" />
                <span>Start Scan</span>
              </button>
            )}

            <div className="flex items-center">
              <ClerkLoading>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg animate-pulse">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-gray-500 text-sm">Loading...</span>
                </div>
              </ClerkLoading>

              <ClerkLoaded>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 bg-white border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-center">
                    <UserButton
                      afterSignOutUrl="/"
                      onSignOut={() => dispatch(logout())}
                      appearance={{
                        elements: {
                          avatarBox:
                            "w-8 h-8 ring-2 ring-indigo-500 ring-offset-2",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
              </ClerkLoaded>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-2 bg-white border-t border-gray-100">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <IconComponent className="w-5 h-5" aria-hidden="true" />
                <span>{item.name}</span>
              </a>
            );
          })}

          <div className="pt-4 space-y-2 border-t border-gray-100">
            {isAuthenticated && (
              <button
                onClick={handleRecentUrl}
                className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                <History className="w-5 h-5" />
                <span>Recent Scans</span>
              </button>
            )}

            {showButton && (
              <button
                onClick={handleNavigate}
                className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-base font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Search className="w-5 h-5" />
                <span>Start Scan</span>
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <ClerkLoading>
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg animate-pulse">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <span className="text-gray-500">Loading...</span>
              </div>
            </ClerkLoading>

            <ClerkLoaded>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full px-4 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center justify-center py-2">
                  <UserButton
                    afterSignOutUrl="/"
                    onSignOut={() => dispatch(logout())}
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-10 h-10 ring-2 ring-indigo-500 ring-offset-2",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

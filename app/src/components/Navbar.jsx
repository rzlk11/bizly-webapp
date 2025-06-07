import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  // Create ref for dropdown container
  const profileMenuRef = useRef(null);

  // Update page title based on current route
  useEffect(() => {
    // Map routes to their display titles
    const routeTitles = {
      "/dashboard": "Dashboard",
      "/pemasukan": "Pemasukan",
      "/pengeluaran": "Pengeluaran",
      "/kategori": "Pengelolaan Kategori",
      "/kategori/kelola": "Pengelolaan Kategori",
      "/pengaturan": "Pengaturan",
      "/profile": "Profile",
      "/help": "Help",
      "/login": "Login",
    };

    // Set page title based on current path or default to 'Dashboard'
    setPageTitle(routeTitles[location.pathname] || "Dashboard");
  }, [location.pathname]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close profile menu if clicked outside the profile menu container
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle profile menu functionality
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const isDashboard =
    location.pathname === "/dashboard" || location.pathname === "/profile";

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="bg-white shadow-sm px-4 py-2 flex items-center justify-between relative font-['Poppins']">
        {/* Left side - Menu toggle and Page title */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <MenuIcon />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-2">
            {pageTitle}
          </h1>
        </div>

        {/* Right side - Profile */}
        <div className="flex items-center space-x-4">
          {/* User profile button */}
          <div className="relative" ref={profileMenuRef}>
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={handleProfileClick}
            >
              <AccountCircleIcon fontSize="small" />
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="p-4 border-b">
                  <p className="font-medium">
                    {user.username ?? user.email?.split("@")[0]}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-1 text-ellipsis">
                    {user.email}
                  </p>
                </div>
                <div>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 font-['Poppins']">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Konfirmasi Keluar
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar dari aplikasi?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

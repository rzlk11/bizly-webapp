import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/Bizly-logo.png";
import ProfileAvatar from "./ProfileAvatar";

// Import Material UI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import axiosInstance from "../lib/axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState({});
  // Determine active route
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Function to handle navigation to Dashboard page
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  // Function to handle navigation to Pemasukan page
  const navigateToPemasukan = () => {
    navigate("/pemasukan");
  };

  // Function to handle navigation to Pengeluaran page
  const navigateToPengeluaran = () => {
    navigate("/pengeluaran");
  };

  // Function to handle navigation to Profile page
  const navigateToProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axiosInstance.get("/auth/me");
      console.log(response, user);
      const userTest = JSON.parse(localStorage.getItem("user"));
      console.log(userTest);
      setUser(userTest);
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="h-screen w-64 bg-gray-200 overflow-y-auto font-['Poppins']">
        <div className="flex flex-col text-blue-600 min-h-full">
          {/* Logo - Now part of the scrollable area */}
          <div className="flex items-center p-4 border-b border-gray-300 sticky top-0 bg-gray-200 z-10">
            <div className="h-8 w-8 flex-shrink-0">
              <img
                src={logoImg}
                alt="Bizly Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-semibold text-xl ml-2">Bizly</span>
          </div>

          {/* Main Navigation */}
          <div className="flex flex-col flex-grow">
            <div className="py-4">
              <nav>
                {/* Dashboard */}
                <div
                  onClick={navigateToDashboard}
                  className={`flex items-center px-4 py-3 ${
                    isActive("/dashboard")
                      ? "text-blue-600 bg-gray-300"
                      : "text-gray-700"
                  } hover:bg-gray-300 cursor-pointer transition-colors duration-200`}
                >
                  <DashboardIcon fontSize="small" />
                  <span className="ml-3">Dashboard</span>
                </div>

                {/* Pemasukan */}
                <div
                  onClick={navigateToPemasukan}
                  className={`flex items-center px-4 py-3 ${
                    isActive("/pemasukan")
                      ? "text-blue-600 bg-gray-300"
                      : "text-gray-700"
                  } hover:bg-gray-300 cursor-pointer transition-colors duration-200`}
                >
                  <ArrowUpwardIcon fontSize="small" />
                  <span className="ml-3">Pemasukan</span>
                </div>

                {/* Pengeluaran */}
                <div
                  onClick={navigateToPengeluaran}
                  className={`flex items-center px-4 py-3 ${
                    isActive("/pengeluaran")
                      ? "text-blue-600 bg-gray-300"
                      : "text-gray-700"
                  } hover:bg-gray-300 cursor-pointer transition-colors duration-200`}
                >
                  <ArrowDownwardIcon fontSize="small" />
                  <span className="ml-3">Pengeluaran</span>
                </div>

                {/* Profile */}
                <div
                  onClick={navigateToProfile}
                  className={`flex items-center px-4 py-3 ${
                    isActive("/profile")
                      ? "text-blue-600 bg-gray-300"
                      : "text-gray-700"
                  } hover:bg-gray-300 cursor-pointer transition-colors duration-200`}
                >
                  <PersonIcon fontSize="small" />
                  <span className="ml-3">Profile</span>
                </div>
              </nav>
            </div>

            {/* Spacer to push the user profile to the bottom when content is not enough */}
            <div className="flex-grow"></div>

            {/* User Profile and Logout */}
            <div className="border-t border-gray-300">
              <div className="p-4 flex items-center">
                <ProfileAvatar 
                  name={user.username}
                  email={user.email}
                  size="md"
                  className="flex-shrink-0"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {user.username ?? user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-300 transition duration-150 border-t border-gray-300"
              >
                <LogoutIcon fontSize="small" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
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

export default Sidebar;

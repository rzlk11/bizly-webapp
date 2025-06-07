import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import MainLayout from "./components/MainLayout";
import Layout from "./components/Layout";

import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import LupaPassword from "./components/LupaPassword";

import Dashboard from "./pages/Overview/Dashboard";
import ProfileCard from "./pages/profile/profile";

import Pemasukan from "./pages/pemasukan/Pemasukan";
import TambahMasuk from "./pages/pemasukan/TambahMasuk";

import Pengeluaran from "./pages/pengeluaran/pengeluaran";
import TambahKeluar from "./pages/pengeluaran/TambahKeluar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router basename="/">
      <ToastContainer />

      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Rute untuk Overview */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Rute untuk Profile */}
          <Route path="/profile" element={<ProfileCard />} />
          {/* Rute untuk Pemasukan */}
          <Route path="/pemasukan" element={<Pemasukan />} />
          <Route path="/tambah-pemasukan" element={<TambahMasuk />} />
          {/* Rute untuk Pengeluaran */}
          <Route path="/pengeluaran" element={<Pengeluaran />} />
          <Route path="/tambah-pengeluaran" element={<TambahKeluar />} />
        </Route>

        <Route element={<Layout />}>
          {/* Rute default */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/forgot-password" element={<LupaPassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

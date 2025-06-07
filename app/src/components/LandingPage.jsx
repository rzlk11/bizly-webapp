import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import logo from "../assets/Bizly-logo.png";
import fitur1 from "../assets/fitur1.png";
import fitur2 from "../assets/fitur2.png";
import fitur3 from "../assets/fitur3.png";
import dashboard from "../assets/Dashboard2.png";
import gambar1 from "../assets/Masuk.png";
import gambar2 from "../assets/TambahKeluar.png";


const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileNavClick = (id) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  const handleSubscribeClick = (e) => {
    e.preventDefault();
    navigate('/Register');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-['Poppins']">
      {/* Navbar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="DompetIQ Logo" className="h-10 mr-3" />
            <h1 className={`text-2xl font-bold font-700 transition-colors duration-300 ${
              isScrolled ? 'text-[#007AFF]' : 'text-white'
            }`}>Bizly</h1>
          </div>

          {/* Menu Navigasi */}
          <div className="flex justify-between px-4 lg:pl-12 lg:pr-24">
            <nav className="hidden md:flex items-center space-x-6 ml-35">
              <button 
                onClick={() => scrollToSection("Home")} 
                className={`hover:text-[#007AFF] font-500 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("Fitur")} 
                className={`hover:text-[#007AFF] font-500 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                Tentang
              </button>
              <button 
                onClick={() => scrollToSection("Tangkapan-Layar")} 
                className={`hover:text-[#007AFF] font-500 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                Tangkapan Layar
              </button>
            </nav>
          </div>


          {/* Login & Register */}
          <div className="hidden md:flex space-x-4">
            <Link 
              to="/login" 
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                isScrolled 
                  ? 'bg-[#007AFF] text-white hover:bg-[#007AFF]/90' 
                  : 'bg-white text-[#007AFF] hover:bg-white/90'
              }`}
            >
              Masuk
            </Link>
            <Link 
              to="/Register" 
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                isScrolled 
                  ? 'text-[#007AFF] border border-[#007AFF] hover:bg-[#007AFF]/10' 
                  : 'text-white border border-white hover:bg-white/10'
              }`}
            >
              Daftar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-[#007AFF]' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-[#007AFF]' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-6 shadow-lg">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => handleMobileNavClick("Home")} 
                className="text-left py-2 px-4 hover:bg-[#007AFF]/10 hover:text-[#007AFF] rounded-lg text-gray-700"
              >
                Home
              </button>
              <button 
                onClick={() => handleMobileNavClick("Fitur")} 
                className="text-left py-2 px-4 hover:bg-[#007AFF]/10 hover:text-[#007AFF] rounded-lg text-gray-700"
              >
                Tentang
              </button>
              <button 
                onClick={() => handleMobileNavClick("Tangkapan-Layar")} 
                className="text-left py-2 px-4 hover:bg-[#007AFF]/10 hover:text-[#007AFF] rounded-lg text-gray-700"
              >
                Tangkapan Layar
              </button>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link to="/login" className="py-2 px-4 text-center text-white bg-[#007AFF] rounded-lg hover:bg-[#007AFF]/90">
                  Masuk
                </Link>
                <Link to="/Register" className="py-2 px-4 text-center text-[#007AFF] border border-[#007AFF] rounded-lg hover:bg-[#007AFF]/10">
                  Daftar
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main id="Home" className="relative flex flex-col items-center justify-start min-h-[120vh] bg-[url('/src/assets/background.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col items-center">
          {/* Text Content at the top */}
          <div className="text-center z-10 pt-20">
            <h1 className="text-5xl font-bold text-white leading-tight font-400 mt-10">
              Atur Keuanganmu <br />
              Lebih Cerdas Dengan Bizly!
            </h1>
            <p className="mt-4 text-white text-lg font-300">
              UMKM sering kesulitan mengelola keuangan karena keterbatasan waktu dan sumber daya. <br />
              Bizly adalah solusi digital yang membantu UMKM mencatat transaksi otomatis, menganalisis arus kas, <br />
              dan memberikan insight keuangan yang mudah dipahami untuk mendukung pertumbuhan bisnis yang berkelanjutan.
            </p>
          </div>

          {/* Button centered below text */}
          {/* <Link
            to="/login"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-3xl hover:bg-white hover:text-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg z-10"
          >
            Masuk
          </Link> */}
        </div>

        {/* Image positioned directly below the content, centered horizontally, fully visible */}
        <div className="w-[90%] max-w-[1200px] mx-auto mt-16 mb-20">
          <img src={dashboard} alt="Dashboard Screenshot" className="w-full h-auto object-contain shadow-2xl rounded-lg" />
        </div>
      </main>

      {/* Fitur Section */}
      <section id="Fitur" className="py-32 bg-white">
        <div className="container mx-auto text-center px-6">
          {/* Judul & Deskripsi */}
          <h3 className="text-xl font-semibold text-[#007AFF]">Kenapa harus Bizly?</h3>
          <h2 className="text-5xl font-bold text-black leading-tight mt-2">
            Kami adalah tim yang antusias
          </h2>
          <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
            Bizly dirancang khusus untuk mendukung kebutuhan keuangan pelaku UMKM.
            Mulai dari pencatatan transaksi yang fleksibel, fitur filter yang memudahkan
            peninjauan arus kas, penetapan anggaran harian hingga bulanan, hingga
            analisis keuangan otomatis yang mudah dipahami semua dalam satu platform
            praktis yang membantu bisnis berkembang lebih terarah.
          </p>

          {/* Tombol */}
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="bg-[#007AFF] text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center mx-auto"
            >
              Jelajahi <span className="ml-2">→</span>
            </button>
          </div>

          {/* Grid Fitur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Kartu 1 */}
            <div className="bg-white shadow-lg rounded-lg p-8 text-center border border-gray-200">
              <img src={fitur1} alt="Transaksi Filter" className="w-20 mx-auto mb-6" />
              <h4 className="text-2xl font-semibold text-black">Aman & terenkripsi</h4>
              <p className="text-gray-600 mt-2">
                Transaksi tersimpan aman dan terenkripsi.
                Kelola keuangan dengan filter pintar
                berdasarkan kategori atau waktu makin
                praktis, makin terlindungi.
              </p>
              <div className="mt-4 h-1 bg-[#007AFF] w-full"></div>
            </div>

            {/* Kartu 2 */}
            <div className="bg-white shadow-lg rounded-lg p-8 text-center border border-gray-200">
              <img src={fitur2} alt="Anggaran" className="w-20 mx-auto mb-6" />
              <h4 className="text-2xl font-semibold text-black">Cepat & ringan digunakan</h4>
              <p className="text-gray-600 mt-2">
                Dirancang ringan dan responsif, Bizly bisa
                diakses kapan saja tanpa lag — bahkan di
                perangkat dengan spesifikasi standar
              </p>
              <div className="mt-4 h-1 bg-[#007AFF] w-full"></div>
            </div>

            {/* Kartu 3 */}
            <div className="bg-white shadow-lg rounded-lg p-8 text-center border border-gray-200">
              <img src={fitur3} alt="Analisis Keuangan" className="w-20 mx-auto mb-6" />
              <h4 className="text-2xl font-semibold text-black">Mobile ready & responsif</h4>
              <p className="text-gray-600 mt-2">
                Akses Bizly kapan saja, di mana saja.
                Desain responsif kami memastikan
                pengalaman optimal di semua perangkat
                dari smartphone hingga desktop.
              </p>
              <div className="mt-4 h-1 bg-[#007AFF] w-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tangkapan Layar Section */}
      <section id="Tangkapan-Layar" className="py-24 bg-gray-50">
        <div className="container mx-auto text-center px-6">
          {/* Judul Section */}
          <h3 className="text-xl font-semibold text-[#007AFF]">Tangkapan Layar</h3>
          <h2 className="text-5xl font-bold text-black leading-tight mt-2">
            Telusuri fitur-fitur utama <span className="text-[#007AFF]">Bizly</span>
          </h2>

         
          {/* Grid Tangkapan Layar */}
          <div className="container mx-auto px-6">
            {/* First row - 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              {/* Kartu 1 */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <div className="aspect-w-16 aspect-h-9 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={dashboard} 
                    alt="Analisis Keuangan" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-2xl font-semibold text-black">Analisis Keuangan</h4>
              </div>
    
            {/* Kartu 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="aspect-w-16 aspect-h-9 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={gambar1} 
                  alt="Mengatur Pemasukan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-2xl font-semibold text-black">Mengatur Pemasukan</h4>
            </div>
          </div>
  
          {/* Second row - 1 centered card */}
          <div className="flex justify-center mt-12">
            {/* Kartu 3 - Pengeluran */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full md:w-1/2 lg:w-1/2">
              <div className="aspect-w-16 aspect-h-9 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={gambar2} 
                  alt="Mengatur Pengeluaran"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-2xl font-semibold text-black">Mengatur Pengeluaran</h4>              
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto max-w-8xl px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Teks Subscribe */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-[#007AFF]">Subscribe</h3>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mt-2">
              Stay in the loop <br />
              and sign up for<br />
              <span className="underline decoration-[#007AFF]">the Bizly newsletter</span>
            </h2>
          </div>

          {/* Form Subscribe */}
          <div>
            <form 
              className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
              onSubmit={handleSubscribeClick}
            >
              <input
                type="email"
                placeholder="Alamat Email"
                className="w-full max-w-sm md:w-auto flex-1 px-4 py-2 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#007AFF] text-white rounded-lg text-base font-semibold hover:bg-[#007AFF]/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Copyright Section */}
      <div className="bg-white text-black text-center py-4">
        <p className="text-sm">
          Copyright © Bizly 2025. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;

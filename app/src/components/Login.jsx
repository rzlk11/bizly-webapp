import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Bizly-logo.png";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted:", formData);

    try {
      const { data } = await axiosInstance.post("/auth/login", formData);

      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("user", JSON.stringify(data));
      console.log(data);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Email atau password salah");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-['Poppins']">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <span className="mr-2">←</span>
            Kembali ke beranda
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Masuk
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Masukkan email dan kata sandi Anda untuk masuk!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mail@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kata Sandi*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min. 8 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Tetap masuk
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Masuk
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Belum memiliki akun?{" "}
            <Link
              to="/Register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Buat Akun
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center text-sm text-gray-600">
              <p>Copyright © Bizly 2025. Hak Cipta Dilindungi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

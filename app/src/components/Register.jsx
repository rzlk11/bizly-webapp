import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Bizly-logo.png";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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
    console.log("Register form submitted:", formData);

    try {
      const response = await axiosInstance.post("/users/create", {
        ...formData,
        username: formData.name,
        confirmPassword: formData.password,
      });

      toast.success("Berhasil mendaftar, silahkan login");
      navigate("/login");
    } catch (error) {
      toast.error("Terjadi kesalahan, silahkan coba lagi");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-['Poppins']">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            to="/login"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <span className="mr-2">←</span>
            Kembali ke Masuk
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Daftar
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Bergabunglah hari ini dan mulai perjalanan finansial cerdas Anda!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama Anda"
                required
              />
            </div>

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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Daftar
            </button>

            <p className="text-xs text-center text-gray-600">
              Dengan mendaftar, Anda menyetujui{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Ketentuan Layanan
              </a>{" "}
              dan{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Kebijakan Privasi
              </a>{" "}
              kami
            </p>
          </form>

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

export default Register;

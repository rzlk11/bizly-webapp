import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, ChevronDown, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";

const styles = {
  btn: "px-4 py-2 text-sm font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
  btnPrimary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400",
  btnSecondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
  inputField:
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
};

const TambahKeluar = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [categories, setCategories] = useState();
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    nominal: "",
    transactionName: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategorySelect = (id) => {
    setFormData({
      ...formData,
      category: id,
    });

    setCategories(
      categories.map((cat) => ({
        ...cat,
        selected: cat.id === id,
      }))
    );
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const { data } = await axiosInstance.post("/categories", {
          name: newCategory,
          type: "Pengeluaran",
        });

        console.log(data);
        setNewCategory("");
        getCategories();
        toast.success("Kategori berhasil ditambahkan");
      } catch (error) {
        console.log(error);
        toast.error("Gagal menambahkan kategori");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = categories.find((c) => c.selected)?.name || "";

    const formattedDate = selectedDate
      ? `${selectedDate.getDate().toString().padStart(2, "0")}/${(
          selectedDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${selectedDate.getFullYear()}`
      : "";

    const newEntry = {
      date: formattedDate,
      nominal: `Rp. ${formData.nominal},-`,
      name: formData.transactionName,
      category: selectedCategory,
      type: "Pengeluaran",
    };

    console.log("New expense entry:", newEntry);

    try {
      const { data, status } = await axiosInstance.post("/transactions", {
        transaction_name: formData.transactionName,
        transaction_date: selectedDate,
        amount: formData.nominal,
        description: formData.transactionName,
        type: "Pengeluaran",
        category_id: formData.category,
      });

      if (status === 201) {
        toast.success("Pengeluaran berhasil ditambahkan");
        navigate("/pengeluaran");
      }
    } catch (error) {
      console.log(error);
      toast.error("Gagal menambahkan pengeluaran");
    }
  };
  const getCategories = async () => {
    const { data } = await axiosInstance.get('/categories/expense');
    console.log(data);
    setCategories(data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Poppins']">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-center text-blue-500 mb-8">
          Tambah Pengeluaran
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal
            </label>
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yy"
                className={styles.inputField + " pl-10"}
                required
              />
              <Calendar
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Nominal
            </label>
            <input
              type="text"
              name="nominal"
              value={formData.nominal}
              onChange={handleChange}
              placeholder="Nominal Rupiah"
              className={styles.inputField}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Transaksi
            </label>
            <input
              type="text"
              name="transactionName"
              value={formData.transactionName}
              onChange={handleChange}
              placeholder="Ketik disini.."
              className={styles.inputField}
              required
            />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <button
                type="button"
                onClick={() => setShowCategoryPopup(true)}
                className="text-blue-500 hover:text-blue-600 flex items-center text-sm font-medium"
              >
                <Plus size={16} className="mr-1" />
                Tambah Kategori
              </button>
            </div>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={`px-3 py-1 text-sm rounded-md flex items-center ${
                      category.selected
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                        category.selected
                          ? "bg-white text-blue-500"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {category.selected && "✓"}
                    </span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Popup */}
            {showCategoryPopup && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-4 w-80 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryPopup(false);
                      setNewCategory("");
                    }}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                  <h3 className="text-base font-medium text-gray-900 mb-3 pr-6">
                    Tambah Kategori Baru
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Masukkan nama kategori"
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryPopup(false);
                          setNewCategory("");
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/pengeluaran")}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahKeluar;

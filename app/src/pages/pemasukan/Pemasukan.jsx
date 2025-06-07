import { useState, useEffect } from "react";
import MonthIncomeCard from "./IncomeCard";
import AddButton from "./AddButoon";
import IncomeFilter from "./IncomeFilter";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";

const Pemasukan = () => {
  const [incomeData, setIncomeData] = useState({});
  const [filteredData, setFilteredData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await axiosInstance.get("/transactions");
        const transactions = response.data || [];

        console.log(transactions);

        const incomeTransactions = transactions.filter(
          (transaction) => transaction.type === "Pemasukan"
        );

        console.log(incomeTransactions);

        // Group by month
        const groupedByMonth = incomeTransactions.reduce((acc, transaction) => {
          const date = new Date(transaction.transaction_date);
          const monthName = date
            .toLocaleString("default", { month: "long" })
            .toLowerCase();
          const year = date.getFullYear();
          const monthKey = `${monthName}${year}`;

          if (!acc[monthKey]) {
            acc[monthKey] = [];
          }

          console.log(transaction["transaction_products.product.name"]);

          acc[monthKey].push({
            id: transaction.id,
            date: `${date.getDate()} / ${
              date.getMonth() + 1
            } / ${date.getFullYear()}`,
            nominal: `Rp. ${parseFloat(transaction.amount).toLocaleString(
              "id-ID"
            )},-`,
            name: transaction.transaction_name,
            category: transaction["category.name"] || "Tidak Berkategori",
            product:
              transaction["transaction_products.product.name"] ||
              "Tidak Ada Produk",
            quantity: transaction["transaction_products.quantity"] || "-",
            type: transaction["category.name"] || "Lainnya",
            rawDate: transaction.transaction_date,
            amount: parseFloat(transaction.amount),
            description: transaction.description,
          });

          console.log(acc);

          return acc;
        }, {});

        setIncomeData(groupedByMonth);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTransactions();
  }, []);

  useEffect(() => {
    const allCategories = new Set();
    const allProducts = new Set();

    Object.values(incomeData).forEach((monthData) => {
      monthData.forEach((item) => {
        if (item.category) allCategories.add(item.category);
        if (item.product) allProducts.add(item.product);
      });
    });

    setCategories([...allCategories]);
    setProducts([...allProducts]);
  }, [incomeData]);

  const handleUpdateIncome = async (monthKey, index, updatedItem) => {
    try {
      const transactionId = incomeData[monthKey][index].id;

      const updateData = {
        transaction_name: updatedItem.name,
        amount: updatedItem.amount,
        description: updatedItem.description,
        transaction_date: updatedItem.rawDate,
      };

      await axiosInstance.put(`/transactions/${transactionId}`, updateData);

      setIncomeData((prevData) => ({
        ...prevData,
        [monthKey]: prevData[monthKey].map((item, i) =>
          i === index ? updatedItem : item
        ),
      }));

      toast.success("Pemasukan berhasil diubah");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Pemasukan gagal diubah");
    }
  };

  const handleDeleteIncome = async (monthKey, index) => {
    console.log("handleDeleteIncome", monthKey, index);
    console.log("handleDeleteIncome", incomeData, incomeData[monthKey]);
    try {
      const transactionId = incomeData[monthKey][index].id;

      await axiosInstance.delete(`/transactions/${transactionId}`);

      setIncomeData((prevData) => ({
        ...prevData,
        [monthKey]: prevData[monthKey].filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Pemasukan gagal dihapus");
    }
  };

  const handleApplyFilter = (filters) => {
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    const filtered = {};

    Object.entries(incomeData).forEach(([month, monthData]) => {
      const filteredMonthData = monthData.filter((item) => {
        const dateParts = item.rawDate.split("-");
        const itemDate = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        );

        // Date filtering
        if (startDate) {
          const startOfDay = new Date(startDate);
          startOfDay.setHours(0, 0, 0, 0);
          if (itemDate < startOfDay) return false;
        }

        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (itemDate > endOfDay) return false;
        }

        // Category filtering
        if (filters.category && filters.category.length > 0) {
          if (!filters.category.includes(item.category)) return false;
        }

        // Product filtering
        if (filters.product && item.product !== filters.product) return false;

        // Type filtering
        if (filters.type !== "Semua" && item.type !== filters.type)
          return false;

        return true;
      });

      if (filteredMonthData.length > 0) {
        filtered[month] = filteredMonthData;
      }
    });

    setFilteredData(filtered);
  };

  const handleResetFilter = () => {
    setFilteredData(null);
  };

  const displayData = filteredData || incomeData;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-full">
      <h1 className="text-xl font-semibold mb-4 md:hidden">Pemasukan</h1>

      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Income List - takes remaining space */}
        <div className="flex-grow order-2 md:order-1">
          {Object.entries(displayData).length > 0 ? (
            Object.entries(displayData).map(([month, data]) => {
              // Extract month name and year from the key (e.g., "januari2025")
              const monthName = month.replace(/\d+/g, "");
              const year = month.match(/\d+/g)?.[0] || "";
              const displayMonth = `${
                monthName.charAt(0).toUpperCase() + monthName.slice(1)
              } ${year}`;

              return (
                <MonthIncomeCard
                  key={month}
                  month={displayMonth}
                  monthKey={month}
                  incomeList={data}
                  onUpdateIncome={handleUpdateIncome}
                  onDeleteIncome={handleDeleteIncome}
                />
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">
                {Object.keys(incomeData).length === 0
                  ? "Tidak ada data pemasukan"
                  : "Tidak ada data yang sesuai dengan filter"}
              </p>
            </div>
          )}

          <AddButton />
        </div>

        {/* Filter Panel - fixed width on desktop */}
        <div className="w-full md:w-64 lg:w-72 mb-6 md:mb-0 flex-shrink-0 order-1 md:order-2">
          <IncomeFilter
            onApplyFilter={handleApplyFilter}
            onResetFilter={handleResetFilter}
            categories={categories}
            products={products}
          />
        </div>
      </div>
    </div>
  );
};

export default Pemasukan;

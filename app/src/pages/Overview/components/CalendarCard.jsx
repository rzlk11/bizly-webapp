import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import axiosInstance from "../../../lib/axios";

const CalendarCard = ({
  activeMonth,
  activeYear,
  monthNames,
  prevMonth,
  nextMonth,
  transactions = [],
}) => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTransactions, setSelectedDateTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to check if a date has transactions
  const hasTransactions = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return transactions.some((t) => t.transaction_date === dateStr);
  };

  // Function to get transactions for a specific date
  const getTransactions = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return transactions
      .filter((t) => t.transaction_date === dateStr)
      .map((t) => ({
        id: t.id,
        type: t.type === "Pemasukan" ? "income" : "expense",
        amount: parseFloat(t.amount),
        category: t.category?.name || "Tidak ada kategori",
        description: t.description,
        transaction_name: t.transaction_name,
      }));
  };

  // Function to calculate total income, expenses and balance for a date
  const calculateDailySummary = (transactions) => {
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        income += parseFloat(transaction.amount);
      } else {
        expense += parseFloat(transaction.amount);
      }
    });

    const balance = income - expense;

    return { income, expense, balance };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate calendar days for the current month
  useEffect(() => {
    const generateCalendarDays = () => {
      const days = [];
      const firstDayOfMonth = new Date(activeYear, activeMonth, 1);
      const lastDayOfMonth = new Date(activeYear, activeMonth + 1, 0);

      // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
      let firstDayOfWeek = firstDayOfMonth.getDay();
      // Adjust for Monday as the first day of the week
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

      // Add empty slots for days before the first day of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({ dayNum: null });
      }

      // Add days of the month
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const hasTransactionsForDay = hasTransactions(
          activeYear,
          activeMonth,
          i
        );
        const transactions = getTransactions(activeYear, activeMonth, i);
        const { income, expense } = calculateDailySummary(transactions);

        days.push({
          dayNum: i,
          hasTransactions: hasTransactionsForDay,
          income,
          expense,
        });
      }

      setCalendarDays(days);
    };

    generateCalendarDays();
  }, [activeMonth, activeYear, transactions]);

  // Handle day click to show transaction details
  const handleDayClick = async (day) => {
    if (day?.dayNum) {
      setIsLoading(true);
      try {
        const dateStr = `${activeYear}-${String(activeMonth + 1).padStart(
          2,
          "0"
        )}-${String(day.dayNum).padStart(2, "0")}`;
        setSelectedDate(dateStr);

        // option 1: Use pre-loaded transactions
        // const dailyTransactions = getTransactions(activeYear, activeMonth, day.dayNum);
        // setSelectedDateTransactions(dailyTransactions);

        // option 2: Or fetch fresh data for the selected date
        const response = await axiosInstance.get(
          `/transactions/calendar/${dateStr}`
        );

        const normalized = (response.data.transactions || []).map((t) => ({
          ...t,
          category: t.category?.name || "Tidak ada kategori",
          type: t.type === "Pemasukan" ? "income" : "expense",
        }));

        console.log(normalized)

        setSelectedDateTransactions(normalized);        

        setShowModal(true);
      } catch (error) {
        console.error("Error fetching daily transactions:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="font-sans">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Header with month/year navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="text-gray-500 hover:text-blue-500 transition-colors p-1"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-blue-500 font-medium">
              {monthNames[activeMonth]}
            </div>
            <button
              onClick={nextMonth}
              className="text-gray-500 hover:text-blue-500 transition-colors p-1"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="text-gray-500 flex items-center">
            <span className="mr-1">{activeYear}</span>
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="text-xs text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {calendarDays.map((day, index) => {
            const hasActivity = day.hasTransactions;

            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`
                  relative text-sm cursor-pointer 
                  ${
                    day.dayNum
                      ? "hover:bg-gray-100 transition-colors rounded-full"
                      : ""
                  }
                  ${
                    day.dayNum === null
                      ? "text-gray-300 cursor-default"
                      : "text-gray-700"
                  }
                `}
              >
                <div className="w-8 h-8 mx-auto flex items-center justify-center">
                  {day.dayNum}
                </div>

                {/* Transaction indicators */}
                {hasActivity && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {day.income > 0 && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    )}
                    {day.expense > 0 && (
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto animate-fadeIn"
            style={{ animation: "fadeIn 0.2s ease-out" }}
          >
            {/* Modal Header */}
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg font-medium">
                {formatDate(selectedDate)}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Daily Summary */}
            <div className="p-4 border-b">
              <div className="space-y-2">
                {selectedDateTransactions?.length > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Pemasukan:
                      </span>
                      <span className="text-green-500 font-medium">
                        {formatCurrency(
                          calculateDailySummary(selectedDateTransactions).income
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Pengeluaran:
                      </span>
                      <span className="text-red-500 font-medium">
                        {formatCurrency(
                          calculateDailySummary(selectedDateTransactions)
                            .expense
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>Total:</span>
                      <span
                        className={
                          calculateDailySummary(selectedDateTransactions)
                            .balance >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {formatCurrency(
                          calculateDailySummary(selectedDateTransactions)
                            .balance
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-2">
                    Tidak ada transaksi
                  </p>
                )}
              </div>
            </div>

            {/* Transaction List */}
            <div className="divide-y">
              {isLoading ? (
                <div className="p-4 text-center">Memuat...</div>
              ) : (
                selectedDateTransactions?.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="text-gray-700 block">
                          {transaction.transaction_name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {transaction.category?.name ||
                            transaction.category ||
                            "Tidak ada kategori"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-medium ${
                            transaction.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type === "income"
                            ? formatCurrency(transaction.amount)
                            : `-${formatCurrency(transaction.amount)}`}
                        </span>
                      </div>
                    </div>
                    {transaction.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.description}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer with action buttons */}
            <div className="p-4 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarCard;

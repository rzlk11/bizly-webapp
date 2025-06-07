import React, { useEffect, useState } from "react";
import TotalExpenseCard from "./components/TotalExpenseCard";
import TotalIncomeCard from "./components/TotalIncomeCard";
import NetProfitCard from "./components/NetProfitCard";
import CashFlowCard from "./components/CashFlowCard";
import MonthlySummaryCard from "./components/MonthlySummaryCard";
import CategoryCard from "./components/CategoryCard";
import CalendarCard from "./components/CalendarCard";
import ExpenseTrackingCard from "./components/ExpenseTrackingCard";
import TopCard from "./components/TopCard";
import axiosInstance from "../../lib/axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import BusinessHealthStatusCard from "../../components/BusinessHealthStatusCard";
import IncomePredictionCard from "../../components/IncomePredictionCard";

const healthStatusMessages = {
  "Sehat": "Bisnis Anda dalam kondisi SEHAT. Terus pertahankan kinerja keuangan yang baik!",
  "Cukup Sehat": "Bisnis Anda CUKUP SEHAT. Ada beberapa hal yang bisa ditingkatkan.",
  "Perlu Penanganan Khusus": "Bisnis Anda PERLU PENANGANAN KHUSUS. Segera evaluasi keuangan Anda.",
  "Perlu Perhatian": "Bisnis Anda PERLU PERHATIAN. Perhatikan arus kas dan pengeluaran Anda.",
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentDate = new Date();
  const [activeMonth, setActiveMonth] = useState(currentDate.getMonth());
  const [activeYear, setActiveYear] = useState(currentDate.getFullYear());
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthConfidence, setHealthConfidence] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(null);
  const [predictedIncome, setPredictedIncome] = useState([]);
  const [predictLoading, setPredictLoading] = useState(true);
  const [predictError, setPredictError] = useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get("/transactions");
        setTransactions(response.data || []);
      } catch (err) {
        setError("Failed to fetch transactions");
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchHealthStatus = async () => {
      try {
        setHealthLoading(true);
        const res = await axiosInstance.get("/ml/analyze");
        setHealthStatus(res.data.health_status);
        setHealthConfidence(res.data.confidence);
      } catch (err) {
        setHealthError("Gagal mengambil status kesehatan bisnis.");
      } finally {
        setHealthLoading(false);
      }
    };

    const fetchPrediction = async () => {
      try {
        setPredictLoading(true);
        const res = await axiosInstance.get("/ml/predict");
        setPredictedIncome(res.data);
      } catch (err) {
        setPredictError("Gagal mengambil prediksi pemasukan.");
      } finally {
        setPredictLoading(false);
      }
    };

    fetchTransactions();
    fetchHealthStatus();
    fetchPrediction();
  }, []);

  // Process transaction data for charts
  const processChartData = () => {
    if (loading || error) return {};

    console.log(transactions);

    // Separate income and expenses
    const income = transactions.filter((t) => t.type === "Pemasukan");
    const expenses = transactions.filter((t) => t.type === "Pengeluaran");

    console.log("incomee", income);
    console.log("expense", expenses);

    // Group by month for monthly summary
    const monthlySummary = Array(12)
      .fill(0)
      .map((_, i) => {
        const monthIncome = income
          .filter((t) => new Date(t.transaction_date).getMonth() === i)
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const monthExpense = expenses
          .filter((t) => new Date(t.transaction_date).getMonth() === i)
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        return {
          name: monthNames[i].substring(0, 3),
          income: monthIncome,
          expense: monthExpense,
          profit: monthIncome - monthExpense,
        };
      });

    // Group by category for pie chart
    const categoryData = expenses.reduce((acc, t) => {
      const category = t["category.name"] || "Uncategorized";
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(t.amount);
      return acc;
    }, {});

    const pieData = Object.entries(categoryData).map(([name, value], i) => ({
      name,
      value,
      color: i % 2 === 0 ? "#0080FF" : "#B3DBFF", // Alternate colors
    }));

    console.log(pieData);

    // Calculate totals
    const totalIncome = income.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );
    const totalExpense = expenses.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );
    const netProfit = totalIncome - totalExpense;

    // Recent expenses for tracking card
    const recentExpenses = expenses
      .sort(
        (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
      )
      .slice(0, 3)
      .map((expense) => ({
        title: expense.transaction_name,
        icon: getCategoryIcon(expense.category?.name),
        amount: `Rp ${parseFloat(expense.amount).toLocaleString("id-ID")}`,
        date: formatDate(expense.transaction_date),
      }));

    const cashFlow = generateCashFlowData(transactions);

    console.log("cashFlow", cashFlow);

    return {
      monthlySummary,
      pieData,
      totalIncome,
      totalExpense,
      netProfit,
      recentExpenses,
      cashFlowData: cashFlow,
      expenseLineData: generateExpenseTrendData(expenses),
    };
  };

  // Helper functions
  const getCategoryIcon = (category) => {
    const icons = {
      Transportasi: "🚗",
      Makanan: "🍔",
      Belanja: "🛒",
      Pembayaran: "🏦",
      Pelatihan: "📚",
      Lainnya: "💸",
    };
    return icons[category] || "💰";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;
  };

  const generateCashFlowData = (transactions) => {
    // Group transactions by day for the current month
    const currentMonthTransactions = transactions.filter(
      (t) => new Date(t.transaction_date).getMonth() === activeMonth
    );

    const dailyData = currentMonthTransactions.reduce((acc, t) => {
      const day = new Date(t.transaction_date).getDate();
      if (!acc[day]) {
        acc[day] = { income: 0, expense: 0 };
      }
      if (t.type === "Pemasukan") {
        acc[day].income += parseFloat(t.amount);
      } else {
        acc[day].expense += parseFloat(t.amount);
      }
      return acc;
    }, {});

    console.log("daily data", dailyData);

    // Convert to array format for the chart
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      return {
        name: day.toString(),
        income: dailyData[day]?.income || 0,
        expense: dailyData[day]?.expense || 0,
      };
    });
  };

  const generateExpenseTrendData = (expenses) => {
    // Group expenses by day for the current month
    const currentMonthExpenses = expenses.filter(
      (e) => new Date(e.transaction_date).getMonth() === activeMonth
    );

    const dailyExpenses = currentMonthExpenses.reduce((acc, e) => {
      const day = new Date(e.transaction_date).getDate();
      acc[day] = (acc[day] || 0) + parseFloat(e.amount);
      return acc;
    }, {});
    
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      return {
        name: day.toString(),
        value: dailyExpenses[day] || 0,
      };
    });
  };  

  // Functions to change month/year
  const prevMonth = () => {
    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear(activeYear - 1);
    } else {
      setActiveMonth(activeMonth - 1);
    }
  };

  const nextMonth = () => {
    if (activeMonth === 11) {
      setActiveMonth(0);
      setActiveYear(activeYear + 1);
    } else {
      setActiveMonth(activeMonth + 1);
    }
  };  

  const {
    monthlySummary = [],
    pieData = [],
    totalIncome = 0,
    totalExpense = 0,
    netProfit = 0,
    recentExpenses = [],
    cashFlowData = [],
    expenseLineData = [],
  } = processChartData();

  console.log("cashFlowData", cashFlowData);

  // Prepare data for prediction chart
  const predictionChartData = predictedIncome.map((value, idx) => ({
    name: `Hari ${idx + 1}`,
    value: value,
  }));

  if (loading)
    return <div className="text-center py-8">Loading dashboard...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 p-6 min-h-screen font-['Poppins']">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <BusinessHealthStatusCard
          healthStatus={healthStatus}
          healthConfidence={healthConfidence}
          healthLoading={healthLoading}
          healthError={healthError}
        />
        <IncomePredictionCard
          predictedIncome={predictedIncome}
          predictLoading={predictLoading}
          predictError={predictError}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TotalExpenseCard
          total={totalExpense}
          monthlyData={monthlySummary.map((m) => ({
            name: m.name,
            value: m.expense,
          }))}
        />
        <TotalIncomeCard
          total={totalIncome}
          monthlyData={monthlySummary.map((m) => ({
            name: m.name,
            value: m.income,
          }))}
        />
        <NetProfitCard
          total={netProfit}
          lineData={monthlySummary.map((m) => ({
            name: m.name,
            value: m.profit,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <CashFlowCard lineData={cashFlowData} />
          <MonthlySummaryCard monthlyData={monthlySummary} />
        </div>

        {/* Middle Column */}
        <div className="md:col-span-1 space-y-6">
          <CategoryCard pieData={pieData} />
          <TopCard
            topExpenses={recentExpenses}
            topCategories={pieData.slice(0, 3).map((item) => ({
              name: item.name,
              value: item.value,
            }))}
          />
        </div>

        {/* Right Column */}
        <div className="md:col-span-1 space-y-6">
          <CalendarCard
            activeMonth={activeMonth}
            activeYear={activeYear}
            monthNames={monthNames}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            transactions={transactions.filter(
              (t) =>
                new Date(t.transaction_date).getMonth() === activeMonth &&
                new Date(t.transaction_date).getFullYear() === activeYear
            )}
          />
          <ExpenseTrackingCard
            expenseLineData={expenseLineData}
            expenses={recentExpenses}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

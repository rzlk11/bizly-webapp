import React from "react";

const TopCard = ({ topExpenses = [], topCategories = [] }) => {
  const totalExpense = topExpenses.reduce((sum, exp) => {
    const numericAmount =
      typeof exp.amount === "number"
        ? exp.amount
        : parseInt(exp.amount.toString().replace(/\D/g, ""));
    return sum + numericAmount;
  }, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">Top Pengeluaran</h3>
        <div className="flex items-center">
          <button className="text-blue-500 text-xs">Bulan Ini</button>
          <span className="ml-1">▼</span>
        </div>
      </div>

      {/* Top Expenses */}
      <div className="space-y-4">
        {topExpenses.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg">{item.icon}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500">{item.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-blue-500">
                -Rp{" "}
                {parseInt(
                  item.amount.toString().replace(/\D/g, "")
                ).toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Categories Section */}
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="text-sm text-gray-500">Kategori Terbesar</div>
        {topCategories.map((cat, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="text-gray-700">{cat.name}</div>
            <div className="font-medium text-gray-800">
              Rp {cat.value.toLocaleString("id-ID")}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-500">Total Pengeluaran</div>
          <div className="text-sm font-medium text-gray-800">
            Rp {totalExpense.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="flex items-center mt-1">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs text-blue-500">Data top bulan ini</span>
        </div>
      </div>
    </div>
  );
};

export default TopCard;

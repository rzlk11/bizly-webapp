import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlySummaryCard = ({ monthlyData }) => {
  // Calculate total income (you can also show profit or expense similarly)
  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-gray-500 text-sm font-medium mb-4">Ringkasan</h3>
      <div className="flex justify-center items-center mb-2">
        <div className="bg-blue-100 rounded-full px-3 py-1 text-xs text-blue-600">
          Rp {totalIncome.toLocaleString("id-ID")}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="income"
              fill="#00b894"
              radius={[4, 4, 0, 0]}
              name="Pemasukan"
            />
            <Bar
              dataKey="expense"
              fill="#d63031"
              radius={[4, 4, 0, 0]}
              name="Pengeluaran"
            />
            <Bar
              dataKey="profit"
              fill="#0984e3"
              radius={[4, 4, 0, 0]}
              name="Keuntungan"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySummaryCard;

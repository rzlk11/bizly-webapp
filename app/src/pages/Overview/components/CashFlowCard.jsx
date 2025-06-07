import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

const CashFlowCard = ({ lineData }) => {
  const totalIncome = lineData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = lineData.reduce((sum, d) => sum + d.expense, 0);
  const netCashFlow = totalIncome - totalExpense;

  const isPositive = netCashFlow >= 0;
  const statusText = isPositive ? "On track" : "Overspending";
  const statusColor = isPositive ? "green" : "red";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 text-sm font-medium">Track Arus Kas</h3>
        </div>
        <h2 className="text-2xl font-bold">
          Rp {netCashFlow.toLocaleString("id-ID")}
        </h2>
        <div className="flex items-center mt-1">
          <div
            className={`w-2 h-2 rounded-full bg-${statusColor}-500 mr-2`}
          ></div>
          <span className={`text-xs text-${statusColor}-500`}>
            {statusText}
          </span>
        </div>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis hide />
            <Tooltip
              formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
              labelFormatter={(label) => `Tanggal: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#34D399" // green
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#F87171" // red
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowCard;

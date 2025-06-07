import React from "react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

const TotalExpenseCard = ({ total, monthlyData }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-gray-500 text-sm font-medium">Total Pengeluaran</h3>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{`Rp. ${parseFloat(total).toLocaleString('id-ID')},-`}</h2>
          <div className="flex-shrink-0">
            <div className="h-16">
              <ResponsiveContainer width={80} height="100%">
                <BarChart data={monthlyData.slice(0, 4)}>
                  <Bar dataKey="value" fill="#0080FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalExpenseCard;

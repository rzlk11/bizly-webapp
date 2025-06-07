import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const NetProfitCard = ({ lineData, total }) => {
  return (
    <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-white text-sm font-medium opacity-90">
          Net Profit/Loss
        </h3>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{`Rp. ${parseFloat(total).toLocaleString('id-ID')},-`}</h2>
          <div className="flex-shrink-0">
            <div className="h-16">
              <ResponsiveContainer width={80} height="100%">
                <LineChart data={lineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetProfitCard;

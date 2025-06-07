import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const IncomePredictionCard = ({ predictedIncome, predictLoading, predictError }) => {
  const predictionChartData = (predictedIncome || []).map((value, idx) => ({
    name: `Hari ${idx + 1}`,
    value: value,
  }));

  return (
    <div className="p-4 rounded-lg shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Prediksi Pemasukan 7 Hari ke Depan</h2>
      {predictLoading ? (
        <div>Mengambil prediksi pemasukan...</div>
      ) : predictError ? (
        <div className="text-red-500">{predictError}</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={predictionChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={v => `Rp ${parseInt(v).toLocaleString("id-ID")}`} />
            <Line type="monotone" dataKey="value" stroke="#007AFF" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default IncomePredictionCard; 
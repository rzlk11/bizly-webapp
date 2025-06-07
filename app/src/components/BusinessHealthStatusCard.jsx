import React, { useEffect, useState } from "react";

const healthStatusMessages = {
  "Sehat": "Bisnis Anda dalam kondisi SEHAT. Terus pertahankan kinerja keuangan yang baik!",
  "Cukup Sehat": "Bisnis Anda CUKUP SEHAT. Ada beberapa hal yang bisa ditingkatkan.",
  "Perlu Penanganan Khusus": "Bisnis Anda PERLU PENANGANAN KHUSUS. Segera evaluasi keuangan Anda.",
  "Perlu Perhatian": "Bisnis Anda PERLU PERHATIAN. Perhatikan arus kas dan pengeluaran Anda.",
};

const BusinessHealthStatusCard = ({ healthStatus, healthConfidence, healthLoading, healthError }) => {
  if (healthLoading) return <div className="text-center py-4">Mengambil status kesehatan bisnis...</div>;
  if (healthError) return <div className="text-center py-4 text-red-500">{healthError}</div>;

  return (
    <div className="p-4 rounded-lg shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Status Kesehatan Bisnis</h2>
      <div className="text-2xl font-semibold mb-1">{healthStatus}</div>
      <div className="mb-2 text-gray-500">Tingkat keyakinan: {(healthConfidence * 100).toFixed(1)}%</div>
      <div className="text-gray-700">{healthStatusMessages[healthStatus] || "Status tidak diketahui."}</div>
    </div>
  );
};

export default BusinessHealthStatusCard; 
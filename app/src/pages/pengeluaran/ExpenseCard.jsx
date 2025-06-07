import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

const DropdownMenu = ({ onEdit, onDelete }) => {
  return (
    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-36 z-10 overflow-hidden">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
      >
        <Pencil size={16} />
        <span>Edit</span>
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-red-500 text-sm"
      >
        <Trash2 size={16} />
        <span>Hapus</span>
      </button>
    </div>
  );
};

const EditForm = ({ item, onSave, onCancel }) => {
  const [editData, setEditData] = useState({
    name: item.name,
    amount: item.amount.toString(),
    description: item.description,
    date: formatDateForInput(item.rawDate),
    category: item.category,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedItem = {
      ...item,
      name: editData.name,
      amount: parseFloat(editData.amount),
      description: editData.description,
      rawDate: editData.date,
      nominal: `Rp. ${parseFloat(editData.amount).toLocaleString("id-ID")},-`,
      date: formatDateForDisplay(editData.date),
      category: editData.category,
    };

    onSave(updatedItem);
  };

  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
  }

  return (
    <tr className="border-b border-gray-200 bg-blue-50">
      <td colSpan="5" className="px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominal
              </label>
              <input
                type="number"
                value={editData.amount}
                onChange={(e) =>
                  setEditData({ ...editData, amount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Transaksi
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <input
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></input>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
};

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <tr className="border-b border-gray-200 bg-red-50">
      <td colSpan="5" className="px-4 py-4">
        <div className="text-center">
          <p className="text-gray-800 mb-4">
            Apakah Anda yakin ingin menghapus data ini?
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

const ExpenseRow = ({ item, onSave, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setShowDropdown(false);
  };

  const handleSave = (updatedItem) => {
    onSave(updatedItem);
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    onDelete(item);
    setIsDeleting(false);
  };

  if (isEditing) {
    return (
      <EditForm
        item={item}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  if (isDeleting) {
    return (
      <DeleteConfirmation
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleting(false)}
      />
    );
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-4 text-sm text-gray-700">{item.date}</td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900">
        {item.nominal}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">{item.name}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{item.category}</td>
      <td className="px-4 py-4 text-right relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </button>

        {showDropdown && (
          <DropdownMenu onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </td>
    </tr>
  );
};

const MonthExpenseCard = ({
  month,
  monthKey,
  expenseList,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 font-['Poppins'] mb-6 overflow-hidden">
      <h2 className="text-xl font-semibold p-5 text-gray-800">{month}</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Tanggal
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Nominal
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Nama Transaksi
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Kategori
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {expenseList.map((item, index) => (
              <ExpenseRow
                key={index}
                item={item}
                onSave={(updatedItem) =>
                  onUpdateExpense(monthKey, index, updatedItem)
                }
                onDelete={() => onDeleteExpense(monthKey, index)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthExpenseCard;

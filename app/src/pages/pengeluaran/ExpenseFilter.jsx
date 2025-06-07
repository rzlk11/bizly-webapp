import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';

const ExpenseFilter = ({ onApplyFilter, onResetFilter, categories }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyFilter = () => {
    onApplyFilter({
      startDate,
      endDate,
      category: selectedCategories,
      type: 'Semua'
    });
    
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategories([]);
    onResetFilter();
    
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden w-full mb-4">
        <button 
          className="flex items-center gap-2 text-gray-700 font-medium px-3 py-2 rounded-md border border-gray-200"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className={`${!isFilterOpen && 'hidden md:block'} bg-white p-4 rounded-lg shadow-sm font-['Poppins'] border border-gray-100`}>
        <h2 className="text-lg font-semibold mb-4">Filter</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="dd/mm/yyyy"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="dd/mm/yyyy"
            />
          </div>
          
          <div className="relative" ref={categoryDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <button
              type="button"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              {selectedCategories.length > 0 
                ? `${selectedCategories.length} kategori dipilih`
                : 'Pilih Kategori'}
            </button>
            
            {isCategoryDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <div 
                    key={cat} 
                    className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`category-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="h-5 w-5 text-blue-500 border-gray-300 rounded cursor-pointer focus:ring-0"
                      />
                    </div>
                    <label 
                      htmlFor={`category-${cat}`} 
                      className="ml-3 text-sm text-gray-700 cursor-pointer select-none flex-grow font-medium"
                    >
                      {cat}
                    </label>
                    {selectedCategories.includes(cat) && (
                      <span className="text-blue-500 text-xs font-semibold bg-blue-50 px-2 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center bg-gray-50">
                    No categories available
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-md transition duration-200 font-medium text-sm"
              onClick={handleApplyFilter}
            >
              Terapkan Filter
            </button>
            
            <button
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 px-4 rounded-md transition duration-200 font-medium text-sm"
              onClick={handleResetFilter}
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseFilter;
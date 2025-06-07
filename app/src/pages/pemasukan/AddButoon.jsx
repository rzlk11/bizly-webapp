import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AddButton = () => {
  const navigate = useNavigate()
  
  return (
    <div className="fixed bottom-6 right-6 font-['Poppins']">
      <button 
        onClick={() => navigate('/tambah-pemasukan')}
        className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-10"
        aria-label="Tambah pemasukan"
      >
        <Plus size={24} color="white" strokeWidth={3} />
      </button>
    </div>
  )
}

export default AddButton
import { useState } from "react"
import BattleTable from "../components/BattleTable"
import { v4 as uuidv4 } from "uuid"

type RPType = 'Oficial' | 'Semi-Oficial' | 'Livre'

type BattleSheet = {
  id: string
  name: string
  type: RPType
  location: string
  createdAt: string
}

type Props = {
  sheets: BattleSheet[]
  setSheets: React.Dispatch<React.SetStateAction<BattleSheet[]>>
}

export default function MainPage({ sheets, setSheets }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<RPType>("Oficial")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })

  function openModal() {
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setName("")
    setType("Oficial")
    setLocation("")
    setDate(new Date().toISOString().split("T")[0])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !location.trim()) {
      alert("Por favor, preencha Nome e Local.")
      return
    }
    const newSheet: BattleSheet = {
      id: uuidv4(),
      name: name.trim(),
      type,
      location: location.trim(),
      createdAt: new Date(date).toISOString(),
    }
    setSheets(prev => [...prev, newSheet])
    closeModal()
  }

  return (
    <div className="p-6 w-full h-screen overflow-auto flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Histórico de Batalhas</h1>

      <button
        onClick={openModal}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition mb-6 max-w-max"
      >
        Nova Missão
      </button>

      {sheets.length === 0 ? (
        <p className="text-gray-600">Nenhuma missão criada ainda.</p>
      ) : (
        <BattleTable sheets={sheets} />
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Nova Missão</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Adicionar
                </button>
              </div>
            </form>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Fechar modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}








import type React from "react"

type RPType = "Oficial" | "Semi-Oficial" | "Livre"

type CreateMissionModalProps = {
  modalOpen: boolean
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  type: RPType
  setType: React.Dispatch<React.SetStateAction<RPType>>
  location: string
  setLocation: React.Dispatch<React.SetStateAction<string>>
  date: string
  setDate: React.Dispatch<React.SetStateAction<string>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function CreateMissionModal({
  modalOpen,
  name,
  setName,
  type,
  setType,
  location,
  setLocation,
  date,
  setDate,
  onClose,
  onSubmit,
}: CreateMissionModalProps) {
  if (!modalOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Nova Missão</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {" "}
          {/* Removidas as classes flex-1 e overflow-y-auto */}
          <div>
            <label htmlFor="missionName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Missão
            </label>
            <input
              id="missionName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {/* Campo de Data (agora o segundo) */}
          <div>
            <label htmlFor="missionDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              id="missionDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              required
            />
          </div>
          {/* Campo de Tipo */}
          <div>
            <label htmlFor="missionType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              id="missionType"
              value={type}
              onChange={(e) => setType(e.target.value as RPType)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="Oficial">Oficial</option>
              <option value="Semi-Oficial">Semi-Oficial</option>
              <option value="Livre">Livre</option>
            </select>
          </div>
          {/* Campo de Local */}
          <div>
            <label htmlFor="missionLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Local
            </label>
            <input
              id="missionLocation"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Criar Missão
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Fechar modal"
        >
          ✕
        </button>
      </div>
    </div>
  )
}




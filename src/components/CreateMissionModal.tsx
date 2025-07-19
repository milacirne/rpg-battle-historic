import React from "react"

type RPType = "Oficial" | "Semi-Oficial" | "Livre"

type MissionData = {
  id?: string
  name: string
  type: RPType
  location: string
  createdAt: string
}

type CreateMissionModalProps = {
  isOpen: boolean
  initialData?: MissionData | null
  onClose: () => void
  onSubmit: (data: MissionData) => void
}

export function CreateMissionModal({ isOpen, initialData, onClose, onSubmit }: CreateMissionModalProps) {
  const [name, setName] = React.useState(initialData?.name || "")
  const [type, setType] = React.useState<RPType>(initialData?.type || "Oficial")
  const [location, setLocation] = React.useState(initialData?.location || "")
  const [date, setDate] = React.useState(() => {
    if (initialData?.createdAt) {
      return new Date(initialData.createdAt).toISOString().split("T")[0]
    }
    return ""
  })

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setType(initialData.type)
      setLocation(initialData.location)
      setDate(new Date(initialData.createdAt).toISOString().split("T")[0])
    } else {
      setName("")
      setType("Oficial")
      setLocation("")
      setDate("")
    }
  }, [initialData, isOpen])

  const isEditing = !!initialData

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !location.trim() || !date.trim()) {
      alert("Por favor, preencha Nome, Local e Data.")
      return
    }
    const missionToSave: MissionData = {
      name: name.trim(),
      type,
      location: location.trim(),
      createdAt: new Date(date).toISOString(),
    }
    if (isEditing && initialData?.id) {
      missionToSave.id = initialData.id
    }
    onSubmit(missionToSave)
  }

  if (!isOpen) return null

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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Editar Missão" : "Nova Missão"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label htmlFor="missionType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <div className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
              <select
                id="missionType"
                value={type}
                onChange={(e) => setType(e.target.value as RPType)}
                className="w-full bg-white rounded-md px-3 pr-4 py-2 border-transparent focus:outline-none cursor-pointer border-r-[14px] border-r-transparent"
              >
                <option value="Oficial">Oficial</option>
                <option value="Semi-Oficial">Semi-Oficial</option>
                <option value="Livre">Livre</option>
              </select>
            </div>
          </div>
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
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              {isEditing ? "Salvar Alterações" : "Criar Missão"}
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          aria-label="Fechar modal"
        >
          ✕
        </button>
      </div>
    </div>
  )
}








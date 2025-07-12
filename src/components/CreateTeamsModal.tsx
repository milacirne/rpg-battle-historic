import React from "react"

type Props = {
  team1Name: string
  team2Name: string
  setTeam1Name: React.Dispatch<React.SetStateAction<string>>
  setTeam2Name: React.Dispatch<React.SetStateAction<string>>
  onClose: () => void
  onCreate: () => void
}

export default function CreateTeamsModal({
  team1Name,
  team2Name,
  setTeam1Name,
  setTeam2Name,
  onClose,
  onCreate,
}: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!team1Name.trim() || !team2Name.trim()) {
      alert("Preencha os nomes das equipes")
      return
    }
    onCreate()
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">Defina os nomes das equipes</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-blue-700" htmlFor="team1Name">
              Nome da Equipe 1
            </label>
            <input
              id="team1Name"
              type="text"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              className="w-full border border-blue-400 rounded px-3 py-2"
              required
              placeholder="Nome da equipe 1"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-red-700" htmlFor="team2Name">
              Nome da Equipe 2
            </label>
            <input
              id="team2Name"
              type="text"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              className="w-full border border-red-400 rounded px-3 py-2"
              required
              placeholder="Nome da equipe 2"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
            >
              Criar
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

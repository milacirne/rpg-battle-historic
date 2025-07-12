import { useNavigate, useParams } from "react-router-dom"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useState } from "react"

type RPType = "Oficial" | "Semi-Oficial" | "Livre"

type BattleSheet = {
  id: string
  name: string
  type: RPType
  location: string
  createdAt: string
}

type Props = {
  sheets: BattleSheet[]
}

export default function RoundsPage({ sheets }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const mission = sheets.find((sheet) => sheet.id === id)

  // Exemplo de rodadas fictícias
  const rounds = [
    { id: "5", name: "Rodada 5" },
    { id: "4", name: "Rodada 4" },
    { id: "3", name: "Rodada 3" },
  ]

  const [currentIndex, setCurrentIndex] = useState(0) // Começa com a mais recente

  const currentRound = rounds[currentIndex]

  if (!mission) {
    return <div>Missão não encontrada.</div>
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() =>
            currentIndex === rounds.length - 1
              ? navigate(`/missao/${id}`)
              : setCurrentIndex((prev) => Math.min(prev + 1, rounds.length - 1))
          }
          disabled={rounds.length === 0}
          className={`p-2 rounded-full ${
            rounds.length === 0 ? "text-gray-300" : "text-gray-700 hover:text-black"
          }`}
        >
          <FaChevronLeft size={24} />
        </button>

        <h2 className="text-xl font-bold">{currentRound?.name ?? "Sem rodadas"}</h2>

        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={rounds.length === 0 || currentIndex === 0}
          className={`p-2 rounded-full ${
            rounds.length === 0 || currentIndex === 0
              ? "text-gray-300"
              : "text-gray-700 hover:text-black"
          }`}
        >
          <FaChevronRight size={24} />
        </button>
      </div>

      {/* Conteúdo da rodada pode ir aqui */}
      <div className="bg-white p-6 rounded shadow">
        {currentRound ? (
          <p>Conteúdo da {currentRound.name}</p>
        ) : (
          <p className="text-gray-500">Nenhuma rodada cadastrada ainda.</p>
        )}
      </div>
    </div>
  )
}


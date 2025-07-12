import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"

type RPType = "Oficial" | "Semi-Oficial" | "Livre"

type MissionHeaderProps = {
  name: string
  location: string
  createdAt: string
  type: RPType
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${day}/${month}/${year}`
}

export default function MissionHeader({ name, location, createdAt, type }: MissionHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="w-full bg-white py-6 mb-8 shadow rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6">
        {/* Botão Voltar estilizado */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition cursor-pointer"
          aria-label="Voltar"
        >
          <FaArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <h1 className="text-4xl font-extrabold text-gray-900 flex-1">{name}</h1>

        <div className="flex flex-wrap sm:flex-nowrap gap-4 text-gray-600 text-sm font-medium">
          <div className="flex items-center gap-1">
            <span className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 uppercase tracking-wide">
              Local
            </span>
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 uppercase tracking-wide">
              Data
            </span>
            <span>{formatDate(createdAt)}</span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`rounded-full px-3 py-1 uppercase tracking-wide ${
                type === "Oficial"
                  ? "bg-blue-200 text-blue-900"
                  : type === "Semi-Oficial"
                  ? "bg-yellow-200 text-yellow-900"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {type}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}



import { useNavigate } from "react-router-dom"
import { FaHome } from "react-icons/fa"
import { PiMapPin, PiCalendarBlank } from "react-icons/pi"

type RPType = "Oficial" | "Semi-Oficial" | "Livre"

type MissionHeaderProps = {
  name: string
  location: string
  createdAt: string
  type: RPType
}

function formatDate(dateString: string) {
  const date = new Date(dateString)

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function MissionHeader({ name, location, createdAt, type }: MissionHeaderProps) {
  const navigate = useNavigate()

  const typeColors = {
    "Oficial": "bg-blue-100 text-blue-800",
    "Semi-Oficial": "bg-yellow-100 text-yellow-800",
    "Livre": "bg-gray-200 text-gray-700",
  }

  return (
    <header className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-5 sm:px-6 sm:py-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-medium text-white bg-purple-400 border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:bg-purple-500 hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <FaHome className="text-base" />

        </button>


        <span
          className={`px-4 py-1 rounded-full text-s font-medium ${typeColors[type]}`}
        >
          {type}
        </span>
      </div>

      <div className="space-y-2 sm:space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          {name}
        </h1>

        <div className="flex flex-wrap gap-4 text-gray-600 text-sm mt-2">
          <div className="flex items-center gap-1">
            <PiMapPin className="text-lg" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-1">
            <PiCalendarBlank className="text-lg" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </header>
  )
}






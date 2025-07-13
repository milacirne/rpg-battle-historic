import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { FaTrash } from "react-icons/fa"
import { FiChevronUp, FiChevronDown } from "react-icons/fi"

type BattleSheet = {
  id: string
  name: string
  type: "Oficial" | "Semi-Oficial" | "Livre"
  location: string
  createdAt: string
}

type SortColumn = "name" | "type" | "createdAt" | "location"
type SortDirection = "asc" | "desc"

type Props = {
  sheets: BattleSheet[]
  onDeleteMission: (id: string) => void
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" }
  return date.toLocaleDateString("pt-BR", options)
}

export default function BattleTable({ sheets, onDeleteMission }: Props) {
  const navigate = useNavigate()
  const [sortColumn, setSortColumn] = useState<SortColumn>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const sortedSheets = useMemo(() => {
    if (!sortColumn) return sheets

    const sorted = [...sheets].sort((a, b) => {
      let aVal: string | number = ""
      let bVal: string | number = ""

      switch (sortColumn) {
        case "name":
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case "type": {
          const order = { Oficial: 1, "Semi-Oficial": 2, Livre: 3 }
          aVal = order[a.type]
          bVal = order[b.type]
          break
        }
        case "createdAt":
          aVal = new Date(a.createdAt).getTime()
          bVal = new Date(b.createdAt).getTime()
          break
        case "location":
          aVal = a.location.toLowerCase()
          bVal = b.location.toLowerCase()
          break
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [sheets, sortColumn, sortDirection])

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  function renderSortIcon(column: SortColumn) {
    const isActive = sortColumn === column

    if (!isActive) {
      return <FiChevronUp className="text-gray-300 w-4 h-4" />
    }

    return sortDirection === "asc" ? (
      <FiChevronUp className="text-gray-700 w-4 h-4" />
    ) : (
      <FiChevronDown className="text-gray-700 w-4 h-4" />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 border-b-2 border-gray-200">
          <tr>
            {["name", "type", "createdAt", "location"].map((col) => {
              const labelMap: Record<string, string> = {
                name: "Nome da RP",
                type: "Tipo",
                createdAt: "Data",
                location: "Local",
              }
              const colKey = col as SortColumn
              return (
                <th
                  key={col}
                  onClick={() => handleSort(colKey)}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                >
                  <span className="inline-flex items-center gap-2">
                    {labelMap[col]}
                    {renderSortIcon(colKey)}
                  </span>
                </th>
              )
            })}
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"/>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sheets.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-5 text-center text-gray-500 italic">
                Nenhuma missão encontrada. Clique em "Nova Missão" para começar!
              </td>
            </tr>
          ) : (
            sortedSheets.map((sheet) => (
              <tr key={sheet.id} className="hover:bg-gray-100 transition-colors duration-150">
                <td
                  onClick={() => navigate(`/missao/${sheet.id}`)}
                  className="px-6 py-5 font-medium text-gray-800 truncate cursor-pointer"
                >
                  {sheet.name}
                </td>
                <td onClick={() => navigate(`/missao/${sheet.id}`)} className="px-6 py-5 cursor-pointer">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                      sheet.type === "Oficial"
                        ? "bg-blue-100 text-blue-700"
                        : sheet.type === "Semi-Oficial"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {sheet.type}
                  </span>
                </td>
                <td
                  onClick={() => navigate(`/missao/${sheet.id}`)}
                  className="px-6 py-5 whitespace-nowrap text-gray-600 cursor-pointer"
                >
                  {formatDate(sheet.createdAt)}
                </td>
                <td
                  onClick={() => navigate(`/missao/${sheet.id}`)}
                  className="px-6 py-5 truncate text-gray-600 cursor-pointer"
                >
                  {sheet.location}
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation() // Impede a navegação da linha
                      onDeleteMission(sheet.id)
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors duration-200 cursor-pointer"
                    title="Deletar Missão"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}






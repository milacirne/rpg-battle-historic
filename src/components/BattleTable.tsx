import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { FaTrash, FaEdit } from "react-icons/fa"
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
  onEditMission: (mission: BattleSheet) => void
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const month = date.toLocaleDateString("pt-BR", { month: "long" })
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month.charAt(0).toUpperCase() + month.slice(1)}, ${day}, ${year}`
}

export default function BattleTable({ sheets, onDeleteMission, onEditMission }: Props) {
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
      return <FiChevronUp className="text-gray-400 w-4 h-4" />
    }

    return sortDirection === "asc" ? (
      <FiChevronUp className="text-gray-900 w-4 h-4" />
    ) : (
      <FiChevronDown className="text-gray-900 w-4 h-4" />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
      <table className="min-w-full">
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
              const isActive = sortColumn === colKey
              return (
                <th
                  key={col}
                  onClick={() => handleSort(colKey)}
                  className={`
                    px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer
                    transition-colors duration-200 focus:outline-none focus:ring-0 focus:shadow-none
                    ${isActive ? "bg-gray-200 text-gray-900" : "text-gray-700 hover:bg-gray-200"}
                  `}
                  style={{ outline: "none", boxShadow: "none" }}
                >
                  <span className="inline-flex items-center gap-2">
                    {labelMap[col]}
                    {renderSortIcon(colKey)}
                  </span>
                </th>
              )
            })}
            <th
              className="px-4 py-4 sm:px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              colSpan={2}
            />
          </tr>
        </thead>
        <tbody>
          {sheets.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-5 text-center text-gray-500 italic">
                Nenhuma missão encontrada. Clique em "Nova Missão" para começar!
              </td>
            </tr>
          ) : (
            sortedSheets.map((sheet) => (
              <tr key={sheet.id} className="hover:bg-gray-100 transition-colors duration-150">
                <td
                  onClick={() => navigate(`/missao/${sheet.id}`)}
                  className="px-4 py-5 sm:px-6 font-medium text-gray-800 truncate cursor-pointer"
                >
                  {sheet.name}
                </td>
                <td onClick={() => navigate(`/missao/${sheet.id}`)} className="px-4 py-5 sm:px-6 cursor-pointer">
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
                  className="px-4 py-5 sm:px-6 whitespace-nowrap text-gray-600 cursor-pointer"
                >
                  {formatDate(sheet.createdAt)}
                </td>
                <td
                  onClick={() => navigate(`/missao/${sheet.id}`)}
                  className="px-4 py-5 sm:px-6 truncate text-gray-600 cursor-pointer"
                >
                  {sheet.location}
                </td>
                <td className="px-4 py-5 sm:px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditMission(sheet)
                      }}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
                      title="Editar Missão"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteMission(sheet.id)
                      }}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors duration-200 cursor-pointer"
                      title="Deletar Missão"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}








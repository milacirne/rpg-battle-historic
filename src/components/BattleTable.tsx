import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"

type BattleSheet = {
  id: string
  name: string
  type: 'Oficial' | 'Semi-Oficial' | 'Livre'
  location: string
  createdAt: string
}

type SortColumn = 'name' | 'type' | 'createdAt' | 'location'
type SortDirection = 'asc' | 'desc'

type Props = {
  sheets: BattleSheet[]
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}, ${month}, ${day}`
}

export default function BattleTable({ sheets }: Props) {
  const navigate = useNavigate()
  const [sortColumn, setSortColumn] = useState<SortColumn>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const sortedSheets = useMemo(() => {
    if (!sortColumn) return sheets

    const sorted = [...sheets].sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (sortColumn) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'type': {
          const order = { 'Oficial': 1, 'Semi-Oficial': 2, 'Livre': 3 }
          aVal = order[a.type]
          bVal = order[b.type]
          break
        }
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime()
          bVal = new Date(b.createdAt).getTime()
          break
        case 'location':
          aVal = a.location.toLowerCase()
          bVal = b.location.toLowerCase()
          break
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [sheets, sortColumn, sortDirection])

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  function renderSortIcon(column: SortColumn) {
    const isActive = sortColumn === column
    if (isActive) {
      return sortDirection === 'asc' ? (
        <span className="text-gray-700">▲</span>
      ) : (
        <span className="text-gray-700">▼</span>
      )
    }
    return <span className="text-gray-300">▲</span>
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50 select-none">
          <tr>
            {['name', 'type', 'createdAt', 'location'].map((col) => {
              const labelMap: Record<string, string> = {
                name: 'Nome da RP',
                type: 'Tipo',
                createdAt: 'Data',
                location: 'Local',
              }
              const colKey = col as SortColumn
              return (
                <th
                  key={col}
                  onClick={() => handleSort(colKey)}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {labelMap[col]}
                    {renderSortIcon(colKey)}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
          {sortedSheets.map((sheet) => (
            <tr
              key={sheet.id}
              onClick={() => navigate(`/missao/${sheet.id}`)}
              className="hover:bg-gray-100 transition cursor-pointer"
            >
              <td className="px-6 py-4 font-medium truncate">{sheet.name}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                    sheet.type === 'Oficial'
                      ? 'bg-blue-100 text-blue-700'
                      : sheet.type === 'Semi-Oficial'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {sheet.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(sheet.createdAt)}
              </td>
              <td className="px-6 py-4 truncate">{sheet.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}



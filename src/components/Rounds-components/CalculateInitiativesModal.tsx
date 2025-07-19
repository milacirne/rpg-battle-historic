import { useState, useMemo } from "react"
import type { Member } from "../../constants/rpg.data"

type InitiativeResult = {
  memberId: string
  name: string
  teamName: string
  baseInitiative: number
  diceRoll: number
  totalInitiative: number
}

type CalculateInitiativesModalProps = {
  isOpen: boolean
  onClose: () => void
  onCalculate: (results: InitiativeResult[]) => void
  team1Name: string
  team1Members: Member[]
  team2Name: string
  team2Members: Member[]
}

export function CalculateInitiativesModal({
  isOpen,
  onClose,
  onCalculate,
  team1Name,
  team1Members,
  team2Name,
  team2Members,
}: CalculateInitiativesModalProps) {
  const [diceRolls, setDiceRolls] = useState<Record<string, number>>({})

  useMemo(() => {
    const initialRolls: Record<string, number> = {}
    ;[...team1Members, ...team2Members].forEach((member) => {
      initialRolls[member.id] = 1
    })
    setDiceRolls(initialRolls)
  }, [team1Members, team2Members])

  if (!isOpen) return null

  const allMembers = [
    ...team1Members.map((m) => ({ ...m, teamName: team1Name, teamColor: "blue" })),
    ...team2Members.map((m) => ({ ...m, teamName: team2Name, teamColor: "red" })),
  ]

  const handleDiceRollChange = (memberId: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setDiceRolls((prev) => ({ ...prev, [memberId]: numValue }))
    } else if (value === "") {
      setDiceRolls((prev) => ({ ...prev, [memberId]: 0 }))
    }
  }

  const calculateAndSortInitiatives = () => {
    const results: InitiativeResult[] = allMembers.map((member) => {
      const baseInitiative = member.agility + member.perception
      const roll = diceRolls[member.id] || 0
      const totalInitiative = baseInitiative + roll
      return {
        memberId: member.id,
        name: member.name,
        teamName: member.teamName,
        baseInitiative,
        diceRoll: roll,
        totalInitiative,
      }
    })

    results.sort((a, b) => {
      if (b.totalInitiative !== a.totalInitiative) {
        return b.totalInitiative - a.totalInitiative
      }
      if (b.baseInitiative !== a.baseInitiative) {
        return b.baseInitiative - a.baseInitiative
      }
      return a.name.localeCompare(b.name)
    })

    onCalculate(results)
    onClose()
  }

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
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Calcular Iniciativas</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {allMembers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum personagem adicionado às equipes.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {allMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex-1 text-center sm:text-left mb-3 sm:mb-0">
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{member.name}</h3>
                    <p
                      className={`text-sm font-medium mt-1`}
                      style={{ color: member.teamColor === "blue" ? "#2563EB" : "#DC2626" }}
                    >
                      Equipe: {member.teamName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Iniciativa Base: {member.agility + member.perception}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label htmlFor={`dice-roll-${member.id}`} className="sr-only">
                      Dado para {member.name}
                    </label>
                    <input
                      id={`dice-roll-${member.id}`}
                      type="number"
                      min="1"
                      max="20"
                      value={diceRolls[member.id] === 0 ? "" : diceRolls[member.id]}
                      onChange={(e) => handleDiceRollChange(member.id, e.target.value)}
                      placeholder="D20"
                      className="w-20 sm:w-24 border border-gray-300 rounded-md px-3 py-2 text-center text-lg sm:text-xl font-bold focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    <span className="text-xl sm:text-2xl font-extrabold text-purple-700">
                      = {member.agility + member.perception + (diceRolls[member.id] || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium cursor-pointer w-full sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={calculateAndSortInitiatives}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer w-full sm:w-auto"
            disabled={allMembers.length === 0}
          >
            Calcular Ordem
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar modal"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}



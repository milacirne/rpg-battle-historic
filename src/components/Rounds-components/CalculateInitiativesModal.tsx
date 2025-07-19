import { useState, useMemo, useEffect } from "react"
import type { Member, InitiativeResult } from "../../constants/rpg.data"

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
  const [perkStates, setPerkStates] = useState<Record<string, { courage: boolean; cowardice: boolean }>>({})

  const allMembers = useMemo(() => {
    return [
      ...team1Members.map((m) => ({ ...m, teamName: team1Name, teamColor: "blue" })),
      ...team2Members.map((m) => ({ ...m, teamName: team2Name, teamColor: "red" })),
    ]
  }, [team1Members, team2Members, team1Name, team2Name])

  const initialValues = useMemo(() => {
    const initialRolls: Record<string, number> = {}
    const initialPerkStates: Record<string, { courage: boolean; cowardice: boolean }> = {}
    allMembers.forEach((member) => {
      initialRolls[member.id] = 1
      initialPerkStates[member.id] = {
        courage: false,
        cowardice: false,
      }
    })
    return { initialRolls, initialPerkStates }
  }, [allMembers])

  useEffect(() => {
    if (isOpen) {
      setDiceRolls(initialValues.initialRolls)
      setPerkStates(initialValues.initialPerkStates)
    }
  }, [isOpen, initialValues])

  if (!isOpen) return null

  const handleDiceRollChange = (memberId: string, value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setDiceRolls((prev) => ({ ...prev, [memberId]: numValue }))
    } else if (value === "") {
      setDiceRolls((prev) => ({ ...prev, [memberId]: 0 }))
    }
  }

  const handlePerkToggle = (memberId: string, perkType: "courage" | "cowardice") => {
    setPerkStates((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [perkType]: !prev[memberId]?.[perkType],
      },
    }))
  }

  const calculateAndSortInitiatives = () => {
    const results: InitiativeResult[] = allMembers.map((member) => {
      const baseInitiative = member.agility + member.perception
      const roll = diceRolls[member.id] || 0

      let perkMod = 0
      if (perkStates[member.id]?.courage) {
        perkMod += 10
      }
      if (perkStates[member.id]?.cowardice) {
        perkMod -= 10
      }

      const totalInitiative = baseInitiative + roll + perkMod
      return {
        memberId: member.id,
        name: member.name,
        teamName: member.teamName,
        baseInitiative,
        diceRoll: roll,
        perkModifierApplied: perkMod,
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
              {allMembers.map((member) => {
                const hasCourage = (member.perks || []).includes("Coragem")
                const hasCowardice = (member.hindrances || []).includes("Covardia")

                return (
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
                      {hasCourage && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`courage-${member.id}`}
                            checked={perkStates[member.id]?.courage || false}
                            onChange={() => handlePerkToggle(member.id, "courage")}
                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                            style={{ accentColor: "#22C55E" }}
                          />
                          <label htmlFor={`courage-${member.id}`} className="ml-2 text-sm text-gray-700">
                            Coragem (+10)
                          </label>
                        </div>
                      )}
                      {hasCowardice && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`cowardice-${member.id}`}
                            checked={perkStates[member.id]?.cowardice || false}
                            onChange={() => handlePerkToggle(member.id, "cowardice")}
                            className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                            style={{ accentColor: "#EF4444" }}
                          />
                          <label htmlFor={`cowardice-${member.id}`} className="ml-2 text-sm text-gray-700">
                            Covardia (-10)
                          </label>
                        </div>
                      )}
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
                        ={" "}
                        {member.agility +
                          member.perception +
                          (diceRolls[member.id] || 0) +
                          (perkStates[member.id]?.courage ? 10 : 0) +
                          (perkStates[member.id]?.cowardice ? -10 : 0)}
                      </span>
                    </div>
                  </div>
                )
              })}
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






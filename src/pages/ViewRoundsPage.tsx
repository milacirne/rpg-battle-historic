import type React from "react"

import { useNavigate, useParams, useLocation } from "react-router-dom"
import { FaChevronLeft, FaChevronRight, FaHome } from "react-icons/fa"
import { useState, useEffect, useMemo } from "react"
import type { BattleSheet, Round, InitiativeResult } from "../constants/rpg.data"

type Props = {
  sheets: BattleSheet[]
  setSheets: React.Dispatch<React.SetStateAction<BattleSheet[]>>
}

export default function ViewRoundsPage({ sheets }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const mission = sheets.find((sheet) => sheet.id === id)

  const rounds: Round[] = useMemo(() => mission?.rounds || [], [mission?.rounds])

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)

  useEffect(() => {
    if (rounds.length > 0) {
      const initialRoundId = (location.state as { initialRoundId?: string })?.initialRoundId
      if (initialRoundId) {
        const index = rounds.findIndex((r: Round) => r.id === initialRoundId)
        if (index !== -1) {
          setCurrentRoundIndex(index)
        } else {
          setCurrentRoundIndex(rounds.length - 1)
        }
      } else {
        setCurrentRoundIndex(rounds.length - 1)
      }
    } else {
      setCurrentRoundIndex(0)
    }
  }, [rounds, location.state])

  const currentRound = rounds[currentRoundIndex]

  if (!mission) {
    return (
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Missão não encontrada</h2>
        <button onClick={() => navigate("/")} className="text-blue-600 underline text-sm cursor-pointer">
          Voltar para o histórico
        </button>
      </div>
    )
  }

  const handleGoToOlderRound = () => {
    setCurrentRoundIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleGoToNewerRound = () => {
    setCurrentRoundIndex((prev) => Math.min(prev + 1, rounds.length - 1))
  }

  const team1Name = mission.team1Name || "Equipe 1"

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 sm:p-4 mb-6 flex items-center justify-between">
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center cursor-pointer"
            title="Voltar para a Página Inicial"
          >
            <FaHome size={18} />
          </button>
          <button
            onClick={() => navigate(`/missao/${id}`)}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center cursor-pointer"
            title="Voltar para a Missão"
          >
            <FaChevronLeft size={18} />
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-2">
          {currentRound?.name || "Nenhuma Rodada"}
        </h2>

        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={handleGoToNewerRound}
            disabled={rounds.length === 0 || currentRoundIndex === rounds.length - 1}
            className={`p-2 rounded-full cursor-pointer ${
              rounds.length === 0 || currentRoundIndex === rounds.length - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 transition-colors"
            }`}
            title="Rodada Mais Recente"
          >
            <FaChevronLeft size={18} />
          </button>
          <button
            onClick={handleGoToOlderRound}
            disabled={rounds.length === 0 || currentRoundIndex === 0}
            className={`p-2 rounded-full cursor-pointer ${
              rounds.length === 0 || currentRoundIndex === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 transition-colors"
            }`}
            title="Rodada Mais Antiga"
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </div>

      {currentRound ? (
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg mt-6 border border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 text-center">Ordem de Iniciativa</h3>
          {currentRound.initiativeOrder.length > 0 ? (
            <ol className="space-y-2 sm:space-y-3">
              {currentRound.initiativeOrder.map((result: InitiativeResult, index: number) => (
                <li
                  key={result.memberId}
                  className={`flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 rounded-lg shadow-sm transition-all duration-200
                  ${
                    result.teamName === team1Name
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "bg-red-50 border-l-4 border-red-500"
                  }
                `}
                >
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-0">
                    <span className="text-lg sm:text-xl font-extrabold text-gray-700 w-6 sm:w-7 text-center">
                      {index + 1}.
                    </span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      {result.name} (
                      <span
                        className="font-bold"
                        style={{
                          color:
                            result.teamName === team1Name
                              ? "#2563EB"
                              : mission.team2Name === result.teamName
                                ? "#DC2626"
                                : "#6B7280",
                        }}
                      >
                        {result.teamName}
                      </span>
                      )
                    </span>
                  </div>
                  <div className="text-gray-700 text-xs sm:text-sm flex items-center gap-1">
                    Iniciativa:{" "}
                    <span className="font-medium text-gray-800">
                      {result.baseInitiative} <span className="text-gray-500">+</span> {result.diceRoll}
                    </span>{" "}
                    <span className="text-gray-500">=</span>{" "}
                    <span className="font-extrabold text-base sm:text-lg text-purple-700">
                      {result.totalInitiative}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhuma ordem de iniciativa registrada para esta rodada.</p>
          )}
        </div>
      ) : (
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg mt-6 border border-gray-200">
          <p className="text-gray-500 text-center py-4">Nenhuma rodada cadastrada ainda.</p>
        </div>
      )}
    </div>
  )
}





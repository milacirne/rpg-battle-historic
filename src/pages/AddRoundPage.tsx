import type React from "react"

import { useNavigate, useParams, useLocation } from "react-router-dom"
import { FaChevronLeft, FaDiceD20, FaHome, FaPlus } from "react-icons/fa"
import { useState } from "react"
import { CalculateInitiativesModal } from "../components/Rounds-components/CalculateInitiativesModal"
import type { Member, Round, InitiativeResult } from "../constants/rpg.data"
import { v4 as uuidv4 } from "uuid"

type RPType = "Oficial" | "Semi-Oficial" | "Livre"

type BattleSheet = {
  id: string
  name: string
  type: RPType
  location: string
  createdAt: string
  rounds?: Round[]
}

type Props = {
  sheets: BattleSheet[]
  setSheets: React.Dispatch<React.SetStateAction<BattleSheet[]>>
}

export default function AddRoundPage({ sheets, setSheets }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const mission = sheets.find((sheet) => sheet.id === id)

  const { team1Members, team2Members, team1Name, team2Name } = (location.state || {
    team1Members: [],
    team2Members: [],
    team1Name: "Equipe 1",
    team2Name: "Equipe 2",
  }) as {
    team1Members: Member[]
    team2Members: Member[]
    team1Name: string
    team2Name: string
  }

  const [isInitiativeModalOpen, setIsInitiativeModalOpen] = useState(false)
  const [initiativeOrder, setInitiativeOrder] = useState<InitiativeResult[]>([])

  if (!mission) {
    return (
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Missão não encontrada</h2>
        <button onClick={() => navigate("/")} className="text-blue-600 underline text-sm">
          Voltar para o histórico
        </button>
      </div>
    )
  }

  function handleInitiativeCalculated(results: InitiativeResult[]) {
    setInitiativeOrder(results)
  }

  function handleAddRound() {
    if (!mission) return

    const nextRoundNumber = (mission.rounds?.length || 0) + 1
    const newRound: Round = {
      id: uuidv4(),
      name: `Rodada ${nextRoundNumber}`,
      initiativeOrder: initiativeOrder,
      createdAt: new Date().toISOString(),
    }

    setSheets((prevSheets) =>
      prevSheets.map((s) =>
        s.id === mission.id
          ? {
              ...s,
              rounds: [...(s.rounds || []), newRound],
            }
          : s,
      ),
    )

    navigate(`/missao/${id}/rodadas`, { state: { initialRoundId: newRound.id } })
  }

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
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-2">Adicionar Rodada</h2>
        <div className="w-10" />
      </div>

      {/* Botão Calcular Iniciativas alinhado à direita */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsInitiativeModalOpen(true)}
          className="bg-purple-600 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-purple-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
          disabled={team1Members.length === 0 && team2Members.length === 0}
          title={
            team1Members.length === 0 && team2Members.length === 0
              ? "Adicione personagens às equipes para calcular iniciativas"
              : "Calcular Iniciativas"
          }
        >
          <FaDiceD20 className="text-lg sm:text-xl" />
          Calcular Iniciativas
        </button>
      </div>

      {initiativeOrder.length > 0 && (
        <>
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg mt-6 border border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 text-center">Ordem de Iniciativa</h3>
            <ol className="space-y-2 sm:space-y-3">
              {initiativeOrder.map((result, index) => (
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
                        style={{ color: result.teamName === team1Name ? "#2563EB" : "#DC2626" }}
                      >
                        {result.teamName}
                      </span>
                      )
                    </span>
                  </div>
                  <div className="text-gray-700 text-xs sm:text-sm flex items-center gap-1">
                    Iniciativa:{" "}
                    <span className="font-medium text-gray-800">
                      {result.baseInitiative} <span className="text-gray-500">(base)</span>{" "}
                      <span className="text-gray-500">+</span> {result.diceRoll}{" "}
                      <span className="text-gray-500">(dado)</span>
                      {result.perkModifierApplied !== 0 && (
                        <span className={`ml-1 ${result.perkModifierApplied > 0 ? "text-green-600" : "text-red-600"}`}>
                          {result.perkModifierApplied > 0 ? "+" : ""}
                          {result.perkModifierApplied}{" "}
                          <span className="text-gray-500">
                            ({result.perkModifierApplied > 0 ? "coragem" : "covardia"})
                          </span>
                        </span>
                      )}
                    </span>{" "}
                    <span className="text-gray-500">=</span>{" "}
                    <span className="font-extrabold text-base sm:text-lg text-purple-700">
                      {result.totalInitiative}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Botão Adicionar Rodada aparece apenas se initiatives forem calculadas */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAddRound}
              className="bg-green-600 text-white px-6 py-3 sm:px-7 sm:py-3.5 rounded-lg text-lg sm:text-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
            >
              <FaPlus className="text-lg sm:text-xl" />
              Adicionar Rodada
            </button>
          </div>
        </>
      )}

      <CalculateInitiativesModal
        isOpen={isInitiativeModalOpen}
        onClose={() => setIsInitiativeModalOpen(false)}
        onCalculate={handleInitiativeCalculated}
        team1Name={team1Name}
        team1Members={team1Members}
        team2Name={team2Name}
        team2Members={team2Members}
      />
    </div>
  )
}
















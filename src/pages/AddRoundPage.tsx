import type React from "react"

import { useNavigate, useParams, useLocation } from "react-router-dom"
import { FaChevronLeft, FaDiceD20, FaHome, FaPlus, FaFlask, FaDice } from "react-icons/fa"
import { useState } from "react"
import { CalculateInitiativesModal } from "../components/Rounds-components/CalculateInitiativesModal"
import type { Member, Round, InitiativeResult, SkillTestGroup } from "../constants/rpg.data"
import { v4 as uuidv4 } from "uuid"
import { SkillTestModal } from "../components/Rounds-components/SkillTestModal"

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

type SkillTestResult = {
  id: string
  testName?: string
  characterName: string
  teamName: string
  skillType: string
  skillName: string
  attributeName: string
  skillValue: number
  attributeValue: number
  diceRoll: number
  totalResult: number
  timestamp: string
  isCombat: boolean
  difficultyLevel?: number
  isSuccess?: boolean
  globalDifficultyLevel?: number
  isGlobalSum?: boolean
  individualDifficultyLevel?: number
  customPhrase?: string
  customPhraseStatus?: "success" | "failure" | "neutral"
  isGambiarra?: boolean
  hasTerrainAdvantage?: boolean
  hasTerrainDisadvantage?: boolean
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
  const [isSkillTestModalOpen, setIsSkillTestModalOpen] = useState(false)
  const [skillTestGroups, setSkillTestGroups] = useState<{ [key: string]: SkillTestResult[] }>({})
  const [editingTestId, setEditingTestId] = useState<string | null>(null)

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

  function handleSkillTestResult(results: SkillTestResult[]) {
    if (results.length === 0) return

    if (editingTestId) {
      setSkillTestGroups((prev) => ({
        ...prev,
        [editingTestId]: results,
      }))
      setEditingTestId(null)
    } else {
      const groupId = `test-${Date.now()}-${Math.random()}`
      setSkillTestGroups((prev) => ({
        ...prev,
        [groupId]: results,
      }))
    }
  }

  function handleRemoveTestGroup(groupId: string) {
    const testsToRemove = skillTestGroups[groupId] || []
    const gambiarraUsersToReset: string[] = []

    testsToRemove.forEach((test) => {
      if (test.isGambiarra) {
        const member = [...team1Members, ...team2Members].find((m) => m.name === test.characterName)
        if (member) {
          gambiarraUsersToReset.push(member.id)
        }
      }
    })

    setSkillTestGroups((prev) => {
      const newGroups = { ...prev }
      delete newGroups[groupId]
      return newGroups
    })
  }

  function handleEditTestGroup(groupId: string) {
    setEditingTestId(groupId)
    setIsSkillTestModalOpen(true)
  }

  function getCorrectSpecializationName(member: Member, displayName: string): string {
    if (!displayName.includes("(") || !displayName.includes(")")) return displayName

    const baseSkill = displayName.split("(")[0].trim()
    const inputSpec = displayName.split("(")[1].replace(")", "").trim()

    const normalizedInput = inputSpec
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()

    const specializations = member.baseSkills?.specialization || {}
    const categoryKey = Object.keys({
      languages: "Idiomas",
      arts: "Artes",
      knowledge: "Conhecimento",
      driving: "Condução",
      crafts: "Ofícios",
      sports: "Esportes",
    }).find((key) => {
      const categories = {
        languages: "Idiomas",
        arts: "Artes",
        knowledge: "Conhecimento",
        driving: "Condução",
        crafts: "Ofícios",
        sports: "Esportes",
      }
      return categories[key as keyof typeof categories] === baseSkill
    })

    if (categoryKey && specializations[categoryKey as keyof typeof specializations]) {
      const categorySpecs = specializations[categoryKey as keyof typeof specializations] || {}
      const correctName = Object.keys(categorySpecs).find(
        (spec) =>
          spec
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim() === normalizedInput,
      )

      if (correctName) {
        return `${baseSkill} (${correctName})`
      }
    }

    return displayName
  }

  function handleAddRound() {
    if (!mission) return

    const nextRoundNumber = (mission.rounds?.length || 0) + 1

    const skillTestGroupsArray: SkillTestGroup[] = Object.entries(skillTestGroups).map(([groupId, results]) => ({
      id: groupId,
      testName: results[0]?.testName,
      results: results,
    }))

    const newRound: Round = {
      id: uuidv4(),
      name: `Rodada ${nextRoundNumber}`,
      initiativeOrder: initiativeOrder,
      skillTestGroups: skillTestGroupsArray,
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
        <div className="flex justify-center flex-1 mx-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Adicionar Rodada</h2>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex justify-end gap-3 mb-6">
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

        <button
          onClick={() => setIsSkillTestModalOpen(true)}
          className={`px-5 py-2 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer ${initiativeOrder.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
          disabled={initiativeOrder.length === 0}
          title={
            initiativeOrder.length === 0
              ? "Calcule as iniciativas primeiro para fazer testes de perícia"
              : "Fazer Teste de Perícia"
          }
        >
          <FaFlask className="text-lg sm:text-xl" />
          Teste de Perícia
        </button>
      </div>

      {initiativeOrder.length > 0 && (
        <>
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg mt-6 border border-gray-200">
            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Ordem de Iniciativa</h3>
            </div>
            <ol className="space-y-2 sm:space-y-3">
              {initiativeOrder.map((result, index) => (
                <li
                  key={result.memberId}
                  className={`flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 rounded-lg shadow-sm transition-all duration-200 ${result.teamName === team1Name ? "bg-blue-50 border-l-4 border-blue-500" : "bg-red-50 border-l-4 border-red-500"}`}
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
                      <span className="text-gray-500">+</span>
                      <span className="inline-flex items-center gap-1 mx-1">
                        <FaDice className="text-purple-600" size={12} />
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold text-xs ${
                            result.perkModifierApplied > 0
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {result.diceRoll}
                        </span>
                      </span>
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

          {Object.keys(skillTestGroups).length > 0 && (
            <div className="space-y-4 mt-6">
              {Object.entries(skillTestGroups).map(([groupId, results]) => {
                const firstResult = results[0]
                const testName = firstResult?.testName

                return (
                  <div key={groupId} className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{testName || "Teste de Perícia"}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTestGroup(groupId)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors cursor-pointer"
                          title="Editar teste"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRemoveTestGroup(groupId)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors cursor-pointer"
                          title="Remover teste"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {(firstResult?.globalDifficultyLevel || firstResult?.individualDifficultyLevel) && (
                      <div className="mb-3 text-sm text-gray-600">
                        {firstResult.globalDifficultyLevel && (
                          <span className="font-medium">
                            Nível de Dificuldade Global: {firstResult.globalDifficultyLevel}
                            {firstResult.isGlobalSum && " (Somatório)"}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="space-y-2 sm:space-y-3">
                      {results.map((result) => {
                        const member = [...team1Members, ...team2Members].find((m) => m.name === result.characterName)
                        const correctedSkillName = member
                          ? getCorrectSpecializationName(member, result.skillName)
                          : result.skillName

                        const hasAzar = member?.hindrances?.includes("Azar") || false
                        const hasSorte = member?.perks?.includes("Sorte") || false
                        const hasPerseguidoPorMonstros =
                          member?.hindrances?.includes("Perseguido por Monstros") || false
                        const isAzarTriggered = hasAzar && result.diceRoll === 1
                        const isSorteTriggered = hasSorte && result.diceRoll === 10
                        const isPerseguidoTriggered = hasPerseguidoPorMonstros && result.diceRoll === 1
                        const isGambiarraUsed = result.isGambiarra || false
                        const isCriticalSuccess = result.diceRoll === 10
                        const isCriticalFailure = result.diceRoll === 1
                        const hasTerrainAdvantage = result.hasTerrainAdvantage || false
                        const hasTerrainDisadvantage = result.hasTerrainDisadvantage || false

                        let containerClass = `flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 rounded-lg shadow-sm transition-all duration-200 ${result.teamName === team1Name ? "bg-blue-50 border-l-4 border-blue-500" : "bg-red-50 border-l-4 border-red-500"}`

                        if (isGambiarraUsed) {
                          containerClass = `flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 rounded-lg shadow-lg transition-all duration-300 bg-gradient-to-r from-green-50 to-lime-100 border border-green-300 relative overflow-hidden`
                        } else if (isSorteTriggered) {
                          containerClass = `flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 rounded-lg shadow-lg transition-all duration-300 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 relative overflow-hidden`
                        } else if (isAzarTriggered) {
                          containerClass = `flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 rounded-lg shadow-lg transition-all duration-300 bg-gradient-to-r from-slate-50 to-gray-100 border border-slate-300 relative overflow-hidden`
                        }

                        return (
                          <div key={result.id} className={containerClass}>
                            {isAzarTriggered && (
                              <div className="absolute inset-0 bg-gradient-to-r from-slate-200/20 to-gray-300/20 pointer-events-none" />
                            )}
                            {isSorteTriggered && (
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 to-yellow-200/30 pointer-events-none animate-pulse" />
                            )}
                            {isGambiarraUsed && (
                              <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-lime-200/30 pointer-events-none animate-pulse" />
                            )}

                            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-0 relative z-10">
                              <span
                                className={`font-semibold text-sm sm:text-base ${isAzarTriggered ? "text-slate-700" : isSorteTriggered ? "text-amber-800" : isGambiarraUsed ? "text-green-700" : "text-gray-900"}`}
                              >
                                {result.characterName} (
                                <span
                                  className="font-bold"
                                  style={{
                                    color: isAzarTriggered
                                      ? "#475569"
                                      : isSorteTriggered
                                        ? "#92400e"
                                        : isGambiarraUsed
                                          ? "#16a34a"
                                          : result.teamName === team1Name
                                            ? "#2563EB"
                                            : "#DC2626",
                                  }}
                                >
                                  {result.teamName}
                                </span>
                                )
                                {result.customPhrase && (
                                  <span
                                    className={`font-normal ml-1 italic ${result.customPhraseStatus === "success" ? "font-bold text-green-700" : result.customPhraseStatus === "failure" ? "font-bold text-red-700" : isAzarTriggered ? "text-slate-600" : isSorteTriggered ? "text-amber-700" : isGambiarraUsed ? "text-green-600" : "text-gray-600"}`}
                                  >
                                    {result.customPhrase}
                                  </span>
                                )}
                              </span>

                              {isGambiarraUsed && (
                                <span className="ml-2 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full shadow-sm border border-green-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                                  Gambiarra
                                </span>
                              )}
                              {isSorteTriggered && (
                                <span className="ml-2 px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded-full shadow-sm border border-amber-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></span>
                                  Sorte
                                </span>
                              )}
                              {isAzarTriggered && (
                                <span className="ml-2 px-3 py-1 bg-slate-600 text-white text-xs font-medium rounded-full shadow-sm border border-slate-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                                  Azar
                                </span>
                              )}
                              {isPerseguidoTriggered && (
                                <span className="ml-2 px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded-full shadow-sm border border-orange-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse"></span>
                                  Perseguido por Monstros
                                </span>
                              )}
                              {hasTerrainAdvantage && (
                                <span className="ml-2 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full shadow-sm border border-green-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                                  Terreno Favorável
                                </span>
                              )}
                              {hasTerrainDisadvantage && (
                                <span className="ml-2 px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded-full shadow-sm border border-orange-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse"></span>
                                  Terreno Desfavorável
                                </span>
                              )}
                              {isCriticalSuccess && (
                                <span className="ml-2 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full shadow-sm border border-green-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                                  Acerto Crítico
                                </span>
                              )}
                              {(isCriticalFailure ||
                                isPerseguidoTriggered ||
                                isAzarTriggered ||
                                hasTerrainDisadvantage) && (
                                <span className="ml-2 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full shadow-sm border border-red-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse"></span>
                                  Falha Crítica
                                </span>
                              )}
                            </div>
                            <div
                              className={`text-xs sm:text-sm flex items-center gap-1 relative z-10 ${isAzarTriggered ? "text-slate-600" : isSorteTriggered ? "text-amber-700" : isGambiarraUsed ? "text-green-600" : "text-gray-700"}`}
                            >
                              {isGambiarraUsed ? (
                                <span className="font-extrabold text-base sm:text-lg text-green-700">Sucesso</span>
                              ) : (
                                <>
                                  <span
                                    className={`font-medium ${isAzarTriggered ? "text-slate-700" : isSorteTriggered ? "text-amber-800" : isGambiarraUsed ? "text-green-700" : "text-gray-800"}`}
                                  >
                                    {correctedSkillName} + {result.attributeName}
                                  </span>
                                  <span
                                    className={
                                      isAzarTriggered
                                        ? "text-slate-500"
                                        : isSorteTriggered
                                          ? "text-amber-600"
                                          : isGambiarraUsed
                                            ? "text-green-600"
                                            : "text-gray-500"
                                    }
                                  >
                                    =
                                  </span>
                                  <span
                                    className={`font-medium ${isAzarTriggered ? "text-slate-700" : isSorteTriggered ? "text-amber-800" : isGambiarraUsed ? "text-green-700" : "text-gray-800"}`}
                                  >
                                    {result.skillValue} + {result.attributeValue} +
                                    <span className="inline-flex items-center gap-1 mx-1">
                                      <FaDice
                                        className={`${isAzarTriggered ? "text-slate-500" : isSorteTriggered ? "text-amber-600" : isGambiarraUsed ? "text-green-600" : "text-purple-600"}`}
                                        size={12}
                                      />
                                      <span
                                        className={`px-1.5 py-0.5 rounded font-bold text-xs ${
                                          isAzarTriggered
                                            ? "bg-slate-200 text-slate-800 border border-slate-300"
                                            : isSorteTriggered
                                              ? "bg-amber-200 text-amber-900 border border-amber-300"
                                              : isGambiarraUsed
                                                ? "bg-green-200 text-green-800 border border-green-300"
                                                : "bg-purple-100 text-purple-800"
                                        }`}
                                      >
                                        {result.diceRoll}
                                      </span>
                                    </span>
                                  </span>
                                  <span
                                    className={
                                      isAzarTriggered
                                        ? "text-slate-500"
                                        : isSorteTriggered
                                          ? "text-amber-600"
                                          : isGambiarraUsed
                                            ? "text-green-600"
                                            : "text-gray-500"
                                    }
                                  >
                                    =
                                  </span>
                                  <span
                                    className={`font-extrabold text-base sm:text-lg ${
                                      result.isSuccess === true
                                        ? "text-green-700"
                                        : result.isSuccess === false
                                          ? "text-red-700"
                                          : "text-green-700"
                                    }`}
                                  >
                                    {result.totalResult}
                                    {result.isSuccess !== undefined && (
                                      <span
                                        className={`ml-1 text-xs font-medium ${
                                          result.isSuccess ? "text-green-600" : "text-red-600"
                                        }`}
                                      >
                                        ({result.isSuccess ? "Sucesso" : "Falha"})
                                      </span>
                                    )}
                                    {result.individualDifficultyLevel && (
                                      <span
                                        className={`ml-1 text-xs ${result.isSuccess !== undefined ? (result.isSuccess ? "text-green-600" : "text-red-600") : "text-gray-500"}`}
                                      >
                                        (Dif: {result.individualDifficultyLevel})
                                      </span>
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

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

      <SkillTestModal
        isOpen={isSkillTestModalOpen}
        onClose={() => {
          setIsSkillTestModalOpen(false)
          setEditingTestId(null)
        }}
        onAddResult={handleSkillTestResult}
        initiativeOrder={initiativeOrder}
        team1Members={team1Members}
        team2Members={team2Members}
        team1Name={team1Name}
        team2Name={team2Name}
        editingTestId={editingTestId}
        existingTests={editingTestId ? skillTestGroups[editingTestId] : undefined}
      />
    </div>
  )
}




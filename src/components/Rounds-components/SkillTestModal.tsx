import { useState, useMemo, useEffect } from "react"
import type { Member, InitiativeResult } from "../../constants/rpg.data"
import {
  combatSkills,
  socialSkills,
  utilitySkills,
  complementarySkills,
  abilities,
  disabilities,
} from "../../constants/rpg.data"

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
}

type SkillTestModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddResult: (results: SkillTestResult[]) => void
  initiativeOrder: InitiativeResult[]
  team1Members: Member[]
  team2Members: Member[]
  team1Name: string
  team2Name: string
  editingTestId?: string | null
  existingTests?: SkillTestResult[]
}

const nonCombatSkills = [...socialSkills, ...utilitySkills, ...complementarySkills]

const specializationCategories = {
  languages: "Idiomas",
  arts: "Artes",
  knowledge: "Conhecimento",
  driving: "Condução",
  crafts: "Ofícios",
  sports: "Esportes",
} as const

const attributes = [
  { key: "force", name: "Força" },
  { key: "determination", name: "Determinação" },
  { key: "agility", name: "Agilidade" },
  { key: "wisdom", name: "Sabedoria" },
  { key: "perception", name: "Percepção" },
  { key: "dexterity", name: "Destreza" },
  { key: "vigor", name: "Vigor" },
  { key: "charisma", name: "Carisma" },
]

const normalizeSpecialization = (input: string): string => {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

export function SkillTestModal({
  isOpen,
  onClose,
  onAddResult,
  initiativeOrder,
  team1Members,
  team2Members,
  team1Name,
  team2Name,
  editingTestId,
  existingTests,
}: SkillTestModalProps) {
  const [testName, setTestName] = useState("")
  const [globalDifficultyLevel, setGlobalDifficultyLevel] = useState<number | "">("")
  const [isGlobalSum, setIsGlobalSum] = useState(false)
  const [customPhrases, setCustomPhrases] = useState<string[]>([])
  const [newPhrase, setNewPhrase] = useState("")
  const [showCustomPhrasesInput, setShowCustomPhrasesInput] = useState(false)
  const [gambiarraUsed, setGambiarraUsed] = useState<{ [characterId: string]: boolean }>({})

  const [selectedCharacters, setSelectedCharacters] = useState<{
    [key: string]: {
      selected: boolean
      isCombat: boolean
      skillName: string
      attribute: string
      diceRoll: number
      specializationType?: string
      specializationInput?: string
      individualDifficultyLevel?: number | ""
      customPhrase?: string
      customPhraseStatus?: "success" | "failure" | "neutral"
      isGambiarra?: boolean
    }
  }>({})

  const allMembers = useMemo(() => {
    return [
      ...team1Members.map((m) => ({ ...m, teamName: team1Name, teamColor: "blue" })),
      ...team2Members.map((m) => ({ ...m, teamName: team2Name, teamColor: "red" })),
    ]
  }, [team1Members, team2Members, team1Name, team2Name])

  useEffect(() => {
    if (editingTestId && existingTests && existingTests.length > 0) {
      const firstTest = existingTests[0]
      setTestName(firstTest.testName || "")
      setGlobalDifficultyLevel(firstTest.globalDifficultyLevel || "")
      setIsGlobalSum(firstTest.isGlobalSum || false)

      const existingCustomPhrases = existingTests
        .map((test) => test.customPhrase)
        .filter((phrase): phrase is string => !!phrase)
        .filter((phrase, index, arr) => arr.indexOf(phrase) === index)
      setCustomPhrases(existingCustomPhrases)

      const charactersData: typeof selectedCharacters = {}
      existingTests.forEach((test) => {
        const member = allMembers.find((m) => m.name === test.characterName)
        if (member) {
          const specializationMatch = test.skillName.match(/^(.+) $$(.+)$$$/)
          charactersData[member.id] = {
            selected: true,
            isCombat: test.isCombat,
            skillName: specializationMatch ? specializationMatch[1] : test.skillName,
            attribute: attributes.find((attr) => attr.name === test.attributeName)?.key || "",
            diceRoll: test.diceRoll,
            specializationInput: specializationMatch ? specializationMatch[2] : undefined,
            individualDifficultyLevel: test.individualDifficultyLevel || "",
            customPhrase: test.customPhrase || "",
            customPhraseStatus: test.customPhraseStatus || "neutral",
            isGambiarra: test.isGambiarra || false,
          }
        }
      })
      setSelectedCharacters(charactersData)
    }
  }, [editingTestId, existingTests, allMembers])

  const getAvailableSkillsForCharacter = (characterId: string) => {
    const characterData = selectedCharacters[characterId]
    if (!characterData) return []

    if (characterData.isCombat) {
      return combatSkills
    } else {
      return [...nonCombatSkills, ...Object.values(specializationCategories)]
    }
  }

  const isSpecializationCategory = (skillName: string): boolean => {
    return Object.values(specializationCategories).includes(
      skillName as "Esportes" | "Idiomas" | "Artes" | "Conhecimento" | "Condução" | "Ofícios",
    )
  }

  const getSkillValue = (member: Member, skillName: string, specializationInput?: string): number => {
    if (isSpecializationCategory(skillName) && specializationInput) {
      const normalizedInput = normalizeSpecialization(specializationInput)

      const derivedGlobalSkillEffects = member.derivedGlobalSkillEffects || []

      const specializations = member.baseSkills?.specialization || {}
      const categoryKey = Object.keys(specializationCategories).find(
        (key) => specializationCategories[key as keyof typeof specializationCategories] === skillName,
      )

      if (categoryKey) {
        const categorySpecializations = specializations[categoryKey as keyof typeof specializations] || {}

        const foundSpecialization = Object.keys(categorySpecializations).find(
          (spec) => normalizeSpecialization(spec) === normalizedInput,
        )

        let finalValue = 0

        if (foundSpecialization) {
          finalValue = (categorySpecializations as Record<string, number>)[foundSpecialization] || 0
        }

        const individualEffect = derivedGlobalSkillEffects.find(
          (effect) =>
            effect.type === "individual" &&
            effect.category === categoryKey &&
            normalizeSpecialization(effect.skillName || "") === normalizedInput,
        )
        if (individualEffect) {
          finalValue += individualEffect.value
        }

        const categoryEffect = derivedGlobalSkillEffects.find(
          (effect) => effect.type === "category" && effect.category === categoryKey,
        )
        if (categoryEffect) {
          finalValue += categoryEffect.value
        }

        if (finalValue > 0) {
          return finalValue
        } else {
          return -2
        }
      }

      return -2
    }

    if (combatSkills.includes(skillName)) {
      if (!memberHasSkill(member, skillName)) {
        return 0
      }
    } else {
      if (!memberHasSkill(member, skillName)) {
        return -2
      }
    }

    const derivedGlobalSkillEffects = member.derivedGlobalSkillEffects || []
    let baseValue = 0

    if (member.powers?.[skillName] !== undefined) {
      baseValue = member.powers[skillName]
    } else if (member.styles?.[skillName] !== undefined) {
      baseValue = member.styles[skillName]
    } else {
      const skillsMap = {
        combat: member.baseSkills?.combat || {},
        social: member.baseSkills?.social || {},
        utility: member.baseSkills?.utility || {},
        complementary: member.baseSkills?.complementary || {},
      }

      for (const [categoryName, category] of Object.entries(skillsMap)) {
        if (category[skillName] !== undefined) {
          baseValue = category[skillName]

          const individualEffect = derivedGlobalSkillEffects.find(
            (effect) =>
              effect.type === "individual" && effect.skillName === skillName && effect.category === categoryName,
          )
          if (individualEffect) {
            baseValue += individualEffect.value
          }

          const categoryEffect = derivedGlobalSkillEffects.find(
            (effect) => effect.type === "category" && effect.category === categoryName,
          )
          if (categoryEffect) {
            baseValue += categoryEffect.value
          }

          break
        }
      }
    }

    return baseValue
  }

  const memberHasSkill = (member: Member, skillName: string, specializationInput?: string): boolean => {
    if (isSpecializationCategory(skillName) && specializationInput) {
      const normalizedInput = normalizeSpecialization(specializationInput)
      const specializations = member.baseSkills?.specialization || {}
      const categoryKey = Object.keys(specializationCategories).find(
        (key) => specializationCategories[key as keyof typeof specializationCategories] === skillName,
      )

      if (categoryKey && specializations[categoryKey as keyof typeof specializations]) {
        const categorySpecializations = specializations[categoryKey as keyof typeof specializations] || {}
        return Object.keys(categorySpecializations).some((spec) => normalizeSpecialization(spec) === normalizedInput)
      }
      return false
    }

    if (member.powers?.[skillName] !== undefined) return true
    if (member.styles?.[skillName] !== undefined) return true

    const skillsMap = {
      combat: member.baseSkills?.combat || {},
      social: member.baseSkills?.social || {},
      utility: member.baseSkills?.utility || {},
      complementary: member.baseSkills?.complementary || {},
    }

    for (const category of Object.values(skillsMap)) {
      if (category[skillName] !== undefined) return true
    }

    return false
  }

  const getAttributeWithModifiers = (member: Member, attr: keyof Member): number => {
    let value = member[attr] as number
    abilities.forEach((apt) => {
      if ((member.abilities || []).includes(apt.name) && apt.attribute === attr) {
        value += apt.value
      }
    })
    disabilities.forEach((inap) => {
      if ((member.disabilities || []).includes(inap.name) && inap.attribute === attr) {
        value += inap.value
      }
    })
    return value
  }

  const handleAddCustomPhrase = () => {
    if (newPhrase.trim() && !customPhrases.includes(newPhrase.trim())) {
      setCustomPhrases((prev) => [...prev, newPhrase.trim()])
      setNewPhrase("")
    }
  }

  const handleRemoveCustomPhrase = (phraseToRemove: string) => {
    setCustomPhrases((prev) => prev.filter((phrase) => phrase !== phraseToRemove))
    setSelectedCharacters((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((characterId) => {
        if (updated[characterId].customPhrase === phraseToRemove) {
          updated[characterId].customPhrase = ""
          updated[characterId].customPhraseStatus = "neutral"
        }
      })
      return updated
    })
  }

  const handleCustomPhraseChange = (characterId: string, phrase: string) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        customPhrase: phrase,
        customPhraseStatus: "neutral",
      },
    }))
  }

  const handleCustomPhraseStatusChange = (characterId: string, status: "success" | "failure" | "neutral") => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        customPhraseStatus: status,
      },
    }))
  }

  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        selected: !prev[characterId]?.selected,
        isCombat: prev[characterId]?.isCombat || false,
        skillName: prev[characterId]?.skillName || "",
        attribute: prev[characterId]?.attribute || "",
        diceRoll: prev[characterId]?.diceRoll || 1,
        specializationType: prev[characterId]?.specializationType,
        specializationInput: prev[characterId]?.specializationInput,
        individualDifficultyLevel: prev[characterId]?.individualDifficultyLevel || "",
        customPhrase: prev[characterId]?.customPhrase || "",
        customPhraseStatus: prev[characterId]?.customPhraseStatus || "neutral",
        isGambiarra: false,
      },
    }))
  }

  const handleCombatToggle = (characterId: string) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        isCombat: !prev[characterId]?.isCombat,
        skillName: "",
        specializationType: undefined,
        specializationInput: undefined,
      },
    }))
  }

  const handleSkillChange = (characterId: string, skillName: string) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        skillName,
        specializationInput: isSpecializationCategory(skillName) ? prev[characterId]?.specializationInput : undefined,
      },
    }))
  }

  const handleSpecializationInputChange = (characterId: string, input: string) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        specializationInput: input,
      },
    }))
  }

  const handleAttributeChange = (characterId: string, attribute: string) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        attribute,
      },
    }))
  }

  const handleDiceRollChange = (characterId: string, diceRoll: number) => {
    const clampedValue = Math.max(1, Math.min(10, diceRoll))
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        diceRoll: clampedValue,
      },
    }))
  }

  const handleIndividualDifficultyChange = (characterId: string, difficulty: number | "") => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        individualDifficultyLevel: difficulty,
      },
    }))
  }

  const characterHasGambiarra = (member: Member): boolean => {
    return (member.perks || []).includes("Gambiarra")
  }

  const handleGambiarraToggle = (characterId: string) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        isGambiarra: !prev[characterId]?.isGambiarra,
        skillName: prev[characterId]?.isGambiarra ? prev[characterId].skillName : "",
        attribute: prev[characterId]?.isGambiarra ? prev[characterId].attribute : "",
        diceRoll: prev[characterId]?.isGambiarra ? prev[characterId].diceRoll : 1,
        individualDifficultyLevel: prev[characterId]?.isGambiarra ? prev[characterId].individualDifficultyLevel : "",
      },
    }))

  }

  const handleSubmit = () => {
    const selectedCharacterIds = Object.keys(selectedCharacters).filter((id) => selectedCharacters[id].selected)

    if (selectedCharacterIds.length === 0) {
      alert("Por favor, selecione pelo menos um personagem")
      return
    }

    const invalidCharacters = selectedCharacterIds.filter((characterId) => {
      const characterData = selectedCharacters[characterId]

      if (characterData.isGambiarra) {
        return false
      }

      const needsSpecializationInput =
        isSpecializationCategory(characterData.skillName) && !characterData.specializationInput
      return !characterData.skillName || !characterData.attribute || needsSpecializationInput
    })

    if (invalidCharacters.length > 0) {
      alert("Por favor, preencha todos os campos obrigatórios para todos os personagens selecionados")
      return
    }

    const results: SkillTestResult[] = []
    let totalSum = 0

    selectedCharacterIds.forEach((characterId) => {
      const member = allMembers.find((m) => m.id === characterId)
      const characterData = selectedCharacters[characterId]
      if (!member || !characterData) return

      if (characterData.isGambiarra) {
        if (!editingTestId) {
          setGambiarraUsed((prev) => ({
            ...prev,
            [characterId]: true,
          }))
        }

        const result: SkillTestResult = {
          id: `${Date.now()}-${Math.random()}-${characterId}`,
          testName: testName || undefined,
          characterName: member.name,
          teamName: member.teamName,
          skillType: "Gambiarra",
          skillName: "Gambiarra",
          attributeName: "N/A",
          skillValue: 0,
          attributeValue: 0,
          diceRoll: 0,
          totalResult: 999,
          timestamp: new Date().toISOString(),
          isCombat: characterData.isCombat,
          globalDifficultyLevel: globalDifficultyLevel !== "" ? Number(globalDifficultyLevel) : undefined,
          isGlobalSum,
          individualDifficultyLevel:
            characterData.individualDifficultyLevel !== ""
              ? Number(characterData.individualDifficultyLevel)
              : undefined,
          isSuccess: true,
          customPhrase: characterData.customPhrase || "",
          customPhraseStatus: "success",
          isGambiarra: true,
        }
        results.push(result)
        totalSum += 999
        return
      }

      const skillValue = getSkillValue(member, characterData.skillName, characterData.specializationInput)
      const attributeValue = getAttributeWithModifiers(member, characterData.attribute as keyof Member)
      const totalResult = skillValue + attributeValue + characterData.diceRoll

      totalSum += totalResult

      const displaySkillName =
        isSpecializationCategory(characterData.skillName) && characterData.specializationInput
          ? `${characterData.skillName} (${characterData.specializationInput})`
          : characterData.skillName

      let isSuccess: boolean | undefined = undefined
      if (globalDifficultyLevel !== "") {
        if (isGlobalSum) {
          isSuccess = undefined
        } else {
          isSuccess = totalResult >= globalDifficultyLevel
        }
      } else if (
        characterData.individualDifficultyLevel !== "" &&
        characterData.individualDifficultyLevel !== undefined
      ) {
        isSuccess = totalResult >= characterData.individualDifficultyLevel
      }

      const result: SkillTestResult = {
        id: `${Date.now()}-${Math.random()}-${characterId}`,
        testName: testName || undefined,
        characterName: member.name,
        teamName: member.teamName,
        skillType: combatSkills.includes(characterData.skillName) ? "Combate" : "Perícia",
        skillName: displaySkillName,
        attributeName: attributes.find((attr) => attr.key === characterData.attribute)?.name || characterData.attribute,
        skillValue,
        attributeValue,
        diceRoll: characterData.diceRoll,
        totalResult,
        timestamp: new Date().toISOString(),
        isCombat: characterData.isCombat,
        globalDifficultyLevel: globalDifficultyLevel !== "" ? Number(globalDifficultyLevel) : undefined,
        isGlobalSum,
        individualDifficultyLevel:
          characterData.individualDifficultyLevel !== "" ? Number(characterData.individualDifficultyLevel) : undefined,
        isSuccess,
        customPhrase: characterData.customPhrase || undefined,
        customPhraseStatus: characterData.customPhraseStatus || "neutral",
      }

      results.push(result)
    })

    if (globalDifficultyLevel !== "" && isGlobalSum) {
      const globalSuccess = totalSum >= globalDifficultyLevel
      results.forEach((result) => {
        if (!result.isGambiarra) {
          result.isSuccess = globalSuccess
        }
      })
    }

    onAddResult(results)

    setTestName("")
    setGlobalDifficultyLevel("")
    setIsGlobalSum(false)
    setCustomPhrases([])
    setNewPhrase("")
    setSelectedCharacters({})
    onClose()
  }

  if (!isOpen) return null

  const selectedCharacterIds = Object.keys(selectedCharacters).filter((id) => selectedCharacters[id].selected)
  const totalSum = selectedCharacterIds.reduce((sum, characterId) => {
    const member = allMembers.find((m) => m.id === characterId)
    const characterData = selectedCharacters[characterId]
    if (!member || !characterData || !characterData.skillName || !characterData.attribute) return sum

    const skillValue = getSkillValue(member, characterData.skillName, characterData.specializationInput)
    const attributeValue = getAttributeWithModifiers(member, characterData.attribute as keyof Member)
    return sum + skillValue + attributeValue + characterData.diceRoll
  }, 0)

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
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {editingTestId ? "Editar Teste de Perícia" : "Teste de Perícia"}
          </h2>
          {testName && <p className="text-sm text-gray-600 mt-1">{testName}</p>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nome do Teste (opcional)</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Ex: Teste de Furtividade"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nível de Dificuldade Global (opcional)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={globalDifficultyLevel}
                  onChange={(e) => setGlobalDifficultyLevel(e.target.value === "" ? "" : Number(e.target.value))}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Ex: 15"
                />
                {globalDifficultyLevel !== "" && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isGlobalSum}
                      onChange={(e) => setIsGlobalSum(e.target.checked)}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label className="text-sm text-gray-600">Somatório</label>
                  </div>
                )}
              </div>
              {globalDifficultyLevel !== "" && isGlobalSum && (
                <p className="text-xs text-gray-500">
                  A soma de todos os testes será comparada com o nível de dificuldade. Total atual: {totalSum}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-x-4">
              <label className="block text-sm font-semibold text-gray-700">Frases Customizadas (opcional)</label>
              <button
                type="button"
                onClick={() => setShowCustomPhrasesInput(!showCustomPhrasesInput)}
                className="flex items-center justify-center h-7 px-2 
                  bg-gradient-to-r from-purple-500 to-purple-600 
                  text-white rounded-lg shadow-md 
                  hover:from-purple-600 hover:to-purple-700 
                  active:scale-95 transition-all duration-200 
                  cursor-pointer w-full sm:w-auto"
                title={showCustomPhrasesInput ? "Ocultar frases customizadas" : "Adicionar frases customizadas"}
              >
                <span className="text-lg font-bold">{showCustomPhrasesInput ? "−" : "+"}</span>
              </button>
            </div>

            {showCustomPhrasesInput && (
              <div className="border border-gray-300 rounded-lg p-3">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newPhrase}
                    onChange={(e) => setNewPhrase(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                    placeholder="Ex: passou despercebido dos olhos da Medusa"
                    onKeyPress={(e) => e.key === "Enter" && handleAddCustomPhrase()}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomPhrase}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer w-full sm:w-auto"
                  >
                    Adicionar
                  </button>
                </div>
                {customPhrases.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Frases disponíveis:</p>
                    <div className="flex flex-wrap gap-2">
                      {customPhrases.map((phrase, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                          <span className="mr-2">{phrase}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomPhrase(phrase)}
                            className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Personagens Envolvidos <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-96 overflow-y-auto">
              {initiativeOrder.map((result, index) => {
                const member = allMembers.find((m) => m.id === result.memberId)
                if (!member) return null

                const isSelected = selectedCharacters[result.memberId]?.selected || false
                const characterData = selectedCharacters[result.memberId] || {
                  selected: false,
                  isCombat: false,
                  skillName: "",
                  attribute: "",
                  diceRoll: 1,
                  specializationType: undefined,
                  specializationInput: undefined,
                  individualDifficultyLevel: "",
                  customPhrase: "",
                  customPhraseStatus: "neutral",
                  isGambiarra: false,
                }

                const teamColorClass =
                  member.teamName === team1Name ? "text-blue-600 bg-blue-50" : "text-red-600 bg-red-50"

                let successStatus: "success" | "failure" | "neutral" = "neutral"
                if (isSelected) {
                  if (characterData.isGambiarra) {
                    successStatus = "success"
                  } else if (characterData.skillName && characterData.attribute) {
                    const skillValue = getSkillValue(member, characterData.skillName, characterData.specializationInput)
                    const attributeValue = getAttributeWithModifiers(member, characterData.attribute as keyof Member)
                    const totalResult = skillValue + attributeValue + characterData.diceRoll

                    if (globalDifficultyLevel !== "") {
                      if (isGlobalSum) {
                        successStatus = totalSum >= globalDifficultyLevel ? "success" : "failure"
                      } else {
                        successStatus = totalResult >= globalDifficultyLevel ? "success" : "failure"
                      }
                    } else if (
                      characterData.individualDifficultyLevel !== "" &&
                      characterData.individualDifficultyLevel !== undefined
                    ) {
                      successStatus = totalResult >= characterData.individualDifficultyLevel ? "success" : "failure"
                    }
                  }
                }

                const containerBorderClass = characterData.isGambiarra
                  ? "border-l-4 border-yellow-500 bg-yellow-50"
                  : successStatus === "success"
                    ? "border-l-4 border-green-500"
                    : successStatus === "failure"
                      ? "border-l-4 border-red-500"
                      : "border-l-4 border-purple-500"

                return (
                  <div
                    key={result.memberId}
                    className={`${index > 0 ? "border-t border-gray-500" : ""} py-3 ${containerBorderClass}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="pl-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCharacterToggle(result.memberId)}
                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {result.name} (
                          <span className={`font-semibold px-2 py-1 rounded ${teamColorClass}`}>{result.teamName}</span>
                          ) - Iniciativa:{" "}
                          <span className="font-bold text-lg text-gray-900">{result.totalInitiative}</span>
                        </span>
                      </div>

                      {isSelected && (
                        <div className="flex items-center space-x-4">
                          {characterHasGambiarra(member) && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={characterData.isGambiarra || false}
                                onChange={() => handleGambiarraToggle(result.memberId)}
                                disabled={
                                  !editingTestId && gambiarraUsed[result.memberId] && !characterData.isGambiarra
                                }
                                className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <label className="text-sm text-yellow-600 font-medium">
                                Gambiarra{" "}
                                {!editingTestId &&
                                  gambiarraUsed[result.memberId] &&
                                  !characterData.isGambiarra &&
                                  "(Usada)"}
                              </label>
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={characterData.isCombat}
                              onChange={() => handleCombatToggle(result.memberId)}
                              disabled={characterData.isGambiarra}
                              className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer disabled:opacity-50"
                            />
                            <label className="text-sm text-gray-600">Combate</label>
                          </div>
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="ml-7 space-y-3">
                        {characterData.isGambiarra ? (
                          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-yellow-800 font-bold text-lg">⚡ GAMBIARRA ATIVADA</span>
                            </div>
                            <p className="text-yellow-700 text-sm mb-3">
                              Solução miraculosa aplicada! O teste é considerado um sucesso automático.
                            </p>

                            <div>
                              <label className="block text-xs font-medium text-yellow-700 mb-1">
                                Descrição da Gambiarra (opcional)
                              </label>
                              <input
                                type="text"
                                value={characterData.customPhrase || ""}
                                onChange={(e) => handleCustomPhraseChange(result.memberId, e.target.value)}
                                placeholder="Descreva como a gambiarra foi aplicada..."
                                className="w-full text-sm border border-yellow-300 rounded px-2 py-1 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                              />
                            </div>

                            {customPhrases.length > 0 && (
                              <div className="mt-2">
                                <label className="block text-xs font-medium text-yellow-700 mb-1">
                                  Ou selecione uma frase pré-definida:
                                </label>
                                <select
                                  value=""
                                  onChange={(e) => handleCustomPhraseChange(result.memberId, e.target.value)}
                                  className="w-full text-sm border border-yellow-300 rounded px-2 py-1 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white"
                                >
                                  <option value="">Selecionar frase...</option>
                                  {customPhrases.map((phrase, index) => (
                                    <option key={index} value={phrase}>
                                      {phrase}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Perícia <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={characterData.skillName}
                                onChange={(e) => handleSkillChange(result.memberId, e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="">Selecione...</option>
                                {getAvailableSkillsForCharacter(result.memberId).map((skill) => {
                                  const isSpecialization = isSpecializationCategory(skill)
                                  const skillValue = isSpecialization ? null : getSkillValue(member, skill)
                                  const isCombatSkill = combatSkills.includes(skill)

                                  const displayValue = isSpecialization
                                    ? ""
                                    : isCombatSkill && skillValue === 0
                                      ? ""
                                      : ` (${skillValue})`

                                  return (
                                    <option key={skill} value={skill}>
                                      {skill}
                                      {displayValue}
                                    </option>
                                  )
                                })}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Atributo <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={characterData.attribute}
                                onChange={(e) => handleAttributeChange(result.memberId, e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="">Selecione...</option>
                                {attributes.map((attr) => {
                                  const attrValue = getAttributeWithModifiers(member, attr.key as keyof Member)
                                  return (
                                    <option key={attr.key} value={attr.key}>
                                      {attr.name} ({attrValue})
                                    </option>
                                  )
                                })}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Dado (D10) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={characterData.diceRoll}
                                onChange={(e) =>
                                  handleDiceRollChange(result.memberId, Number.parseInt(e.target.value, 10) || 1)
                                }
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>

                            {globalDifficultyLevel === "" && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Dificuldade Individual
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="50"
                                  value={characterData.individualDifficultyLevel}
                                  onChange={(e) =>
                                    handleIndividualDifficultyChange(
                                      result.memberId,
                                      e.target.value === "" ? "" : Number(e.target.value),
                                    )
                                  }
                                  className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                  placeholder="Ex: 15"
                                />
                              </div>
                            )}

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
                              <div
                                className={`text-sm border border-gray-200 rounded px-2 py-1 font-bold ${
                                  successStatus === "success"
                                    ? "bg-green-50 text-green-700"
                                    : successStatus === "failure"
                                      ? "bg-red-50 text-red-700"
                                      : "bg-gray-50 text-purple-700"
                                }`}
                              >
                                {characterData.skillName && characterData.attribute
                                  ? getSkillValue(member, characterData.skillName, characterData.specializationInput) +
                                    getAttributeWithModifiers(member, characterData.attribute as keyof Member) +
                                    characterData.diceRoll
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        )}

                        {!characterData.isGambiarra && customPhrases.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Frase Customizada (opcional)
                              </label>
                              <select
                                value={characterData.customPhrase || ""}
                                onChange={(e) => handleCustomPhraseChange(result.memberId, e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="">Nenhuma frase selecionada</option>
                                {customPhrases.map((phrase, index) => (
                                  <option key={index} value={phrase}>
                                    {phrase}
                                  </option>
                                ))}
                              </select>

                              {characterData.customPhrase && (
                                <div className="flex items-center gap-4 mt-2">
                                  <label className="flex items-center gap-1">
                                    <input
                                      type="checkbox"
                                      checked={characterData.customPhraseStatus === "success"}
                                      onChange={(e) =>
                                        handleCustomPhraseStatusChange(
                                          result.memberId,
                                          e.target.checked ? "success" : "neutral",
                                        )
                                      }
                                      className="w-3 h-3 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                    />
                                    <span className="text-xs text-green-600 font-medium">Sucesso</span>
                                  </label>
                                  <label className="flex items-center gap-1">
                                    <input
                                      type="checkbox"
                                      checked={characterData.customPhraseStatus === "failure"}
                                      onChange={(e) =>
                                        handleCustomPhraseStatusChange(
                                          result.memberId,
                                          e.target.checked ? "failure" : "neutral",
                                        )
                                      }
                                      className="w-3 h-3 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                                    />
                                    <span className="text-xs text-red-600 font-medium">Falha</span>
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {!characterData.isGambiarra && isSpecializationCategory(characterData.skillName) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Especificação da Perícia <span className="text-red-500">*</span>
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={characterData.specializationInput || ""}
                                  onChange={(e) => handleSpecializationInputChange(result.memberId, e.target.value)}
                                  className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                  placeholder={`Ex: ${characterData.skillName === "Esportes" ? "Natação" : characterData.skillName === "Idiomas" ? "Inglês" : "Especifique..."}`}
                                />
                                {characterData.specializationInput && (
                                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    ({getSkillValue(member, characterData.skillName, characterData.specializationInput)}
                                    )
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Se o personagem não possuir esta especialização, será aplicado -2 no teste.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
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
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer w-full sm:w-auto"
            disabled={selectedCharacterIds.length === 0}
          >
            {editingTestId ? "Editar Teste" : `Adicionar Teste${selectedCharacterIds.length > 1 ? "s" : ""}`}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
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



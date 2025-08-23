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

import { TestConfigurationSection } from "./SkillTestModal-components/TestConfigurationSection"
import { CustomPhrasesSection } from "./SkillTestModal-components/CustomPhrasesSection"
import { CharacterTestRow } from "./SkillTestModal-components/CharacterTestRow"

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
      hasTerrainAdvantage?: boolean
      hasTerrainDisadvantage?: boolean
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
            hasTerrainAdvantage: test.hasTerrainAdvantage || false,
            hasTerrainDisadvantage: test.hasTerrainDisadvantage || false,
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
        hasTerrainAdvantage: prev[characterId]?.hasTerrainAdvantage || false,
        hasTerrainDisadvantage: prev[characterId]?.hasTerrainDisadvantage || false,
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

  const handleTerrainAdvantageToggle = (characterId: string) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        hasTerrainAdvantage: !prev[characterId]?.hasTerrainAdvantage,
      },
    }))
  }

  const handleTerrainDisadvantageToggle = (characterId: string) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        hasTerrainDisadvantage: !prev[characterId]?.hasTerrainDisadvantage,
      },
    }))
  }

  const characterHasTerrainAdvantage = (member: Member): boolean => {
    return (member.perks || []).includes("Terreno Favorável")
  }

  const characterHasTerrainDisadvantage = (member: Member): boolean => {
    return (member.hindrances || []).includes("Terreno Desfavorável")
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
          hasTerrainAdvantage: characterData.hasTerrainAdvantage || false,
          hasTerrainDisadvantage: characterData.hasTerrainDisadvantage || false,
        }
        results.push(result)
        totalSum += 999
        return
      }

      const skillValue = getSkillValue(member, characterData.skillName, characterData.specializationInput)
      const attributeValue = getAttributeWithModifiers(member, characterData.attribute as keyof Member)
      let totalResult = skillValue + attributeValue + characterData.diceRoll

      if (characterData.hasTerrainAdvantage && characterData.isCombat) {
        totalResult += 1
      }
      if (characterData.hasTerrainDisadvantage && characterData.isCombat) {
        totalResult -= 1
      }

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
        hasTerrainAdvantage: characterData.hasTerrainAdvantage || false,
        hasTerrainDisadvantage: characterData.hasTerrainDisadvantage || false,
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
          <TestConfigurationSection
            testName={testName}
            setTestName={setTestName}
            globalDifficultyLevel={globalDifficultyLevel}
            setGlobalDifficultyLevel={setGlobalDifficultyLevel}
            isGlobalSum={isGlobalSum}
            setIsGlobalSum={setIsGlobalSum}
            totalSum={totalSum}
          />

          <CustomPhrasesSection
            customPhrases={customPhrases}
            setCustomPhrases={setCustomPhrases}
            newPhrase={newPhrase}
            setNewPhrase={setNewPhrase}
            showCustomPhrasesInput={showCustomPhrasesInput}
            setShowCustomPhrasesInput={setShowCustomPhrasesInput}
            onRemovePhrase={handleRemoveCustomPhrase}
          />

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
                  hasTerrainAdvantage: false,
                  hasTerrainDisadvantage: false,
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
                  <CharacterTestRow
                    key={result.memberId}
                    result={result}
                    member={member}
                    index={index}
                    isSelected={isSelected}
                    characterData={characterData}
                    teamColorClass={teamColorClass}
                    successStatus={successStatus}
                    containerBorderClass={containerBorderClass}
                    team1Name={team1Name}
                    globalDifficultyLevel={globalDifficultyLevel}
                    customPhrases={customPhrases}
                    availableSkills={getAvailableSkillsForCharacter(result.memberId)}
                    attributes={attributes}
                    gambiarraUsed={gambiarraUsed}
                    editingTestId={editingTestId}
                    onCharacterToggle={handleCharacterToggle}
                    onGambiarraToggle={handleGambiarraToggle}
                    onCombatToggle={handleCombatToggle}
                    onSkillChange={handleSkillChange}
                    onAttributeChange={handleAttributeChange}
                    onDiceRollChange={handleDiceRollChange}
                    onIndividualDifficultyChange={handleIndividualDifficultyChange}
                    onSpecializationInputChange={handleSpecializationInputChange}
                    onCustomPhraseChange={handleCustomPhraseChange}
                    onCustomPhraseStatusChange={handleCustomPhraseStatusChange}
                    characterHasGambiarra={characterHasGambiarra}
                    getSkillValue={getSkillValue}
                    getAttributeWithModifiers={getAttributeWithModifiers}
                    isSpecializationCategory={isSpecializationCategory}
                    characterHasTerrainAdvantage={characterHasTerrainAdvantage}
                    characterHasTerrainDisadvantage={characterHasTerrainDisadvantage}
                    onTerrainAdvantageToggle={handleTerrainAdvantageToggle}
                    onTerrainDisadvantageToggle={handleTerrainDisadvantageToggle}
                  />
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





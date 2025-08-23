import type { Member, InitiativeResult } from "../../../constants/rpg.data"
import { GambiarraSection } from "./GambiarraSection"
import { SkillAttributeInputs } from "./SkillAttributeInputs"
import { SpecializationInput } from "./SpecializationInput"
import { CustomPhraseInput } from "./CustomPhraseInput"

interface CharacterData {
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

interface CharacterTestRowProps {
  result: InitiativeResult
  member: Member
  index: number
  isSelected: boolean
  characterData: CharacterData
  teamColorClass: string
  successStatus: "success" | "failure" | "neutral"
  containerBorderClass: string
  team1Name: string
  globalDifficultyLevel: number | ""
  customPhrases: string[]
  availableSkills: string[]
  attributes: Array<{ key: string; name: string }>
  gambiarraUsed: { [characterId: string]: boolean }
  editingTestId?: string | null
  onCharacterToggle: (characterId: string) => void
  onGambiarraToggle: (characterId: string) => void
  onCombatToggle: (characterId: string) => void
  onSkillChange: (characterId: string, skillName: string) => void
  onAttributeChange: (characterId: string, attribute: string) => void
  onDiceRollChange: (characterId: string, diceRoll: number) => void
  onIndividualDifficultyChange: (characterId: string, difficulty: number | "") => void
  onSpecializationInputChange: (characterId: string, input: string) => void
  onCustomPhraseChange: (characterId: string, phrase: string) => void
  onCustomPhraseStatusChange: (characterId: string, status: "success" | "failure" | "neutral") => void
  characterHasGambiarra: (member: Member) => boolean
  getSkillValue: (member: Member, skillName: string, specializationInput?: string) => number
  getAttributeWithModifiers: (member: Member, attr: keyof Member) => number
  isSpecializationCategory: (skillName: string) => boolean
  characterHasTerrainAdvantage: (member: Member) => boolean
  characterHasTerrainDisadvantage: (member: Member) => boolean
  onTerrainAdvantageToggle: (characterId: string) => void
  onTerrainDisadvantageToggle: (characterId: string) => void
}

export function CharacterTestRow({
  result,
  member,
  index,
  isSelected,
  characterData,
  teamColorClass,
  successStatus,
  containerBorderClass,
  globalDifficultyLevel,
  customPhrases,
  availableSkills,
  attributes,
  gambiarraUsed,
  editingTestId,
  onCharacterToggle,
  onGambiarraToggle,
  onCombatToggle,
  onSkillChange,
  onAttributeChange,
  onDiceRollChange,
  onIndividualDifficultyChange,
  onSpecializationInputChange,
  onCustomPhraseChange,
  onCustomPhraseStatusChange,
  characterHasGambiarra,
  getSkillValue,
  getAttributeWithModifiers,
  isSpecializationCategory,
  characterHasTerrainAdvantage,
  characterHasTerrainDisadvantage,
  onTerrainAdvantageToggle,
  onTerrainDisadvantageToggle,
}: CharacterTestRowProps) {
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
              onChange={() => onCharacterToggle(result.memberId)}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {result.name} (
            <span className={`font-semibold px-2 py-1 rounded ${teamColorClass}`}>{result.teamName}</span>) -
            Iniciativa: <span className="font-bold text-lg text-gray-900">{result.totalInitiative}</span>
          </span>
        </div>

        {isSelected && (
          <div className="flex items-center space-x-4">
            {characterHasGambiarra(member) && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={characterData.isGambiarra || false}
                  onChange={() => onGambiarraToggle(result.memberId)}
                  disabled={!editingTestId && gambiarraUsed[result.memberId] && !characterData.isGambiarra}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label className="text-sm text-yellow-600 font-medium">
                  Gambiarra{" "}
                  {!editingTestId && gambiarraUsed[result.memberId] && !characterData.isGambiarra && "(Usada)"}
                </label>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={characterData.isCombat}
                onChange={() => onCombatToggle(result.memberId)}
                disabled={characterData.isGambiarra}
                className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer disabled:opacity-50"
              />
              <label className="text-sm text-gray-600">Combate</label>
            </div>

            {characterData.isCombat && characterHasTerrainAdvantage(member) && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={characterData.hasTerrainAdvantage || false}
                  onChange={() => onTerrainAdvantageToggle(result.memberId)}
                  disabled={characterData.isGambiarra}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer disabled:opacity-50"
                />
                <label className="text-sm text-green-600">Terreno Favorável</label>
              </div>
            )}

            {characterData.isCombat && characterHasTerrainDisadvantage(member) && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={characterData.hasTerrainDisadvantage || false}
                  onChange={() => onTerrainDisadvantageToggle(result.memberId)}
                  disabled={characterData.isGambiarra}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer disabled:opacity-50"
                />
                <label className="text-sm text-orange-600">Terreno Desfavorável</label>
              </div>
            )}
          </div>
        )}
      </div>

      {isSelected && (
        <div className="ml-7 space-y-3">
          {characterData.isGambiarra ? (
            <GambiarraSection
              customPhrase={characterData.customPhrase || ""}
              onCustomPhraseChange={(phrase) => onCustomPhraseChange(result.memberId, phrase)}
              customPhrases={customPhrases}
            />
          ) : (
            <SkillAttributeInputs
              member={member}
              skillName={characterData.skillName}
              attribute={characterData.attribute}
              diceRoll={characterData.diceRoll}
              individualDifficultyLevel={characterData.individualDifficultyLevel || ""}
              globalDifficultyLevel={globalDifficultyLevel}
              availableSkills={availableSkills}
              attributes={attributes}
              onSkillChange={(skillName) => onSkillChange(result.memberId, skillName)}
              onAttributeChange={(attribute) => onAttributeChange(result.memberId, attribute)}
              onDiceRollChange={(diceRoll) => onDiceRollChange(result.memberId, diceRoll)}
              onIndividualDifficultyChange={(difficulty) => onIndividualDifficultyChange(result.memberId, difficulty)}
              getSkillValue={getSkillValue}
              getAttributeWithModifiers={getAttributeWithModifiers}
              isSpecializationCategory={isSpecializationCategory}
              specializationInput={characterData.specializationInput}
              successStatus={successStatus}
            />
          )}

          {!characterData.isGambiarra && customPhrases.length > 0 && (
            <CustomPhraseInput
              customPhrase={characterData.customPhrase || ""}
              customPhraseStatus={characterData.customPhraseStatus || "neutral"}
              customPhrases={customPhrases}
              onCustomPhraseChange={(phrase) => onCustomPhraseChange(result.memberId, phrase)}
              onCustomPhraseStatusChange={(status) => onCustomPhraseStatusChange(result.memberId, status)}
            />
          )}

          {!characterData.isGambiarra && isSpecializationCategory(characterData.skillName) && (
            <SpecializationInput
              member={member}
              skillName={characterData.skillName}
              specializationInput={characterData.specializationInput || ""}
              onSpecializationInputChange={(input) => onSpecializationInputChange(result.memberId, input)}
              getSkillValue={getSkillValue}
            />
          )}
        </div>
      )}
    </div>
  )
}



import type { Member } from "../../../constants/rpg.data"
import { combatSkills } from "../../../constants/rpg.data"

interface SkillAttributeInputsProps {
  member: Member
  skillName: string
  attribute: string
  diceRoll: number
  individualDifficultyLevel: number | ""
  globalDifficultyLevel: number | ""
  availableSkills: string[]
  attributes: Array<{ key: string; name: string }>
  onSkillChange: (skillName: string) => void
  onAttributeChange: (attribute: string) => void
  onDiceRollChange: (diceRoll: number) => void
  onIndividualDifficultyChange: (difficulty: number | "") => void
  getSkillValue: (member: Member, skillName: string, specializationInput?: string) => number
  getAttributeWithModifiers: (member: Member, attr: keyof Member) => number
  isSpecializationCategory: (skillName: string) => boolean
  specializationInput?: string
  successStatus: "success" | "failure" | "neutral"
}

export function SkillAttributeInputs({
  member,
  skillName,
  attribute,
  diceRoll,
  individualDifficultyLevel,
  globalDifficultyLevel,
  availableSkills,
  attributes,
  onSkillChange,
  onAttributeChange,
  onDiceRollChange,
  onIndividualDifficultyChange,
  getSkillValue,
  getAttributeWithModifiers,
  isSpecializationCategory,
  specializationInput,
  successStatus,
}: SkillAttributeInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Perícia <span className="text-red-500">*</span>
        </label>
        <select
          value={skillName}
          onChange={(e) => onSkillChange(e.target.value)}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Selecione...</option>
          {availableSkills.map((skill) => {
            const isSpecialization = isSpecializationCategory(skill)
            const skillValue = isSpecialization ? null : getSkillValue(member, skill)
            const isCombatSkill = combatSkills.includes(skill)

            const displayValue = isSpecialization ? "" : isCombatSkill && skillValue === 0 ? "" : ` (${skillValue})`

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
          value={attribute}
          onChange={(e) => onAttributeChange(e.target.value)}
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
          value={diceRoll}
          onChange={(e) => onDiceRollChange(Number.parseInt(e.target.value, 10) || 1)}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {globalDifficultyLevel === "" && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Dificuldade Individual</label>
          <input
            type="number"
            min="1"
            max="50"
            value={individualDifficultyLevel}
            onChange={(e) => onIndividualDifficultyChange(e.target.value === "" ? "" : Number(e.target.value))}
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
          {skillName && attribute
            ? getSkillValue(member, skillName, specializationInput) +
              getAttributeWithModifiers(member, attribute as keyof Member) +
              diceRoll
            : "-"}
        </div>
      </div>
    </div>
  )
}
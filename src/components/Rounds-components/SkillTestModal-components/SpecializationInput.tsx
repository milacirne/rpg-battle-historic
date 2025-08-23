import type { Member } from "../../../constants/rpg.data"

interface SpecializationInputProps {
  member: Member
  skillName: string
  specializationInput: string
  onSpecializationInputChange: (input: string) => void
  getSkillValue: (member: Member, skillName: string, specializationInput?: string) => number
}

export function SpecializationInput({
  member,
  skillName,
  specializationInput,
  onSpecializationInputChange,
  getSkillValue,
}: SpecializationInputProps) {
  const getPlaceholder = () => {
    switch (skillName) {
      case "Esportes":
        return "Natação"
      case "Idiomas":
        return "Inglês"
      default:
        return "Especifique..."
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Especificação da Perícia <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={specializationInput}
            onChange={(e) => onSpecializationInputChange(e.target.value)}
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={`Ex: ${getPlaceholder()}`}
          />
          {specializationInput && (
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              ({getSkillValue(member, skillName, specializationInput)})
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Se o personagem não possuir esta especialização, será aplicado -2 no teste.
        </p>
      </div>
    </div>
  )
}
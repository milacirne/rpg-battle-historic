import type { Member, PeculiarityData, TrejeitoData, GlobalSkillEffect } from "../constants/rpg.data"
import {
  allPeculiarities,
  allTrejeitos,
  specializationCategories,
  combatSkills,
  socialSkills,
  utilitySkills,
  complementarySkills,
} from "../constants/rpg.data"

type Props = {
  member: Member
  onClose: () => void
}

export default function MemberInfoModal({ member, onClose }: Props) {
  const derivedGlobalSkillEffects = member.derivedGlobalSkillEffects || []

  const getFinalSkillValue = (
    skillName: string,
    baseValue: number,
    category: GlobalSkillEffect["category"],
  ): number => {
    let finalValue = baseValue || 0

    const individualEffect = derivedGlobalSkillEffects?.find(
      (effect) => effect.type === "individual" && effect.skillName === skillName,
    )
    if (individualEffect) {
      finalValue += individualEffect.value
    }

    const categoryEffect = derivedGlobalSkillEffects?.find(
      (effect) => effect.type === "category" && effect.category === category,
    )
    if (categoryEffect) {
      finalValue += categoryEffect.value
    }
    return finalValue
  }

  const shouldDisplaySkill = (
    skillName: string,
    baseValue: number,
    categoryKey: GlobalSkillEffect["category"],
    globalEffects: GlobalSkillEffect[],
  ): boolean => {
    if (baseValue > 0) {
      return true
    }

    const hasIndividualEffect = globalEffects.some(
      (effect) => effect.type === "individual" && effect.skillName === skillName,
    )
    if (hasIndividualEffect) {
      return true
    }

    const hasCategoryEffect = globalEffects.some(
      (effect) => effect.type === "category" && effect.category === categoryKey,
    )
    if (hasCategoryEffect) {
      return true
    }

    return false
  }

  const VITALIDADE = (member.vigor + member.determination) * 25
  const ENERGIA = (member.force + member.dexterity) * 25
  const MANA = (member.wisdom + member.charisma) * 25
  const INICIATIVA = member.agility + member.perception

  const activePowers = Object.fromEntries(Object.entries(member.powers || {}).filter(([, value]) => value > 0))
  const activeStyles = Object.fromEntries(Object.entries(member.styles || {}).filter(([, value]) => value > 0))

  const activeCombatSkills: Record<string, number> = {}
  combatSkills.forEach((skillName) => {
    const baseValue = member.baseSkills?.combat?.[skillName] || 0
    if (shouldDisplaySkill(skillName, baseValue, "combat", derivedGlobalSkillEffects)) {
      activeCombatSkills[skillName] = getFinalSkillValue(skillName, baseValue, "combat")
    }
  })

  const activeSocialSkills: Record<string, number> = {}
  socialSkills.forEach((skillName) => {
    const baseValue = member.baseSkills?.social?.[skillName] || 0
    if (shouldDisplaySkill(skillName, baseValue, "social", derivedGlobalSkillEffects)) {
      activeSocialSkills[skillName] = getFinalSkillValue(skillName, baseValue, "social")
    }
  })

  const activeUtilitySkills: Record<string, number> = {}
  utilitySkills.forEach((skillName) => {
    const baseValue = member.baseSkills?.utility?.[skillName] || 0
    if (shouldDisplaySkill(skillName, baseValue, "utility", derivedGlobalSkillEffects)) {
      activeUtilitySkills[skillName] = getFinalSkillValue(skillName, baseValue, "utility")
    }
  })

  const activeComplementarySkills: Record<string, number> = {}
  complementarySkills.forEach((skillName) => {
    const baseValue = member.baseSkills?.complementary?.[skillName] || 0
    if (shouldDisplaySkill(skillName, baseValue, "complementary", derivedGlobalSkillEffects)) {
      activeComplementarySkills[skillName] = getFinalSkillValue(skillName, baseValue, "complementary")
    }
  })

  const activeSpecializations = {
    languages: Object.fromEntries(
      Object.entries(member.baseSkills?.specialization?.languages || {})
        .filter(([skillName, baseValue]) =>
          shouldDisplaySkill(skillName, baseValue, "languages", derivedGlobalSkillEffects),
        )
        .map(([skillName, baseValue]) => [skillName, getFinalSkillValue(skillName, baseValue, "languages")]),
    ),
    arts: Object.fromEntries(
      Object.entries(member.baseSkills?.specialization?.arts || {})
        .filter(([skillName, baseValue]) => shouldDisplaySkill(skillName, baseValue, "arts", derivedGlobalSkillEffects))
        .map(([skillName, baseValue]) => [skillName, getFinalSkillValue(skillName, baseValue, "arts")]),
    ),
    knowledge: Object.fromEntries(
      Object.entries(member.baseSkills?.specialization?.knowledge || {})
        .filter(([skillName, baseValue]) =>
          shouldDisplaySkill(skillName, baseValue, "knowledge", derivedGlobalSkillEffects),
        )
        .map(([skillName, baseValue]) => [skillName, getFinalSkillValue(skillName, baseValue, "knowledge")]),
    ),
    driving: Object.fromEntries(
      Object.entries(member.baseSkills?.specialization?.driving || {})
        .filter(([skillName, baseValue]) =>
          shouldDisplaySkill(skillName, baseValue, "driving", derivedGlobalSkillEffects),
        )
        .map(([skillName, baseValue]) => [skillName, getFinalSkillValue(skillName, baseValue, "driving")]),
    ),
    crafts: Object.fromEntries(
      Object.entries(member.baseSkills?.specialization?.crafts || {})
        .filter(([skillName, baseValue]) =>
          shouldDisplaySkill(skillName, baseValue, "crafts", derivedGlobalSkillEffects),
        )
        .map(([skillName, baseValue]) => [skillName, getFinalSkillValue(skillName, baseValue, "crafts")]),
    ),
    sports: Object.fromEntries(
      Object.entries(member.baseSkills?.specialization?.sports || {})
        .filter(([skillName, baseValue]) =>
          shouldDisplaySkill(skillName, baseValue, "sports", derivedGlobalSkillEffects),
        )
        .map(([skillName, baseValue]) => [skillName, getFinalSkillValue(skillName, baseValue, "sports")]),
    ),
  }

  function renderSection(title: string, items: Record<string, number>, emptyMessage: string) {
    const itemsToDisplay = Object.entries(items)
    const hasItems = itemsToDisplay.length > 0

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
        {hasItems ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {itemsToDisplay.map(([name, value]) => (
              <div key={name} className="flex justify-between items-center bg-white rounded px-3 py-2 text-sm">
                <span className="text-gray-700">{name}</span>
                <span className="font-bold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">{emptyMessage}</p>
        )}
      </div>
    )
  }

  function renderAdvantageDisadvantageSection(
    title: string,
    selectedNames: string[],
    allItems: (PeculiarityData | TrejeitoData)[],
    emptyMessage: string,
  ) {
    const itemsToDisplay = selectedNames.map((name) => allItems.find((item) => item.name === name)).filter(Boolean) as (
      | PeculiarityData
      | TrejeitoData
    )[]

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
        {itemsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {itemsToDisplay.map((item) => (
              <div key={item.name} className="bg-white rounded px-3 py-2 text-sm">
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">{emptyMessage}</p>
        )}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{member.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                  {member.type === "semideus"
                    ? member.divineParent || "Sem Filiação"
                    : member.type === "humano"
                      ? "Humano"
                      : "Monstro"}
                </span>
                <span className="text-sm text-gray-600 capitalize">{member.type}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)] px-6 py-4 space-y-6">
          {/* Atributos Básicos */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Atributos</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="text-xs text-gray-600">Força</div>
                <div className="text-lg font-bold text-gray-900">{member.force}</div>
              </div>
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="text-xs text-gray-600">Determinação</div>
                <div className="text-lg font-bold text-gray-900">{member.determination}</div>
              </div>
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="text-xs text-gray-600">Agilidade</div>
                <div className="text-lg font-bold text-gray-900">{member.agility}</div>
              </div>
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="text-xs text-gray-600">Sabedoria</div>
                <div className="text-lg font-bold text-gray-900">{member.wisdom}</div>
              </div>
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="text-xs text-gray-600">Percepção</div>
                <div className="text-lg font-bold text-gray-900">{member.perception}</div>
              </div>
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="text-xs text-gray-600">Destreza</div>
                <div className="text-lg font-bold text-gray-900">{member.dexterity}</div>
              </div>
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="text-xs text-gray-600">Vigor</div>
                <div className="text-lg font-bold text-gray-900">{member.vigor}</div>
              </div>
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="text-xs text-gray-600">Carisma</div>
                <div className="text-lg font-bold text-gray-900">{member.charisma}</div>
              </div>
            </div>
          </div>

          {/* Estatísticas Derivadas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Estatísticas Derivadas</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-green-100 rounded px-3 py-2 text-center">
                <div className="text-xs text-green-700">Vitalidade</div>
                <div className="text-lg font-bold text-green-800">{VITALIDADE}</div>
              </div>
              <div className="bg-red-100 rounded px-3 py-2 text-center">
                <div className="text-xs text-red-700">Energia</div>
                <div className="text-lg font-bold text-red-800">{ENERGIA}</div>
              </div>
              <div className="bg-blue-100 rounded px-3 py-2 text-center">
                <div className="text-xs text-blue-700">Mana</div>
                <div className="text-lg font-bold text-blue-800">{MANA}</div>
              </div>
              <div className="bg-purple-100 rounded px-3 py-2 text-center">
                <div className="text-xs text-purple-700">Iniciativa</div>
                <div className="text-lg font-bold text-purple-800">{INICIATIVA}</div>
              </div>
            </div>
          </div>

          {/* Poderes */}
          {renderSection("Poderes", activePowers, "Nenhum poder adquirido")}

          {/* Estilos */}
          {renderSection("Estilos", activeStyles, "Nenhum estilo adquirido")}

          {/* Perícias de Combate */}
          {renderSection("Perícias de Combate", activeCombatSkills, "Nenhuma perícia de combate adquirida")}

          {/* Perícias Sociais */}
          {renderSection("Perícias Sociais", activeSocialSkills, "Nenhuma perícia social adquirida")}

          {/* Perícias de Utilidade */}
          {renderSection("Perícias de Utilidade", activeUtilitySkills, "Nenhuma perícia de utilidade adquirida")}

          {/* Perícias Complementares */}
          {renderSection(
            "Perícias Complementares",
            activeComplementarySkills,
            "Nenhuma perícia complementar adquirida",
          )}

          {/* Especializações */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Especializações</h4>
            {Object.entries(activeSpecializations).map(([category, skills]) => {
              const categoryName = specializationCategories[category as keyof typeof specializationCategories]
              const hasSkills = Object.keys(skills).length > 0

              const categoryGlobalEffects =
                derivedGlobalSkillEffects?.filter((effect) => effect.category === category) || []

              if (!hasSkills && categoryGlobalEffects.length === 0) return null

              return (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-700 mb-2">{categoryName}</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(skills).map(([name, value]) => (
                      <div key={name} className="flex justify-between items-center bg-white rounded px-3 py-2 text-sm">
                        <span className="text-gray-700">{name}</span>
                        <span className="font-bold text-gray-900">{value}</span>
                      </div>
                    ))}
                    {/* Exibe os efeitos globais para esta categoria */}
                    {categoryGlobalEffects.map((effect) => (
                      <div
                        key={effect.skillName}
                        className="flex justify-between items-center bg-white rounded px-3 py-2 text-sm italic text-gray-600"
                      >
                        <span>{effect.skillName} (Todos)</span>
                        <span className="font-bold">
                          {effect.value > 0 ? "+" : ""}
                          {effect.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
            {/* Mensagem de "Nenhuma especialização adquirida" se não houver nenhuma skill nem efeito global em especializações */}
            {Object.values(activeSpecializations).every((skills) => Object.keys(skills).length === 0) &&
              (derivedGlobalSkillEffects?.length === 0 ||
                !derivedGlobalSkillEffects?.some((e) =>
                  Object.keys(specializationCategories).includes(e.category),
                )) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm italic">Nenhuma especialização adquirida</p>
                </div>
              )}
          </div>

          {/* Peculiaridades */}
          {renderAdvantageDisadvantageSection(
            "Peculiaridades",
            member.peculiarities || [],
            allPeculiarities,
            "Nenhuma peculiaridade selecionada.",
          )}

          {/* Trejeitos */}
          {renderAdvantageDisadvantageSection(
            "Trejeitos",
            member.trejeitos || [],
            allTrejeitos,
            "Nenhum trejeito selecionado.",
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}














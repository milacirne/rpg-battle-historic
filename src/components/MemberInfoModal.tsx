import { useState } from "react"
import type {
  Member,
  PeculiarityData,
  TrejeitoData,
  GlobalSkillEffect,
  SpecializationCategory,
  AccordionState,
} from "../constants/rpg.data"
import {
  allPeculiarities,
  allTrejeitos,
  specializationCategories,
  combatSkills,
  socialSkills,
  utilitySkills,
  complementarySkills,
  abilities,
  disabilities,
} from "../constants/rpg.data"
import { AccordionSection } from "./AddMemberModal-components/AccordionSection"

type Props = {
  member: Member
  onClose: () => void
}

export default function MemberInfoModal({ member, onClose }: Props) {
  const [accordion, setAccordion] = useState<AccordionState>({
    powers: false,
    styles: false,
    skills: false,
    combat: false,
    social: false,
    utility: false,
    complementary: false,
    specialization: false,
    languages: false,
    arts: false,
    knowledge: false,
    driving: false,
    crafts: false,
    sports: false,
    advantages: false,
    abilities: false,
    peculiarities: false,
    disadvantages: false,
    disabilities: false,
    trejeitos: false,
  })

  const derivedGlobalSkillEffects = member.derivedGlobalSkillEffects || []

  const getAttributeWithModifiers = (attr: keyof Member): number => {
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

  const getFinalSkillValue = (
    skillName: string,
    baseValue: number,
    category: GlobalSkillEffect["category"],
  ): number => {
    let finalValue = baseValue || 0

    const individualEffect = derivedGlobalSkillEffects?.find(
      (effect) => effect.type === "individual" && effect.skillName === skillName && effect.category === category,
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

  const VITALIDADE = (member.vigor + member.determination) * 25
  const ENERGIA = (member.force + member.dexterity) * 25
  const MANA = (member.wisdom + member.charisma) * 25
  const INICIATIVA = member.agility + member.perception

  const activePowers = Object.fromEntries(Object.entries(member.powers || {}).filter(([, value]) => value > 0))
  const activeStyles = Object.fromEntries(Object.entries(member.styles || {}).filter(([, value]) => value > 0))

  const activeCombatSkills: Record<string, number> = {}
  combatSkills.forEach((skillName) => {
    const baseValue = member.baseSkills?.combat?.[skillName] || 0
    const finalValue = getFinalSkillValue(skillName, baseValue, "combat")
    const hasIndividualEffect = derivedGlobalSkillEffects.some(
      (effect) => effect.type === "individual" && effect.skillName === skillName && effect.category === "combat",
    )
    if (baseValue > 0 || hasIndividualEffect) {
      activeCombatSkills[skillName] = finalValue
    }
  })

  const activeSocialSkills: Record<string, number> = {}
  socialSkills.forEach((skillName) => {
    const baseValue = member.baseSkills?.social?.[skillName] || 0
    const finalValue = getFinalSkillValue(skillName, baseValue, "social")
    const hasIndividualEffect = derivedGlobalSkillEffects.some(
      (effect) => effect.type === "individual" && effect.skillName === skillName && effect.category === "social",
    )
    if (baseValue > 0 || hasIndividualEffect) {
      activeSocialSkills[skillName] = finalValue
    }
  })

  const activeUtilitySkills: Record<string, number> = {}
  utilitySkills.forEach((skillName) => {
    const baseValue = member.baseSkills?.utility?.[skillName] || 0
    const finalValue = getFinalSkillValue(skillName, baseValue, "utility")
    const hasIndividualEffect = derivedGlobalSkillEffects.some(
      (effect) => effect.type === "individual" && effect.skillName === skillName && effect.category === "utility",
    )
    if (baseValue > 0 || hasIndividualEffect) {
      activeUtilitySkills[skillName] = finalValue
    }
  })

  const activeComplementarySkills: Record<string, number> = {}
  complementarySkills.forEach((skillName) => {
    const baseValue = member.baseSkills?.complementary?.[skillName] || 0
    const finalValue = getFinalSkillValue(skillName, baseValue, "complementary")
    const hasIndividualEffect = derivedGlobalSkillEffects.some(
      (effect) => effect.type === "individual" && effect.skillName === skillName && effect.category === "complementary",
    )
    if (baseValue > 0 || hasIndividualEffect) {
      activeComplementarySkills[skillName] = finalValue
    }
  })

  const activeSpecializations: Record<SpecializationCategory, Record<string, number>> = {
    languages: {},
    arts: {},
    knowledge: {},
    driving: {},
    crafts: {},
    sports: {},
  }

  const processSpecializationCategory = (categoryKey: SpecializationCategory) => {
    const baseSkillsForCategory = member.baseSkills?.specialization?.[categoryKey] || {}
    const skillsToProcess: Record<string, number> = { ...baseSkillsForCategory }

    derivedGlobalSkillEffects.forEach((effect) => {
      if (effect.type === "individual" && effect.category === categoryKey) {
        if (skillsToProcess[effect.skillName] === undefined) {
          skillsToProcess[effect.skillName] = 0
        }
      }
    })

    for (const skillName in skillsToProcess) {
      const baseValue = baseSkillsForCategory[skillName] || 0
      const finalValue = getFinalSkillValue(skillName, baseValue, categoryKey)

      const hasIndividualEffectOnThisSkill = derivedGlobalSkillEffects.some(
        (effect) => effect.type === "individual" && effect.skillName === skillName && effect.category === categoryKey,
      )
      const hasCategoryEffect = derivedGlobalSkillEffects.some(
        (effect) => effect.type === "category" && effect.category === categoryKey,
      )

      if (finalValue > 0 || hasIndividualEffectOnThisSkill || hasCategoryEffect) {
        activeSpecializations[categoryKey][skillName] = finalValue
      }
    }

    const categoryGlobalEffect = derivedGlobalSkillEffects?.find(
      (effect) => effect.type === "category" && effect.category === categoryKey,
    )
    if (categoryGlobalEffect) {
      activeSpecializations[categoryKey][`Todos`] = categoryGlobalEffect.value
    }
  }
  ;(Object.keys(specializationCategories) as SpecializationCategory[]).forEach(processSpecializationCategory)

  function renderSection(title: string, items: Record<string, number>, emptyMessage: string) {
    const itemsToDisplay = Object.entries(items)
    const hasItems = itemsToDisplay.length > 0

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        {title && <h4 className="font-semibold text-gray-800">{title}</h4>}
        {hasItems ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {itemsToDisplay.map(([name, value]) => (
              <div
                key={name}
                className="flex justify-between items-center bg-white rounded px-2 py-1 text-xs sm:text-sm break-words"
              >
                <span className="text-gray-700">{name}</span>
                <span className="font-bold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs italic">{emptyMessage}</p>
        )}
      </div>
    )
  }

  function renderSimpleListSection(
    title: string,
    selectedNames: string[],
    allItems: { name: string }[],
    emptyMessage: string,
  ) {
    const itemsToDisplay = selectedNames.map((name) => allItems.find((item) => item.name === name)).filter(Boolean) as {
      name: string
    }[]

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        {title && <h4 className="font-semibold text-gray-800">{title}</h4>}
        {itemsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {itemsToDisplay.map((item) => (
              <div key={item.name} className="bg-white rounded px-2 py-1 text-xs sm:text-sm break-words">
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs italic">{emptyMessage}</p>
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
        {title && <h4 className="font-semibold text-gray-800">{title}</h4>}
        {itemsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {itemsToDisplay.map((item) => (
              <div key={item.name} className="bg-white rounded px-2 py-1 text-xs sm:text-sm break-words">
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs italic">{emptyMessage}</p>
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
                {member.type === "semideus" && (
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    Semideus
                  </span>
                )}
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

        <div className="overflow-y-auto max-h-[calc(85vh-160px)] px-2 sm:px-6 py-4 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Atributos</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-white rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-gray-600">Força</div>
                <div className="text-lg font-bold text-gray-900">{getAttributeWithModifiers("force")}</div>
              </div>
              <div className="bg-white rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-gray-600">Determinação</div>
                <div className="text-lg font-bold text-gray-900">{getAttributeWithModifiers("determination")}</div>
              </div>
              <div className="bg-white rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-gray-600">Agilidade</div>
                <div className="text-lg font-bold text-gray-900">{getAttributeWithModifiers("agility")}</div>
              </div>
              <div className="bg-white rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-gray-600">Sabedoria</div>
                <div className="text-lg font-bold text-gray-900">{getAttributeWithModifiers("wisdom")}</div>
              </div>
              <div className="bg-white rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-gray-600">Percepção</div>
                <div className="text-lg font-bold text-gray-900">{getAttributeWithModifiers("perception")}</div>
              </div>
              <div className="bg-white rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-gray-600">Destreza</div>
                <div className="text-lg font-bold text-gray-900">{getAttributeWithModifiers("dexterity")}</div>
              </div>
              <div className="bg-white rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-gray-600">Vigor</div>
                <div className="text-lg font-bold text-gray-900">{getAttributeWithModifiers("vigor")}</div>
              </div>
              <div className="bg-white rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-gray-600">Carisma</div>
                <div className="text-lg font-bold text-gray-900">{getAttributeWithModifiers("charisma")}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Atributos Derivados</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-green-100 rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-green-700">Vitalidade</div>
                <div className="text-lg font-bold text-green-800">{VITALIDADE}</div>
              </div>
              <div className="bg-red-100 rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-red-700">Energia</div>
                <div className="text-lg font-bold text-red-800">{ENERGIA}</div>
              </div>
              <div className="bg-blue-100 rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-blue-700">Mana</div>
                <div className="text-lg font-bold text-blue-800">{MANA}</div>
              </div>
              <div className="bg-purple-100 rounded px-2 py-1 text-center text-xs sm:text-sm">
                <div className="text-xs text-purple-700">Iniciativa</div>
                <div className="text-lg font-bold text-purple-800">{INICIATIVA}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Poderes & Estilos</h4>
            <AccordionSection
              title="Poderes"
              open={accordion.powers}
              onToggle={() => setAccordion((prev) => ({ ...prev, powers: !prev.powers }))}
            >
              {renderSection("", activePowers, "Nenhum poder adquirido")}
            </AccordionSection>
            <AccordionSection
              title="Estilos"
              open={accordion.styles}
              onToggle={() => setAccordion((prev) => ({ ...prev, styles: !prev.styles }))}
            >
              {renderSection("", activeStyles, "Nenhum estilo adquirido")}
            </AccordionSection>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Perícias</h4>
            <AccordionSection
              title="Combate"
              open={accordion.combat}
              onToggle={() => setAccordion((prev) => ({ ...prev, combat: !prev.combat }))}
            >
              {renderSection("", activeCombatSkills, "Nenhuma perícia de combate adquirida")}
            </AccordionSection>
            <AccordionSection
              title="Sociais"
              open={accordion.social}
              onToggle={() => setAccordion((prev) => ({ ...prev, social: !prev.social }))}
            >
              {renderSection("", activeSocialSkills, "Nenhuma perícia social adquirida")}
            </AccordionSection>
            <AccordionSection
              title="Utilidade"
              open={accordion.utility}
              onToggle={() => setAccordion((prev) => ({ ...prev, utility: !prev.utility }))}
            >
              {renderSection("", activeUtilitySkills, "Nenhuma perícia de utilidade adquirida")}
            </AccordionSection>
            <AccordionSection
              title="Complementares"
              open={accordion.complementary}
              onToggle={() => setAccordion((prev) => ({ ...prev, complementary: !prev.complementary }))}
            >
              {renderSection("", activeComplementarySkills, "Nenhuma perícia complementar adquirida")}
            </AccordionSection>
            <AccordionSection
              title="Especialização"
              open={accordion.specialization}
              onToggle={() => setAccordion((prev) => ({ ...prev, specialization: !prev.specialization }))}
            >
              <div className="space-y-4">
                {(Object.keys(specializationCategories) as SpecializationCategory[]).map((categoryKey) => {
                  const skillsToDisplay = activeSpecializations[categoryKey]
                  const hasSkills = Object.keys(skillsToDisplay).length > 0
                  if (!hasSkills) return null
                  return (
                    <div key={categoryKey} className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-700 mb-2">{specializationCategories[categoryKey]}</h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(skillsToDisplay).map(([name, value]) => (
                          <div
                            key={name}
                            className="flex justify-between items-center bg-white rounded px-2 py-1 text-xs sm:text-sm break-words"
                          >
                            <span className="text-gray-700">{name}</span>
                            <span className="font-bold text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {Object.values(activeSpecializations).every((skills) => Object.keys(skills).length === 0) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-xs italic">Nenhuma especialização adquirida</p>
                  </div>
                )}
              </div>
            </AccordionSection>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Vantagens & Desvantagens</h4>
            <AccordionSection
              title="Vantagens"
              open={accordion.advantages}
              onToggle={() => setAccordion((prev) => ({ ...prev, advantages: !prev.advantages }))}
            >
              <AccordionSection
                title="Aptidões"
                open={accordion.abilities}
                onToggle={() => setAccordion((prev) => ({ ...prev, abilities: !prev.abilities }))}
              >
                {renderSimpleListSection("", member.abilities || [], abilities, "Nenhuma aptidão selecionada.")}
              </AccordionSection>
              <AccordionSection
                title="Peculiaridades"
                open={accordion.peculiarities}
                onToggle={() => setAccordion((prev) => ({ ...prev, peculiarities: !prev.peculiarities }))}
              >
                {renderAdvantageDisadvantageSection(
                  "",
                  member.peculiarities || [],
                  allPeculiarities,
                  "Nenhuma peculiaridade selecionada.",
                )}
              </AccordionSection>
            </AccordionSection>
            <AccordionSection
              title="Desvantagens"
              open={accordion.disadvantages}
              onToggle={() => setAccordion((prev) => ({ ...prev, disadvantages: !prev.disadvantages }))}
            >
              <AccordionSection
                title="Inaptidões"
                open={accordion.disabilities}
                onToggle={() => setAccordion((prev) => ({ ...prev, disabilities: !prev.disabilities }))}
              >
                {renderSimpleListSection("", member.disabilities || [], disabilities, "Nenhuma inaptidão selecionada.")}
              </AccordionSection>
              <AccordionSection
                title="Trejeitos"
                open={accordion.trejeitos}
                onToggle={() => setAccordion((prev) => ({ ...prev, trejeitos: !prev.trejeitos }))}
              >
                {renderAdvantageDisadvantageSection(
                  "",
                  member.trejeitos || [],
                  allTrejeitos,
                  "Nenhum trejeito selecionado.",
                )}
              </AccordionSection>
            </AccordionSection>
          </div>
        </div>

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
























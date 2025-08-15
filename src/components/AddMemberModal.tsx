import type React from "react"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Member, SpecializationCategory, AccordionState } from "../constants/rpg.data"
import {
  allPowers,
  allStyles,
  combatSkills,
  socialSkills,
  utilitySkills,
  complementarySkills,
  allDivineParents,
  allPeculiarities,
  allTrejeitos,
  allPerks,
  allHindrances,
  abilities,
  disabilities,
  calculateFinalSkills,
} from "../constants/rpg.data"

import { AddMemberModalLayout } from "./AddMemberModal-components/AddMemberModalLayout"
import { AttributeInput } from "./AddMemberModal-components/AttributeInput"
import { SkillCategoryInput } from "./AddMemberModal-components/SkillCategoryInput"
import { SpecializationCategoryInput } from "./AddMemberModal-components/SpecializationCategoryInput"
import { AdvantageDisadvantageSelector } from "./AddMemberModal-components/AdvantagesDisadvantages"
import { AccordionSection } from "./AddMemberModal-components/AccordionSection"

type Props = {
  teamName: string
  teamColor: string
  onClose: () => void
  onAddMember: (member: Member) => void
  editingMember?: Member | null
}

export default function AddMemberModal({ teamName, teamColor, onClose, onAddMember, editingMember }: Props) {
  const isEditing = !!editingMember

  const [name, setName] = useState(editingMember?.name || "")
  const [type, setType] = useState<"semideus" | "humano" | "monstro">(editingMember?.type || "semideus")
  const [divineParent, setDivineParent] = useState(editingMember?.divineParent || "")

  const [force, setForce] = useState(editingMember?.force || 1)
  const [determination, setDetermination] = useState(editingMember?.determination || 1)
  const [agility, setAgility] = useState(editingMember?.agility || 1)
  const [wisdom, setWisdom] = useState(editingMember?.wisdom || 1)
  const [perception, setPerception] = useState(editingMember?.perception || 1)
  const [dexterity, setDexterity] = useState(editingMember?.dexterity || 1)
  const [vigor, setVigor] = useState(editingMember?.vigor || 1)
  const [charisma, setCharisma] = useState(editingMember?.charisma || 1)

  const [powers, setPowers] = useState<Record<string, number>>(editingMember?.powers || {})
  const [styles, setStyles] = useState<Record<string, number>>(editingMember?.styles || {})

  const [combatSkillsState, setCombatSkillsState] = useState<Record<string, number>>(
    editingMember?.baseSkills?.combat || {},
  )
  const [socialSkillsState, setSocialSkillsState] = useState<Record<string, number>>(
    editingMember?.baseSkills?.social || {},
  )
  const [utilitySkillsState, setUtilitySkillsState] = useState<Record<string, number>>(
    editingMember?.baseSkills?.utility || {},
  )
  const [complementarySkillsState, setComplementarySkillsState] = useState<Record<string, number>>(
    editingMember?.baseSkills?.complementary || {},
  )

  const [specialization, setSpecialization] = useState<{
    languages: Record<string, number>
    arts: Record<string, number>
    knowledge: Record<string, number>
    driving: Record<string, number>
    crafts: Record<string, number>
    sports: Record<string, number>
  }>(
    editingMember?.baseSkills?.specialization || {
      languages: {},
      arts: {},
      knowledge: {},
      driving: {},
      crafts: {},
      sports: {},
    },
  )

  const [newSpecializationInput, setNewSpecializationInput] = useState<Record<SpecializationCategory, string>>({
    languages: "",
    arts: "",
    knowledge: "",
    driving: "",
    crafts: "",
    sports: "",
  })

  const [selectedPeculiarities, setSelectedPeculiarities] = useState<string[]>(editingMember?.peculiarities || [])
  const [selectedTrejeitos, setSelectedTrejeitos] = useState<string[]>(editingMember?.trejeitos || [])
  const [selectedPerks, setSelectedPerks] = useState<string[]>(editingMember?.perks || [])
  const [selectedHindrances, setSelectedHindrances] = useState<string[]>(editingMember?.hindrances || [])
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>(editingMember?.abilities || [])
  const [selectedDisabilities, setSelectedDisabilities] = useState<string[]>(editingMember?.disabilities || [])

  const [divineParentUserSpecializations, setDivineParentUserSpecializations] = useState<Record<string, string>>(
    editingMember?.divineParentUserSpecializations || {},
  )

  const [conductionBonuses, setConductionBonuses] = useState<Record<string, boolean>>(
    editingMember?.conductionBonuses || {},
  )

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
    perks: false,
    hindrances: false,
  })

  const selectedDivineParentData = allDivineParents.find((dp) => dp.name === divineParent)

  useEffect(() => {
    if (selectedDivineParentData) {
      const newUserSpecializations: Record<string, string> = {}
      let hasNewFields = false

      selectedDivineParentData.effects.forEach((effect) => {
        if (effect.requiresUserInput) {
          newUserSpecializations[effect.skillName] =
            editingMember?.divineParentUserSpecializations?.[effect.skillName] || ""
          hasNewFields = true
        }
      })

      if (hasNewFields) {
        setDivineParentUserSpecializations(newUserSpecializations)
      }
    } else {
      setDivineParentUserSpecializations({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divineParent])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      alert("Nome é obrigatório")
      return
    }

    if (type === "semideus" && !divineParent) {
      alert("Selecione um pai/mãe divino(a)")
      return
    }

    if (type === "semideus" && selectedDivineParentData) {
      const requiredSpecializations = selectedDivineParentData.effects.filter((effect) => effect.requiresUserInput)
      for (const effect of requiredSpecializations) {
        const userInput = divineParentUserSpecializations[effect.skillName]
        if (!userInput || !userInput.trim()) {
          alert(`É obrigatório especificar a especialização para "${effect.skillName}"`)
          return
        }
      }
    }

    const { skills, globalEffects } = calculateFinalSkills(
      combatSkillsState,
      socialSkillsState,
      utilitySkillsState,
      complementarySkillsState,
      specialization,
      selectedPeculiarities,
      selectedTrejeitos,
      divineParent,
      divineParentUserSpecializations,
      conductionBonuses,
    )

    const member: Member = {
      id: editingMember?.id || uuidv4(),
      name: name.trim(),
      type,
      divineParent: type === "semideus" ? divineParent : undefined,
      force,
      determination,
      agility,
      wisdom,
      perception,
      dexterity,
      vigor,
      charisma,
      powers,
      styles,
      baseSkills: skills,
      peculiarities: selectedPeculiarities,
      trejeitos: selectedTrejeitos,
      perks: selectedPerks,
      hindrances: selectedHindrances,
      abilities: selectedAbilities,
      disabilities: selectedDisabilities,
      derivedGlobalSkillEffects: globalEffects,
      divineParentUserSpecializations,
      conductionBonuses,
    }

    onAddMember(member)
  }

  return (
    <AddMemberModalLayout
      title={isEditing ? "Editar personagem" : "Adicionar personagem"}
      teamName={teamName}
      teamColor={teamColor}
      onClose={onClose}
      onSubmit={handleSubmit}
      isEditing={isEditing}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "semideus" | "humano" | "monstro")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="semideus">Semideus</option>
              <option value="humano">Humano</option>
              <option value="monstro">Monstro</option>
            </select>
          </div>
        </div>

        {type === "semideus" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Pai/Mãe Divino(a) <span className="text-red-500">*</span>
            </label>
            <select
              value={divineParent}
              onChange={(e) => setDivineParent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="">Selecione...</option>
              {allDivineParents.map((dp) => (
                <option key={dp.name} value={dp.name}>
                  {dp.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedDivineParentData?.effects.some((effect) => effect.requiresUserInput) && (
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-blue-800">Especializações do Pai/Mãe Divino(a)</h4>
            {selectedDivineParentData.effects
              .filter((effect) => effect.requiresUserInput)
              .map((effect) => (
                <div key={effect.skillName} className="space-y-2">
                  <label className="block text-sm font-medium text-blue-700">
                    {effect.skillName} (+{effect.value})
                  </label>
                  <input
                    type="text"
                    value={divineParentUserSpecializations[effect.skillName] || ""}
                    onChange={(e) =>
                      setDivineParentUserSpecializations((prev) => ({
                        ...prev,
                        [effect.skillName]: e.target.value,
                      }))
                    }
                    placeholder={effect.userInputPlaceholder}
                    className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    autoComplete="off"
                  />
                </div>
              ))}
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-4">Atributos</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AttributeInput label="Força" value={force} setValue={setForce} teamColor={teamColor} required />
            <AttributeInput
              label="Determinação"
              value={determination}
              setValue={setDetermination}
              teamColor={teamColor}
              required
            />
            <AttributeInput label="Agilidade" value={agility} setValue={setAgility} teamColor={teamColor} required />
            <AttributeInput label="Sabedoria" value={wisdom} setValue={setWisdom} teamColor={teamColor} required />
            <AttributeInput
              label="Percepção"
              value={perception}
              setValue={setPerception}
              teamColor={teamColor}
              required
            />
            <AttributeInput label="Destreza" value={dexterity} setValue={setDexterity} teamColor={teamColor} required />
            <AttributeInput label="Vigor" value={vigor} setValue={setVigor} teamColor={teamColor} required />
            <AttributeInput label="Carisma" value={charisma} setValue={setCharisma} teamColor={teamColor} required />
          </div>
        </div>

        <AccordionSection
          title="Poderes & Estilos"
          open={accordion.powers}
          onToggle={() => setAccordion((prev) => ({ ...prev, powers: !prev.powers }))}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <h5 className="text-md font-semibold text-gray-700">Poderes</h5>
              <SkillCategoryInput skills={allPowers} values={powers} setValues={setPowers} teamColor={teamColor} />
            </div>
            <div className="space-y-3">
              <h5 className="text-md font-semibold text-gray-700">Estilos</h5>
              <SkillCategoryInput skills={allStyles} values={styles} setValues={setStyles} teamColor={teamColor} />
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Perícias"
          open={accordion.skills}
          onToggle={() => setAccordion((prev) => ({ ...prev, skills: !prev.skills }))}
        >
          <div className="space-y-6">
            <AccordionSection
              title="Combate"
              open={accordion.combat}
              onToggle={() => setAccordion((prev) => ({ ...prev, combat: !prev.combat }))}
            >
              <SkillCategoryInput
                skills={combatSkills}
                values={combatSkillsState}
                setValues={setCombatSkillsState}
                teamColor={teamColor}
              />
            </AccordionSection>

            <AccordionSection
              title="Sociais"
              open={accordion.social}
              onToggle={() => setAccordion((prev) => ({ ...prev, social: !prev.social }))}
            >
              <SkillCategoryInput
                skills={socialSkills}
                values={socialSkillsState}
                setValues={setSocialSkillsState}
                teamColor={teamColor}
              />
            </AccordionSection>

            <AccordionSection
              title="Utilidade"
              open={accordion.utility}
              onToggle={() => setAccordion((prev) => ({ ...prev, utility: !prev.utility }))}
            >
              <SkillCategoryInput
                skills={utilitySkills}
                values={utilitySkillsState}
                setValues={setUtilitySkillsState}
                teamColor={teamColor}
              />
            </AccordionSection>

            <AccordionSection
              title="Complementares"
              open={accordion.complementary}
              onToggle={() => setAccordion((prev) => ({ ...prev, complementary: !prev.complementary }))}
            >
              <SkillCategoryInput
                skills={complementarySkills}
                values={complementarySkillsState}
                setValues={setComplementarySkillsState}
                teamColor={teamColor}
              />
            </AccordionSection>

            <AccordionSection
              title="Especialização"
              open={accordion.specialization}
              onToggle={() => setAccordion((prev) => ({ ...prev, specialization: !prev.specialization }))}
            >
              <div className="space-y-4">
                {(["languages", "arts", "knowledge", "driving", "crafts", "sports"] as SpecializationCategory[]).map(
                  (category) => (
                    <SpecializationCategoryInput
                      key={category}
                      category={category}
                      specialization={specialization}
                      setSpecialization={setSpecialization}
                      newSpecializationInput={newSpecializationInput[category]}
                      setNewSpecializationInput={setNewSpecializationInput}
                      teamColor={teamColor}
                      accordionState={accordion}
                      setAccordionState={setAccordion}
                      conductionBonuses={conductionBonuses}
                      setConductionBonuses={setConductionBonuses}
                      divineParent={divineParent}
                    />
                  ),
                )}
              </div>
            </AccordionSection>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Vantagens & Desvantagens"
          open={accordion.advantages}
          onToggle={() => setAccordion((prev) => ({ ...prev, advantages: !prev.advantages }))}
        >
          <div className="space-y-6">
            <AccordionSection
              title="Vantagens"
              open={accordion.advantages}
              onToggle={() => setAccordion((prev) => ({ ...prev, advantages: !prev.advantages }))}
            >
              <div className="space-y-6">
                <AccordionSection
                  title="Aptidões"
                  open={accordion.abilities}
                  onToggle={() => setAccordion((prev) => ({ ...prev, abilities: !prev.abilities }))}
                >
                  <AdvantageDisadvantageSelector
                    label=""
                    items={abilities}
                    selectedItems={selectedAbilities}
                    setSelectedItems={setSelectedAbilities}
                    teamColor={teamColor}
                  />
                </AccordionSection>

                <AccordionSection
                  title="Peculiaridades"
                  open={accordion.peculiarities}
                  onToggle={() => setAccordion((prev) => ({ ...prev, peculiarities: !prev.peculiarities }))}
                >
                  <AdvantageDisadvantageSelector
                    label=""
                    items={allPeculiarities}
                    selectedItems={selectedPeculiarities}
                    setSelectedItems={setSelectedPeculiarities}
                    teamColor={teamColor}
                  />
                </AccordionSection>

                <AccordionSection
                  title="Regalias"
                  open={accordion.perks}
                  onToggle={() => setAccordion((prev) => ({ ...prev, perks: !prev.perks }))}
                >
                  <AdvantageDisadvantageSelector
                    label=""
                    items={allPerks}
                    selectedItems={selectedPerks}
                    setSelectedItems={setSelectedPerks}
                    teamColor={teamColor}
                  />
                </AccordionSection>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Desvantagens"
              open={accordion.disadvantages}
              onToggle={() => setAccordion((prev) => ({ ...prev, disadvantages: !prev.disadvantages }))}
            >
              <div className="space-y-6">
                <AccordionSection
                  title="Inaptidões"
                  open={accordion.disabilities}
                  onToggle={() => setAccordion((prev) => ({ ...prev, disabilities: !prev.disabilities }))}
                >
                  <AdvantageDisadvantageSelector
                    label=""
                    items={disabilities}
                    selectedItems={selectedDisabilities}
                    setSelectedItems={setSelectedDisabilities}
                    teamColor={teamColor}
                  />
                </AccordionSection>

                <AccordionSection
                  title="Trejeitos"
                  open={accordion.trejeitos}
                  onToggle={() => setAccordion((prev) => ({ ...prev, trejeitos: !prev.trejeitos }))}
                >
                  <AdvantageDisadvantageSelector
                    label=""
                    items={allTrejeitos}
                    selectedItems={selectedTrejeitos}
                    setSelectedItems={setSelectedTrejeitos}
                    teamColor={teamColor}
                  />
                </AccordionSection>

                <AccordionSection
                  title="Obstáculos"
                  open={accordion.hindrances}
                  onToggle={() => setAccordion((prev) => ({ ...prev, hindrances: !prev.hindrances }))}
                >
                  <AdvantageDisadvantageSelector
                    label=""
                    items={allHindrances}
                    selectedItems={selectedHindrances}
                    setSelectedItems={setSelectedHindrances}
                    teamColor={teamColor}
                  />
                </AccordionSection>
              </div>
            </AccordionSection>
          </div>
        </AccordionSection>
      </div>
    </AddMemberModalLayout>
  )
}

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { AttributeInput } from "./AddMemberModal-components/AttributeInput"
import { AccordionSection } from "./AddMemberModal-components/AccordionSection"
import { SkillCategoryInput } from "./AddMemberModal-components/SkillCategoryInput"
import { SpecializationCategoryInput } from "./AddMemberModal-components/SpecializationCategoryInput"
import { AddMemberModalLayout } from "./AddMemberModal-components/AddMemberModalLayout"
import { AdvantageDisadvantageSelector } from "./AddMemberModal-components/AdvantagesDisadvantages"
import {
  type Member,
  type SpecializationCategory,
  type AccordionState,
  allPowers,
  allStyles,
  combatSkills,
  socialSkills,
  utilitySkills,
  complementarySkills,
  specializationCategories,
  allPeculiarities,
  allTrejeitos,
  calculateFinalSkills,
  allDivineParents,
  abilities,
  disabilities
} from "../constants/rpg.data"

type Props = {
  teamName: string
  teamColor: string
  onClose: () => void
  onAddMember: (member: Member) => void
  editingMember?: Member | null
}

export default function AddMemberModal({ teamName, teamColor, onClose, onAddMember, editingMember = null }: Props) {
  const [name, setName] = useState("")
  const [type, setType] = useState<"semideus" | "humano" | "monstro">("semideus")
  const [divineParent, setDivineParent] = useState("")
  const [divineParentUserSpecializations, setDivineParentUserSpecializations] = useState<Record<string, string>>({})
  const [force, setForce] = useState(0)
  const [determination, setDetermination] = useState(0)
  const [agility, setAgility] = useState(0)
  const [wisdom, setWisdom] = useState(0)
  const [perception, setPerception] = useState(0)
  const [dexterity, setDexterity] = useState(0)
  const [vigor, setVigor] = useState(0)
  const [charisma, setCharisma] = useState(0)
  const [powers, setPowers] = useState<Record<string, number>>({})
  const [styles, setStyles] = useState<Record<string, number>>({})
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>([])
  const [selectedDisabilities, setSelectedDisabilities] = useState<string[]>([])

  const [combat, setCombat] = useState<Record<string, number>>({})
  const [social, setSocial] = useState<Record<string, number>>({})
  const [utility, setUtility] = useState<Record<string, number>>({})
  const [complementary, setComplementary] = useState<Record<string, number>>({})

  const [specialization, setSpecialization] = useState<{
    languages: Record<string, number>
    arts: Record<string, number>
    knowledge: Record<string, number>
    driving: Record<string, number>
    crafts: Record<string, number>
    sports: Record<string, number>
  }>({
    languages: {},
    arts: {},
    knowledge: {},
    driving: {},
    crafts: {},
    sports: {},
  })

  const [newSpecializationInputs, setNewSpecializationInputs] = useState<Record<SpecializationCategory, string>>({
    languages: "",
    arts: "",
    knowledge: "",
    driving: "",
    crafts: "",
    sports: "",
  })

  const [selectedPeculiarities, setSelectedPeculiarities] = useState<string[]>([])
  const [selectedTrejeitos, setSelectedTrejeitos] = useState<string[]>([])

  const [accordion, setAccordion] = useState<AccordionState>({
    powers: false,
    styles: false,
    pericias: false,
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
    peculiarities: false,
    disadvantages: false,
    trejeitos: false,
    abilities: false,
    disabilities: false,
  })

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name)
      setType(editingMember.type)
      setDivineParent(editingMember.divineParent || "")
      setDivineParentUserSpecializations(editingMember.divineParentUserSpecializations || {})
      setForce(editingMember.force)
      setDetermination(editingMember.determination)
      setAgility(editingMember.agility)
      setWisdom(editingMember.wisdom)
      setPerception(editingMember.perception)
      setDexterity(editingMember.dexterity)
      setVigor(editingMember.vigor)
      setCharisma(editingMember.charisma)
      setPowers(editingMember.powers || {})
      setStyles(editingMember.styles || {})
      setCombat(editingMember.baseSkills?.combat || {})
      setSocial(editingMember.baseSkills?.social || {})
      setUtility(editingMember.baseSkills?.utility || {})
      setComplementary(editingMember.baseSkills?.complementary || {})
      setSpecialization(
        editingMember.baseSkills?.specialization || {
          languages: {},
          arts: {},
          knowledge: {},
          driving: {},
          crafts: {},
          sports: {},
        },
      )
      setSelectedPeculiarities(editingMember.peculiarities || [])
      setSelectedTrejeitos(editingMember.trejeitos || [])
      setSelectedAbilities(editingMember.abilities || [])
      setSelectedDisabilities(editingMember.disabilities || [])
    } else {
      setName("")
      setType("semideus")
      setDivineParent("")
      setDivineParentUserSpecializations({})
      setForce(0)
      setDetermination(0)
      setAgility(0)
      setWisdom(0)
      setPerception(0)
      setDexterity(0)
      setVigor(0)
      setCharisma(0)
      setPowers({})
      setStyles({})
      setCombat({})
      setSocial({})
      setUtility({})
      setComplementary({})
      setSpecialization({
        languages: {},
        arts: {},
        knowledge: {},
        driving: {},
        crafts: {},
        sports: {},
      })
      setSelectedPeculiarities([])
      setSelectedTrejeitos([])
    }
    setNewSpecializationInputs({
      languages: "",
      arts: "",
      knowledge: "",
      driving: "",
      crafts: "",
      sports: "",
    })
  }, [editingMember])

  const divineParentEffectsRequiringInput = useMemo(() => {
    if (type !== "semideus" || !divineParent) return []
    const selectedParent = allDivineParents.find((dp) => dp.name === divineParent)
    return selectedParent?.effects.filter((effect) => effect.requiresUserInput) || []
  }, [type, divineParent])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      alert("Preencha o nome do membro.")
      return
    }
    if (type === "semideus" && !divineParent) {
      alert("Selecione a filiação divina para semideuses.")
      return
    }

    for (const effect of divineParentEffectsRequiringInput) {
      if (!divineParentUserSpecializations[effect.skillName]?.trim()) {
        alert(`Por favor, especifique a perícia para "${effect.skillName}" da sua filiação divina.`)
        return
      }
    }

    const attributeNameMap: Record<string, string> = {
      force: "Força",
      determination: "Determinação",
      agility: "Agilidade",
      wisdom: "Sabedoria",
      perception: "Percepção",
      dexterity: "Destreza",
      vigor: "Vigor",
      charisma: "Carisma",
    }

    const attributes = { force, determination, agility, wisdom, perception, dexterity, vigor, charisma }
    const missingAttributes = Object.entries(attributes).filter(([, value]) => value === 0)

    if (missingAttributes.length > 0) {
      const missingNames = missingAttributes.map(([name]) => attributeNameMap[name] || name).join(", ")
      alert(`Por favor, preencha todos os atributos. Atributos faltando: ${missingNames}.`)
      return
    }

    const { globalEffects } = calculateFinalSkills(
      combat,
      social,
      utility,
      complementary,
      specialization,
      selectedPeculiarities,
      selectedTrejeitos,
      divineParent,
      divineParentUserSpecializations,
    )

    const memberToSave: Member = {
      id: editingMember ? editingMember.id : crypto.randomUUID(),
      name: name.trim(),
      type,
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
      baseSkills: {
        combat,
        social,
        utility,
        complementary,
        specialization,
      },
      peculiarities: selectedPeculiarities,
      trejeitos: selectedTrejeitos,
      derivedGlobalSkillEffects: globalEffects,
      divineParentUserSpecializations: divineParentUserSpecializations,
      abilities: selectedAbilities,
      disabilities: selectedDisabilities
    }

    if (type === "semideus") memberToSave.divineParent = divineParent.trim()
    onAddMember(memberToSave)
  }

  const divineParentAutoSpecializations: Record<string, { skillName: string; value: string }> = {
    "Afrodite & Vênus": { skillName: "Idiomas", value: "Francês" },
    "Quione": { skillName: "Idiomas", value: "Francês" },
    "Eros & Cupido": { skillName: "Idiomas", value: "Espanhol" },
  }

  return (
    <AddMemberModalLayout
      title={editingMember ? "Editar membro" : "Adicionar membro"}
      teamName={teamName}
      teamColor={teamColor}
      onClose={onClose}
      onSubmit={handleSubmit}
      isEditing={!!editingMember}
    >
      {/* Nome e Tipo lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "semideus" | "humano" | "monstro")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="semideus">Semideus</option>
            <option value="humano">Humano</option>
            <option value="monstro">Monstro</option>
          </select>
        </div>
      </div>

      {type === "semideus" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filiação divina</label>
            <select
              value={divineParent}
              onChange={(e) => {
                setDivineParent(e.target.value)
                setDivineParentUserSpecializations({})
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required={type === "semideus"}
            >
              <option value="">Selecionar</option>
              {allDivineParents.map((dp) => (
                <option key={dp.name} value={dp.name}>
                  {dp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campos para especializações de filiação divina */}
          {divineParentEffectsRequiringInput.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Especializações da Filiação Divina</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {divineParentEffectsRequiringInput.map((effect) => {
                  const autoSpec = divineParentAutoSpecializations[divineParent]
                  if (
                    autoSpec &&
                    effect.skillName === autoSpec.skillName
                  ) {
                    setTimeout(() => {
                      setDivineParentUserSpecializations((prev) => ({
                        ...prev,
                        [effect.skillName]: autoSpec.value,
                      }))
                    }, 0)
                    return (
                      <div key={effect.skillName}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {effect.skillName}:
                        </label>
                        <input
                          type="text"
                          value={autoSpec.value}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
                        />
                      </div>
                    )
                  }
                  return (
                    <div key={effect.skillName}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {effect.skillName}:
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Atributos */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Atributos</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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

      {/* Accordion - Poderes */}
      <AccordionSection
        title="Poderes"
        open={accordion.powers}
        onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, powers: !prev.powers }))}
      >
        <SkillCategoryInput skills={allPowers} values={powers} setValues={setPowers} teamColor={teamColor} />
      </AccordionSection>

      {/* Accordion - Estilos */}
      <AccordionSection
        title="Estilos"
        open={accordion.styles}
        onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, styles: !prev.styles }))}
      >
        <SkillCategoryInput skills={allStyles} values={styles} setValues={setStyles} teamColor={teamColor} />
      </AccordionSection>

      {/* Accordion principal de Perícias */}
      <AccordionSection
        title="Perícias"
        open={accordion.pericias}
        onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, pericias: !prev.pericias }))}
      >
        <div className="space-y-4">
          {/* Perícias de Combate */}
          <AccordionSection
            title="Perícias de Combate"
            open={accordion.combat}
            onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, combat: !prev.combat }))}
          >
            <SkillCategoryInput skills={combatSkills} values={combat} setValues={setCombat} teamColor={teamColor} />
          </AccordionSection>

          {/* Perícias Sociais */}
          <AccordionSection
            title="Perícias Sociais"
            open={accordion.social}
            onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, social: !prev.social }))}
          >
            <SkillCategoryInput skills={socialSkills} values={social} setValues={setSocial} teamColor={teamColor} />
          </AccordionSection>

          {/* Perícias de Utilidade */}
          <AccordionSection
            title="Perícias de Utilidade"
            open={accordion.utility}
            onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, utility: !prev.utility }))}
          >
            <SkillCategoryInput skills={utilitySkills} values={utility} setValues={setUtility} teamColor={teamColor} />
          </AccordionSection>

          {/* Perícias Complementares */}
          <AccordionSection
            title="Perícias Complementares"
            open={accordion.complementary}
            onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, complementary: !prev.complementary }))}
          >
            <SkillCategoryInput
              skills={complementarySkills}
              values={complementary}
              setValues={setComplementary}
              teamColor={teamColor}
            />
          </AccordionSection>

          {/* Perícias de Especialização */}
          <AccordionSection
            title="Perícias de Especialização"
            open={accordion.specialization}
            onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, specialization: !prev.specialization }))}
          >
            <div className="space-y-4">
              {(Object.keys(specializationCategories) as SpecializationCategory[]).map((category) => (
                <SpecializationCategoryInput
                  key={category}
                  category={category}
                  specialization={specialization}
                  setSpecialization={setSpecialization}
                  newSpecializationInput={newSpecializationInputs[category]}
                  setNewSpecializationInput={setNewSpecializationInputs}
                  teamColor={teamColor}
                  accordionState={accordion}
                  setAccordionState={setAccordion}
                />
              ))}
            </div>
          </AccordionSection>
        </div>
      </AccordionSection>

      {/* Accordion - Vantagens */}
      <AccordionSection
        title="Vantagens"
        open={accordion.advantages}
        onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, advantages: !prev.advantages }))}
      >
        <div className="space-y-4">
          <AccordionSection
            title="Aptidões"
            open={accordion.abilities}
            onToggle={() => setAccordion((prev) => ({ ...prev, abilities: !prev.abilities }))}
          >
            <AdvantageDisadvantageSelector
              label="Selecione as Aptidões"
              items={abilities.map(a => ({ name: a.name }))}
              selectedItems={selectedAbilities}
              setSelectedItems={setSelectedAbilities}
              teamColor={teamColor}
            />
          </AccordionSection>
          {/* Nested Accordion - Peculiaridades */}
          <AccordionSection
            title="Peculiaridades"
            open={accordion.peculiarities}
            onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, peculiarities: !prev.peculiarities }))}
          >
            <AdvantageDisadvantageSelector
              label="Selecione as Peculiaridades"
              items={allPeculiarities}
              selectedItems={selectedPeculiarities}
              setSelectedItems={setSelectedPeculiarities}
              teamColor={teamColor}
            />
          </AccordionSection>
          {/* Aptidões e Regalias virão aqui futuramente */}
        </div>
      </AccordionSection>

      {/* Accordion - Desvantagens */}
      <AccordionSection
        title="Desvantagens"
        open={accordion.disadvantages}
        onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, disadvantages: !prev.disadvantages }))}
      >
        <div className="space-y-4">
          <AccordionSection
            title="Inaptidões"
            open={accordion.disabilities}
            onToggle={() => setAccordion((prev) => ({ ...prev, disabilities: !prev.disabilities }))}
          >
            <AdvantageDisadvantageSelector
              label="Selecione as Inaptidões"
              items={disabilities.map(a => ({ name: a.name }))}
              selectedItems={selectedDisabilities}
              setSelectedItems={setSelectedDisabilities}
              teamColor={teamColor}
            />
          </AccordionSection>

          {/* Nested Accordion - Trejeitos */}
          <AccordionSection
            title="Trejeitos"
            open={accordion.trejeitos}
            onToggle={() => setAccordion((prev: AccordionState) => ({ ...prev, trejeitos: !prev.trejeitos }))}
          >
            <AdvantageDisadvantageSelector
              label="Selecione os Trejeitos"
              items={allTrejeitos}
              selectedItems={selectedTrejeitos}
              setSelectedItems={setSelectedTrejeitos}
              teamColor={teamColor}
            />
          </AccordionSection>
          {/* Inaptidões e Obstáculos virão aqui futuramente */}
        </div>
      </AccordionSection>
    </AddMemberModalLayout>
  )
}






















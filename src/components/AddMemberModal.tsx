import type React from "react"
import { useState, useEffect } from "react"
import { AttributeInput } from "./AddMemberModal-components/AttributeInput"
import { AccordionSection } from "./AddMemberModal-components/AccordionSection"
import { SkillCategoryInput } from "./AddMemberModal-components/SkillCategoryInput"
import { SpecializationCategoryInput } from "./AddMemberModal-components/SpecializationCategoryInput"
import { AddMemberModalLayout } from "./AddMemberModal-components/AddMemberModalLayout"
import {
  type Member,
  type SpecializationCategory,
  allPowers,
  allStyles,
  combatSkills,
  socialSkills,
  utilitySkills,
  complementarySkills,
  specializationCategories,
} from "./../constants/rpg.data"

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

  // Perícias com estado para cada categoria
  const [combat, setCombat] = useState<Record<string, number>>({})
  const [social, setSocial] = useState<Record<string, number>>({})
  const [utility, setUtility] = useState<Record<string, number>>({})
  const [complementary, setComplementary] = useState<Record<string, number>>({})

  // Especializações organizadas por categoria
  const [specialization, setSpecialization] = useState<{
    languages: Record<string, number>
    arts: Record<string, number>
    knowledge: Record<string, number>
    driving: Record<string, number>
    crafts: Record<string, number>
  }>({
    languages: {},
    arts: {},
    knowledge: {},
    driving: {},
    crafts: {},
  })

  // Estados para inputs de nova especialização por categoria
  const [newSpecializationInputs, setNewSpecializationInputs] = useState<Record<SpecializationCategory, string>>({
    languages: "",
    arts: "",
    knowledge: "",
    driving: "",
    crafts: "",
  })

  // Accordion estados
  const [accordion, setAccordion] = useState({
    powers: false,
    styles: false,
    combat: false,
    social: false,
    utility: false,
    complementary: false,
    specialization: false,
    // Sub-accordions para cada categoria de especialização
    languages: false,
    arts: false,
    knowledge: false,
    driving: false,
    crafts: false,
  })

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name)
      setType(editingMember.type)
      setDivineParent(editingMember.divineParent || "")
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
      setCombat(editingMember.skills?.combat || {})
      setSocial(editingMember.skills?.social || {})
      setUtility(editingMember.skills?.utility || {})
      setComplementary(editingMember.skills?.complementary || {})
      setSpecialization(
        editingMember.skills?.specialization || {
          languages: {},
          arts: {},
          knowledge: {},
          driving: {},
          crafts: {},
        },
      )
    } else {
      // Resetar tudo
      setName("")
      setType("semideus")
      setDivineParent("")
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
      })
    }
    setNewSpecializationInputs({
      languages: "",
      arts: "",
      knowledge: "",
      driving: "",
      crafts: "",
    })
  }, [editingMember])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return alert("Preencha o nome")
    if (type === "semideus" && !divineParent.trim()) return alert("Preencha a filiação divina")

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
      skills: {
        combat,
        social,
        utility,
        complementary,
        specialization,
      },
    }

    if (type === "semideus") memberToSave.divineParent = divineParent.trim()
    onAddMember(memberToSave)
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
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Filiação divina</label>
          <input
            value={divineParent}
            onChange={(e) => setDivineParent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required={type === "semideus"}
          />
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
        onToggle={() => setAccordion((prev) => ({ ...prev, powers: !prev.powers }))}
      >
        <SkillCategoryInput skills={allPowers} values={powers} setValues={setPowers} teamColor={teamColor} />
      </AccordionSection>

      {/* Accordion - Estilos */}
      <AccordionSection
        title="Estilos"
        open={accordion.styles}
        onToggle={() => setAccordion((prev) => ({ ...prev, styles: !prev.styles }))}
      >
        <SkillCategoryInput skills={allStyles} values={styles} setValues={setStyles} teamColor={teamColor} />
      </AccordionSection>

      {/* Accordion - Perícias */}
      <AccordionSection
        title="Perícias de Combate"
        open={accordion.combat}
        onToggle={() => setAccordion((prev) => ({ ...prev, combat: !prev.combat }))}
      >
        <SkillCategoryInput skills={combatSkills} values={combat} setValues={setCombat} teamColor={teamColor} />
      </AccordionSection>

      <AccordionSection
        title="Perícias Sociais"
        open={accordion.social}
        onToggle={() => setAccordion((prev) => ({ ...prev, social: !prev.social }))}
      >
        <SkillCategoryInput skills={socialSkills} values={social} setValues={setSocial} teamColor={teamColor} />
      </AccordionSection>

      <AccordionSection
        title="Perícias de Utilidade"
        open={accordion.utility}
        onToggle={() => setAccordion((prev) => ({ ...prev, utility: !prev.utility }))}
      >
        <SkillCategoryInput skills={utilitySkills} values={utility} setValues={setUtility} teamColor={teamColor} />
      </AccordionSection>

      <AccordionSection
        title="Perícias Complementares"
        open={accordion.complementary}
        onToggle={() => setAccordion((prev) => ({ ...prev, complementary: !prev.complementary }))}
      >
        <SkillCategoryInput
          skills={complementarySkills}
          values={complementary}
          setValues={setComplementary}
          teamColor={teamColor}
        />
      </AccordionSection>

      {/* Accordion - Perícias de Especialização */}
      <AccordionSection
        title="Perícias de Especialização"
        open={accordion.specialization}
        onToggle={() => setAccordion((prev) => ({ ...prev, specialization: !prev.specialization }))}
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
    </AddMemberModalLayout>
  )
}
















"use client"

import type React from "react"
import { useState, useEffect } from "react"

export type Member = {
  id: string
  name: string
  type: "semideus" | "humano" | "monstro"
  divineParent?: string
  force: number
  determination: number
  agility: number
  wisdom: number
  perception: number
  dexterity: number
  vigor: number
  charisma: number
  powers?: Record<string, number>
  styles?: Record<string, number>
  skills?: {
    combat: Record<string, number>
    social: Record<string, number>
    utility: Record<string, number>
    complementary: Record<string, number>
    specialization: {
      languages: Record<string, number>
      arts: Record<string, number>
      knowledge: Record<string, number>
      driving: Record<string, number>
      crafts: Record<string, number>
    }
  }
}

type Props = {
  teamName: string
  teamColor: string
  onClose: () => void
  onAddMember: (member: Member) => void
  editingMember?: Member | null
}

const allPowers = [
  "Hidrocinese",
  "Pirocinese",
  "Aerocinese",
  "Geocinese",
  "Umbracinese",
  "Eletrocinese",
  "Criocinese",
  "Fitocinese",
  "Toxicinese",
  "Fotocinese",
  "Psíquico",
  "Dádiva",
  "Patrocínio",
  "Praga",
  "Metamagia",
  "Neutralização",
  "Debilitação",
  "Purificação",
  "Regeneração",
  "Viacinese",
  "Transmutação",
  "Instinto de Batalha",
  "Amplificação",
  "Frenese de Batalha",
  "Mimetismo",
  "Invocação",
]

const allStyles = [
  "Vanguarda",
  "Baluarte",
  "Devastador",
  "Duelista",
  "Controlador",
  "Dual",
  "Contra-atacante",
  "Atirador de Precisão",
  "Atiador de Repetição",
  "Peleja",
  "Grito de Guerra",
  "Deterioração",
  "Exaurimento",
]

const combatSkills = ["Luta", "Pontaria", "Salvaguarda", "Arcano", "Anulação", "Constrição", "Bloqueio", "Resistência"]
const socialSkills = ["Lábia", "Intimidação", "Persuasão", "Empatia", "Sedução"]
const utilitySkills = ["Segurança", "Furtividade", "Computação", "Investigação", "Prestidigitação"]
const complementarySkills = ["Sobrevivência", "Acrobacia", "Atletismo", "Forja", "Medicina"]

// Categorias de especialização
const specializationCategories = {
  languages: "Idiomas",
  arts: "Artes",
  knowledge: "Conhecimento",
  driving: "Condução",
  crafts: "Ofícios",
} as const

type SpecializationCategory = keyof typeof specializationCategories

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

  // Função para adicionar nova especialização em uma categoria específica
  function handleAddSpecialization(category: SpecializationCategory) {
    const inputValue = newSpecializationInputs[category]
    if (!inputValue.trim()) return

    const trimmedName = inputValue.trim()
    if (specialization[category][trimmedName] !== undefined) {
      alert("Esta especialização já existe nesta categoria!")
      return
    }

    setSpecialization((prev) => ({
      ...prev,
      [category]: { ...prev[category], [trimmedName]: 1 },
    }))

    setNewSpecializationInputs((prev) => ({
      ...prev,
      [category]: "",
    }))
  }

  // Função para remover especialização de uma categoria específica
  function handleRemoveSpecialization(category: SpecializationCategory, skillName: string) {
    setSpecialization((prev) => {
      const newCategorySkills = { ...prev[category] }
      delete newCategorySkills[skillName]
      return {
        ...prev,
        [category]: newCategorySkills,
      }
    })
  }

  // Reutilizável para as bolinhas de 0 a 5 (0 = nenhuma selecionada)
  function renderBolinhas(label: string, value: number, setValue: (val: number) => void, required = false) {
    return (
      <div key={label} className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setValue(val)}
              className={`w-8 h-8 rounded-full border-2 text-sm font-bold flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                value >= val && val !== 0 ? "shadow-md transform scale-105" : "hover:border-gray-400 hover:shadow-sm"
              }`}
              style={{
                backgroundColor: value >= val && val !== 0 ? teamColor : "white",
                color: value >= val && val !== 0 ? "white" : "#6B7280",
                borderColor: value >= val && val !== 0 ? teamColor : "#D1D5DB",
              }}
              title={val === 0 ? "Nenhum" : String(val)}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Accordion moderno com gradiente e sombras
  function renderAccordionSection(title: string, open: boolean, toggle: () => void, children: React.ReactNode) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
        <button
          type="button"
          onClick={toggle}
          className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 group cursor-pointer"
          aria-expanded={open}
        >
          <span className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">{title}</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${open ? "bg-green-500" : "bg-gray-400"}`}
            />
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 text-gray-600 group-hover:text-gray-800 ${
                open ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
        {open && <div className="p-4 bg-white border-t border-gray-100">{children}</div>}
      </div>
    )
  }

  // Renderização das perícias com bolinhas
  function renderSkillCategory(
    skills: string[],
    values: Record<string, number>,
    setValues: React.Dispatch<React.SetStateAction<Record<string, number>>>,
  ) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill} className="bg-gray-50 rounded-lg p-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{skill}</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() =>
                    setValues((prev) => {
                      const newVal = val === 0 ? 0 : val
                      return { ...prev, [skill]: newVal }
                    })
                  }
                  className={`w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                    (values[skill] || 0) >= val && val !== 0
                      ? "shadow-md transform scale-105"
                      : "hover:border-gray-400 hover:shadow-sm"
                  }`}
                  style={{
                    backgroundColor: (values[skill] || 0) >= val && val !== 0 ? teamColor : "white",
                    color: (values[skill] || 0) >= val && val !== 0 ? "white" : "#6B7280",
                    borderColor: (values[skill] || 0) >= val && val !== 0 ? teamColor : "#D1D5DB",
                  }}
                  title={val === 0 ? "Nenhum" : String(val)}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Renderização de uma categoria de especialização específica
  function renderSpecializationCategory(category: SpecializationCategory) {
    const categorySkills = Object.keys(specialization[category])
    const categoryName = specializationCategories[category]

    return renderAccordionSection(
      categoryName,
      accordion[category],
      () => setAccordion((prev) => ({ ...prev, [category]: !prev[category] })),
      <div className="space-y-4">
        {/* Input para adicionar nova especialização nesta categoria */}
        <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newSpecializationInputs[category]}
            onChange={(e) =>
              setNewSpecializationInputs((prev) => ({
                ...prev,
                [category]: e.target.value,
              }))
            }
            placeholder={`Digite uma especialização em ${categoryName.toLowerCase()} (ex: ${getPlaceholderExample(category)})`}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddSpecialization(category)
              }
            }}
          />
          <button
            type="button"
            onClick={() => handleAddSpecialization(category)}
            className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-md hover:scale-105"
            style={{ backgroundColor: teamColor }}
          >
            Adicionar
          </button>
        </div>

        {/* Lista de especializações existentes nesta categoria */}
        {categorySkills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categorySkills.map((skill) => (
              <div key={skill} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">{skill}</label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialization(category, skill)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors"
                    title="Remover especialização"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() =>
                        setSpecialization((prev) => ({
                          ...prev,
                          [category]: { ...prev[category], [skill]: val },
                        }))
                      }
                      className={`w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                        (specialization[category][skill] || 0) >= val && val !== 0
                          ? "shadow-md transform scale-105"
                          : "hover:border-gray-400 hover:shadow-sm"
                      }`}
                      style={{
                        backgroundColor:
                          (specialization[category][skill] || 0) >= val && val !== 0 ? teamColor : "white",
                        color: (specialization[category][skill] || 0) >= val && val !== 0 ? "white" : "#6B7280",
                        borderColor: (specialization[category][skill] || 0) >= val && val !== 0 ? teamColor : "#D1D5DB",
                      }}
                      title={val === 0 ? "Nenhum" : String(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {categorySkills.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Nenhuma especialização em {categoryName.toLowerCase()} adicionada.</p>
          </div>
        )}
      </div>,
    )
  }

  // Função para obter exemplos de placeholder por categoria
  function getPlaceholderExample(category: SpecializationCategory): string {
    const examples = {
      languages: "Inglês, Francês, Japonês",
      arts: "Piano, Pintura, Dança",
      knowledge: "História, Medicina, Astronomia",
      driving: "Carro, Moto, Caminhão",
      crafts: "Marcenaria, Culinária, Costura",
    }
    return examples[category]
  }

  return (
    <>
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
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">
              {editingMember ? "Editar membro" : "Adicionar membro"} à equipe{" "}
              <span style={{ color: teamColor }} className="font-extrabold">
                {teamName}
              </span>
            </h3>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-120px)] px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  {renderBolinhas("Força", force, setForce, true)}
                  {renderBolinhas("Determinação", determination, setDetermination, true)}
                  {renderBolinhas("Agilidade", agility, setAgility, true)}
                  {renderBolinhas("Sabedoria", wisdom, setWisdom, true)}
                  {renderBolinhas("Percepção", perception, setPerception, true)}
                  {renderBolinhas("Destreza", dexterity, setDexterity, true)}
                  {renderBolinhas("Vigor", vigor, setVigor, true)}
                  {renderBolinhas("Carisma", charisma, setCharisma, true)}
                </div>
              </div>

              {/* Accordion - Poderes */}
              {renderAccordionSection(
                "Poderes",
                accordion.powers,
                () => setAccordion((prev) => ({ ...prev, powers: !prev.powers })),
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allPowers.map((power) => (
                    <div key={power} className="bg-gray-50 rounded-lg p-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{power}</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setPowers((prev) => ({ ...prev, [power]: val }))}
                            className={`w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                              (powers[power] || 0) >= val && val !== 0
                                ? "shadow-md transform scale-105"
                                : "hover:border-gray-400 hover:shadow-sm"
                            }`}
                            style={{
                              backgroundColor: (powers[power] || 0) >= val && val !== 0 ? teamColor : "white",
                              color: (powers[power] || 0) >= val && val !== 0 ? "white" : "#6B7280",
                              borderColor: (powers[power] || 0) >= val && val !== 0 ? teamColor : "#D1D5DB",
                            }}
                            title={val === 0 ? "Nenhum" : String(val)}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>,
              )}

              {/* Accordion - Estilos */}
              {renderAccordionSection(
                "Estilos",
                accordion.styles,
                () => setAccordion((prev) => ({ ...prev, styles: !prev.styles })),
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allStyles.map((style) => (
                    <div key={style} className="bg-gray-50 rounded-lg p-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{style}</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setStyles((prev) => ({ ...prev, [style]: val }))}
                            className={`w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                              (styles[style] || 0) >= val && val !== 0
                                ? "shadow-md transform scale-105"
                                : "hover:border-gray-400 hover:shadow-sm"
                            }`}
                            style={{
                              backgroundColor: (styles[style] || 0) >= val && val !== 0 ? teamColor : "white",
                              color: (styles[style] || 0) >= val && val !== 0 ? "white" : "#6B7280",
                              borderColor: (styles[style] || 0) >= val && val !== 0 ? teamColor : "#D1D5DB",
                            }}
                            title={val === 0 ? "Nenhum" : String(val)}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>,
              )}

              {/* Accordion - Perícias */}
              {renderAccordionSection(
                "Perícias de Combate",
                accordion.combat,
                () => setAccordion((prev) => ({ ...prev, combat: !prev.combat })),
                renderSkillCategory(combatSkills, combat, setCombat),
              )}

              {renderAccordionSection(
                "Perícias Sociais",
                accordion.social,
                () => setAccordion((prev) => ({ ...prev, social: !prev.social })),
                renderSkillCategory(socialSkills, social, setSocial),
              )}

              {renderAccordionSection(
                "Perícias de Utilidade",
                accordion.utility,
                () => setAccordion((prev) => ({ ...prev, utility: !prev.utility })),
                renderSkillCategory(utilitySkills, utility, setUtility),
              )}

              {renderAccordionSection(
                "Perícias Complementares",
                accordion.complementary,
                () => setAccordion((prev) => ({ ...prev, complementary: !prev.complementary })),
                renderSkillCategory(complementarySkills, complementary, setComplementary),
              )}

              {/* Accordion - Perícias de Especialização */}
              {renderAccordionSection(
                "Perícias de Especialização",
                accordion.specialization,
                () => setAccordion((prev) => ({ ...prev, specialization: !prev.specialization })),
                <div className="space-y-4">
                  {(Object.keys(specializationCategories) as SpecializationCategory[]).map((category) =>
                    renderSpecializationCategory(category),
                  )}
                </div>,
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-2 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
              style={{ backgroundColor: teamColor }}
            >
              {editingMember ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}















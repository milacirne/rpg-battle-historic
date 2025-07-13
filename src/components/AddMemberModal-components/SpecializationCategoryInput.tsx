import type React from "react"
import { AccordionSection } from "./AccordionSection"
import { type SpecializationCategory, specializationCategories, type AccordionState } from "./../../constants/rpg.data"

type SpecializationCategoryInputProps = {
  category: SpecializationCategory
  specialization: Record<string, Record<string, number>>
  setSpecialization: React.Dispatch<
    React.SetStateAction<{
      languages: Record<string, number>
      arts: Record<string, number>
      knowledge: Record<string, number>
      driving: Record<string, number>
      crafts: Record<string, number>
    }>
  >
  newSpecializationInput: string
  setNewSpecializationInput: React.Dispatch<React.SetStateAction<Record<SpecializationCategory, string>>>
  teamColor: string
  accordionState: AccordionState // Usando o tipo AccordionState
  setAccordionState: React.Dispatch<React.SetStateAction<AccordionState>> // Usando o tipo AccordionState
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

export function SpecializationCategoryInput({
  category,
  specialization,
  setSpecialization,
  newSpecializationInput,
  setNewSpecializationInput,
  teamColor,
  accordionState,
  setAccordionState,
}: SpecializationCategoryInputProps) {
  const categorySkills = Object.keys(specialization[category])
  const categoryName = specializationCategories[category]

  // Função para adicionar nova especialização em uma categoria específica
  function handleAddSpecialization() {
    const inputValue = newSpecializationInput
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

    setNewSpecializationInput((prev) => ({
      ...prev,
      [category]: "",
    }))
  }

  // Função para remover especialização de uma categoria específica
  function handleRemoveSpecialization(skillName: string) {
    setSpecialization((prev) => {
      const newCategorySkills = { ...prev[category] }
      delete newCategorySkills[skillName]
      return {
        ...prev,
        [category]: newCategorySkills,
      }
    })
  }

  return (
    <AccordionSection
      title={categoryName}
      open={accordionState[category]}
      onToggle={() => setAccordionState((prev) => ({ ...prev, [category]: !prev[category] }))}
    >
      <div className="space-y-4">
        {/* Input para adicionar nova especialização nesta categoria */}
        <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newSpecializationInput}
            onChange={(e) =>
              setNewSpecializationInput((prev) => ({
                ...prev,
                [category]: e.target.value,
              }))
            }
            placeholder={`Digite uma especialização em ${categoryName.toLowerCase()} (ex: ${getPlaceholderExample(category)})`}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddSpecialization()
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddSpecialization}
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
                    onClick={() => handleRemoveSpecialization(skill)}
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
      </div>
    </AccordionSection>
  )
}



import type { Member } from "./AddMemberModal"

type Props = {
  member: Member
  onClose: () => void
}

// Categorias de especialização
const specializationCategories = {
  languages: "Idiomas",
  arts: "Artes",
  knowledge: "Conhecimento",
  driving: "Condução",
  crafts: "Ofícios",
} as const

export default function MemberInfoModal({ member, onClose }: Props) {
  // Função para filtrar apenas valores > 0
  function filterNonZeroValues(obj: Record<string, number> = {}): Record<string, number> {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value > 0))
  }

  // Calcular estatísticas derivadas
  const VITALIDADE = (member.vigor + member.determination) * 25
  const ENERGIA = (member.force + member.dexterity) * 25
  const MANA = (member.wisdom + member.charisma) * 25
  const INICIATIVA = member.agility + member.perception

  // Filtrar poderes, estilos e perícias com valor > 0
  const activePowers = filterNonZeroValues(member.powers)
  const activeStyles = filterNonZeroValues(member.styles)
  const activeCombatSkills = filterNonZeroValues(member.skills?.combat)
  const activeSocialSkills = filterNonZeroValues(member.skills?.social)
  const activeUtilitySkills = filterNonZeroValues(member.skills?.utility)
  const activeComplementarySkills = filterNonZeroValues(member.skills?.complementary)

  // Filtrar especializações
  const activeSpecializations = {
    languages: filterNonZeroValues(member.skills?.specialization?.languages),
    arts: filterNonZeroValues(member.skills?.specialization?.arts),
    knowledge: filterNonZeroValues(member.skills?.specialization?.knowledge),
    driving: filterNonZeroValues(member.skills?.specialization?.driving),
    crafts: filterNonZeroValues(member.skills?.specialization?.crafts),
  }

  // Função para renderizar seção com valores
  function renderSection(title: string, items: Record<string, number>, emptyMessage: string) {
    const hasItems = Object.keys(items).length > 0

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
        {hasItems ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(items).map(([name, value]) => (
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

              if (!hasSkills) return null

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
                  </div>
                </div>
              )
            })}
            {Object.values(activeSpecializations).every((skills) => Object.keys(skills).length === 0) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-sm italic">Nenhuma especialização adquirida</p>
              </div>
            )}
          </div>
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




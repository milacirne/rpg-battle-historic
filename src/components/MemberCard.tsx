import { useState } from "react"
import MemberInfoModal from "./MemberInfoModal"
import StatBar from "./StatBar"
import { allDivineParents, type Member } from "../constants/rpg.data"

type MemberCardProps = {
  member: Member
  onEdit: (member: Member) => void
  onDelete: (memberId: string) => void
}

export default function MemberCard({ member, onEdit, onDelete }: MemberCardProps) {
  const [showInfoModal, setShowInfoModal] = useState(false)

  const VITALIDADE = (member.vigor + member.determination) * 25
  const ENERGIA = (member.force + member.dexterity) * 25
  const MANA = (member.wisdom + member.charisma) * 25
  const iniciativaBase = member.agility + member.perception

  let emblemText: string
  let emblemClass: string

  if (member.type === "semideus" && member.divineParent) {
    const divineParentData = allDivineParents.find((dp) => dp.name === member.divineParent)
    emblemText = divineParentData?.name || member.divineParent
    emblemClass = divineParentData?.tagClass || "bg-indigo-100 text-indigo-700"
  } else if (member.type === "humano") {
    emblemText = "Humano"
    emblemClass = "bg-gray-100 text-gray-700"
  } else if (member.type === "monstro") {
    emblemText = "Monstro"
    emblemClass = "bg-red-100 text-red-700"
  } else {
    emblemText = "Desconhecido"
    emblemClass = "bg-gray-100 text-gray-700"
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-5 mb-5 hover:shadow-lg transition duration-300 text-sm flex flex-col justify-between">
        {/* Header: Nome + Emblema */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900 truncate max-w-[11rem]">{member.name}</h3>
          {/* Aplica a classe dinâmica para a tag */}
          <span className={`text-xs font-medium px-3 py-0.5 rounded-full ${emblemClass}`}>{emblemText}</span>
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-4">
          <StatBar label="Vitalidade" value={VITALIDADE} max={VITALIDADE} color="green" small />
          <StatBar label="Energia" value={ENERGIA} max={ENERGIA} color="red" small />
          <StatBar label="Mana" value={MANA} max={MANA} color="blue" small />
          <div className="text-xs text-gray-600 font-medium">
            Iniciativa: <span className="text-indigo-700 font-semibold">{iniciativaBase}</span>
          </div>
        </div>

        {/* Botões */}
        <div className="mt-auto pt-3 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition cursor-pointer flex items-center gap-1"
            aria-label={`Ver informações de ${member.name}`}
            title="Ver informações detalhadas"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Info
          </button>
          <button
            onClick={() => onEdit(member)}
            className="px-3 py-1.5 bg-yellow-400 text-white text-xs rounded hover:bg-yellow-500 transition cursor-pointer"
            aria-label={`Editar ${member.name}`}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition cursor-pointer"
            aria-label={`Apagar ${member.name}`}
          >
            Apagar
          </button>
        </div>
      </div>

      {/* Modal de Informações */}
      {showInfoModal && <MemberInfoModal member={member} onClose={() => setShowInfoModal(false)} />}
    </>
  )
}









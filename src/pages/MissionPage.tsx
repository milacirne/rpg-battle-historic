import type React from "react"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import CreateTeamsModal from "../components/CreateTeamsModal"
import AddMemberModal from "../components/AddMemberModal"
import type { Member, Round } from "../constants/rpg.data"
import MemberCard from "../components/MemberCard"
import { FaChevronRight, FaPlus } from "react-icons/fa"
import MissionHeader from "../components/MissionHeader"

type RPType = "Oficial" | "Semi-Oficial" | "Livre"

type BattleSheet = {
  id: string
  name: string
  type: RPType
  location: string
  createdAt: string
  team1Name?: string
  team2Name?: string
  team1Members?: Member[]
  team2Members?: Member[]
  rounds?: Round[]
}

type Props = {
  sheets: BattleSheet[]
  setSheets: React.Dispatch<React.SetStateAction<BattleSheet[]>>
}

export default function MissionPage({ sheets, setSheets }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const mission = sheets.find((sheet) => sheet.id === id)

  const [teamsCreated, setTeamsCreated] = useState(!!mission?.team1Name && !!mission?.team2Name)
  const [team1Name, setTeam1Name] = useState(mission?.team1Name || "")
  const [team2Name, setTeam2Name] = useState(mission?.team2Name || "")

  const [team1Members, setTeam1Members] = useState<Member[]>(mission?.team1Members || [])
  const [team2Members, setTeam2Members] = useState<Member[]>(mission?.team2Members || [])

  const [createTeamsModalOpen, setCreateTeamsModalOpen] = useState(false)
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false)
  const [modalTeam, setModalTeam] = useState<"team1" | "team2" | null>(null)

  const [editingMember, setEditingMember] = useState<Member | null>(null)

  if (!mission) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Missão não encontrada</h2>
        <button onClick={() => navigate("/")} className="text-blue-600 underline">
          Voltar para o histórico
        </button>
      </div>
    )
  }

  const updateMissionData = (updatedData: Partial<BattleSheet>) => {
    setSheets((prevSheets) => prevSheets.map((sheet) => (sheet.id === id ? { ...sheet, ...updatedData } : sheet)))
  }

  function openAddMemberModal(team: "team1" | "team2", memberToEdit?: Member) {
    setModalTeam(team)
    setEditingMember(memberToEdit ?? null)
    setAddMemberModalOpen(true)
  }

  function closeAddMemberModal() {
    setAddMemberModalOpen(false)
    setModalTeam(null)
    setEditingMember(null)
  }

  function handleCreateTeams() {
    if (!team1Name.trim() || !team2Name.trim()) {
      alert("Preencha os nomes das equipes")
      return
    }
    setTeamsCreated(true)
    setCreateTeamsModalOpen(false)
    updateMissionData({ team1Name, team2Name })
  }

  function handleAddOrEditMember(member: Member) {
    if (!modalTeam) return

    let updatedTeam1Members = [...team1Members]
    let updatedTeam2Members = [...team2Members]

    if (editingMember) {
      if (modalTeam === "team1") {
        updatedTeam1Members = updatedTeam1Members.map((m) => (m.id === member.id ? member : m))
        setTeam1Members(updatedTeam1Members)
      } else {
        updatedTeam2Members = updatedTeam2Members.map((m) => (m.id === member.id ? member : m))
        setTeam2Members(updatedTeam2Members)
      }
    } else {
      if (modalTeam === "team1") {
        updatedTeam1Members = [...updatedTeam1Members, member]
        setTeam1Members(updatedTeam1Members)
      } else {
        updatedTeam2Members = [...updatedTeam2Members, member]
        setTeam2Members(updatedTeam2Members)
      }
    }
    updateMissionData({ team1Members: updatedTeam1Members, team2Members: updatedTeam2Members })
    closeAddMemberModal()
  }

  function handleDeleteMember(team: "team1" | "team2", memberId: string) {
    if (!confirm("Tem certeza que quer apagar esse membro?")) return

    let updatedTeam1Members = [...team1Members]
    let updatedTeam2Members = [...team2Members]

    if (team === "team1") {
      updatedTeam1Members = updatedTeam1Members.filter((m) => m.id !== memberId)
      setTeam1Members(updatedTeam1Members)
    } else {
      updatedTeam2Members = updatedTeam2Members.filter((m) => m.id !== memberId)
      setTeam2Members(updatedTeam2Members)
    }
    updateMissionData({ team1Members: updatedTeam1Members, team2Members: updatedTeam2Members })
  }

  function handleAddRoundPage() {
    navigate(`/missao/${id}/adicionar-rodada`, {
      state: { team1Members, team2Members, team1Name, team2Name },
    })
  }

  function handleViewRoundsPage() {
    navigate(`/missao/${id}/rodadas`)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <MissionHeader
        name={mission.name}
        location={mission.location}
        createdAt={mission.createdAt}
        type={mission.type}
      />

      {!teamsCreated ? (
        <div className="flex justify-center items-center" style={{ height: "40vh" }}>
          <button
            onClick={() => setCreateTeamsModalOpen(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition cursor-pointer"
          >
            Criar Equipes
          </button>
        </div>
      ) : (
        <>
          <div className="relative mt-8 mb-6 flex flex-col items-center">
            <button
              onClick={handleAddRoundPage}
              disabled={team1Members.length === 0 || team2Members.length === 0}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base transition flex items-center gap-2 shadow
                ${
                  team1Members.length === 0 || team2Members.length === 0
                    ? "bg-green-200 text-green-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                }
              `}
            >
              <FaPlus />
              Nova Rodada
            </button>

            <button
              onClick={handleViewRoundsPage}
              className="absolute right-4 top-1 sm:top-0 text-purple-500 hover:text-purple-700 transition cursor-pointer"
              title="Ver rodadas"
            >
              <FaChevronRight size={28} />
            </button>
          </div>

          <main className="w-full flex flex-col sm:flex-row gap-4">
            <section className="flex-1 bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-4 text-blue-700">{team1Name}</h2>
              <button
                onClick={() => openAddMemberModal("team1")}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
              >
                <FaPlus />
                Adicionar personagem
              </button>
              {team1Members.length === 0 ? (
                <p className="text-gray-500">Nenhum personagem adicionado.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team1Members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onEdit={() => openAddMemberModal("team1", member)}
                      onDelete={() => handleDeleteMember("team1", member.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="flex-1 bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-4 text-red-700">{team2Name}</h2>
              <button
                onClick={() => openAddMemberModal("team2")}
                className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer flex items-center gap-2"
              >
                <FaPlus />
                Adicionar personagem
              </button>
              {team2Members.length === 0 ? (
                <p className="text-gray-500">Nenhum personagem adicionado.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team2Members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onEdit={() => openAddMemberModal("team2", member)}
                      onDelete={() => handleDeleteMember("team2", member.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </main>
        </>
      )}

      {createTeamsModalOpen && (
        <CreateTeamsModal
          team1Name={team1Name}
          team2Name={team2Name}
          setTeam1Name={setTeam1Name}
          setTeam2Name={setTeam2Name}
          onClose={() => setCreateTeamsModalOpen(false)}
          onCreate={handleCreateTeams}
        />
      )}

      {addMemberModalOpen && modalTeam && (
        <AddMemberModal
          teamName={modalTeam === "team1" ? team1Name : team2Name}
          teamColor={modalTeam === "team1" ? "blue" : "red"}
          onClose={closeAddMemberModal}
          onAddMember={handleAddOrEditMember}
          editingMember={editingMember}
        />
      )}
    </div>
  )
}








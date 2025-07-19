import type React from "react"
import { FaPlus } from "react-icons/fa"
import { useState } from "react"
import BattleTable from "../components/BattleTable"
import { CreateMissionModal } from "../components/CreateMissionModal"
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal"
import { v4 as uuidv4 } from "uuid"

type RPType = "Oficial" | "Semi-Oficial" | "Livre"

type BattleSheet = {
  id: string
  name: string
  type: RPType
  location: string
  createdAt: string
}

type MissionData = {
  id?: string
  name: string
  type: RPType
  location: string
  createdAt: string
}

type Props = {
  sheets: BattleSheet[]
  setSheets: React.Dispatch<React.SetStateAction<BattleSheet[]>>
}

export default function MainPage({ sheets, setSheets }: Props) {
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false)
  const [editingMission, setEditingMission] = useState<BattleSheet | null>(null)
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false)
  const [missionToDeleteId, setMissionToDeleteId] = useState<string | null>(null)

  function openCreateMissionModal() {
    setEditingMission(null)
    setIsMissionModalOpen(true)
  }

  function openEditMissionModal(mission: BattleSheet) {
    setEditingMission(mission)
    setIsMissionModalOpen(true)
  }

  function closeMissionModal() {
    setIsMissionModalOpen(false)
    setEditingMission(null)
  }

  function handleMissionSubmit(data: MissionData) {
    if (editingMission) {
      setSheets((prev) => prev.map((sheet) => (sheet.id === data.id ? ({ ...sheet, ...data } as BattleSheet) : sheet)))
    } else {
      const newSheet: BattleSheet = {
        id: uuidv4(),
        name: data.name,
        type: data.type,
        location: data.location,
        createdAt: data.createdAt,
      }
      setSheets((prev) => [...prev, newSheet])
    }
    closeMissionModal()
  }

  function handleDeleteMissionClick(id: string) {
    setMissionToDeleteId(id)
    setConfirmDeleteModalOpen(true)
  }

  function handleConfirmDelete() {
    if (missionToDeleteId) {
      setSheets((prev) => prev.filter((sheet) => sheet.id !== missionToDeleteId))
      setMissionToDeleteId(null)
      setConfirmDeleteModalOpen(false)
    }
  }

  function handleCancelDelete() {
    setMissionToDeleteId(null)
    setConfirmDeleteModalOpen(false)
  }

  return (
    <div className="p-6 w-full h-screen overflow-auto flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Histórico de Batalhas</h1>

      <button
        onClick={openCreateMissionModal}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition mb-6 max-w-max flex items-center gap-2"
      >
        <FaPlus />
        Nova Missão
      </button>

      {sheets.length === 0 ? (
        <p className="text-gray-600">Nenhuma missão criada ainda.</p>
      ) : (
        <BattleTable sheets={sheets} onDeleteMission={handleDeleteMissionClick} onEditMission={openEditMissionModal} />
      )}

      <CreateMissionModal
        isOpen={isMissionModalOpen}
        initialData={editingMission}
        onClose={closeMissionModal}
        onSubmit={handleMissionSubmit}
      />

      <ConfirmDeleteModal
        isOpen={confirmDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir esta missão? Esta ação não pode ser desfeita."
      />
    </div>
  )
}











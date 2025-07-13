import type React from "react"

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

type Props = {
  sheets: BattleSheet[]
  setSheets: React.Dispatch<React.SetStateAction<BattleSheet[]>>
}

export default function MainPage({ sheets, setSheets }: Props) {
  const [createMissionModalOpen, setCreateMissionModalOpen] = useState(false) // Renomeado para clareza
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false) // Novo estado
  const [missionToDeleteId, setMissionToDeleteId] = useState<string | null>(null) // Novo estado

  const [name, setName] = useState("")
  const [type, setType] = useState<RPType>("Oficial")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })

  function openCreateMissionModal() {
    setCreateMissionModalOpen(true)
  }

  function closeCreateMissionModal() {
    setCreateMissionModalOpen(false)
    setName("")
    setType("Oficial")
    setLocation("")
    setDate(new Date().toISOString().split("T")[0])
  }

  function handleCreateMissionSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !location.trim()) {
      alert("Por favor, preencha Nome e Local.")
      return
    }
    const newSheet: BattleSheet = {
      id: uuidv4(),
      name: name.trim(),
      type,
      location: location.trim(),
      createdAt: new Date(date).toISOString(),
    }
    setSheets((prev) => [...prev, newSheet])
    closeCreateMissionModal()
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
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition mb-6 max-w-max"
      >
        Nova Missão
      </button>

      {sheets.length === 0 ? (
        <p className="text-gray-600">Nenhuma missão criada ainda.</p>
      ) : (
        <BattleTable sheets={sheets} onDeleteMission={handleDeleteMissionClick} />
      )}

      <CreateMissionModal
        modalOpen={createMissionModalOpen}
        name={name}
        setName={setName}
        type={type}
        setType={setType}
        location={location}
        setLocation={setLocation}
        date={date}
        setDate={setDate}
        onClose={closeCreateMissionModal}
        onSubmit={handleCreateMissionSubmit}
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









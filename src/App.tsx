import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Routes, Route } from "react-router-dom"

import MainPage from "./pages/MainPage"
import MissionPage from "./pages/MissionPage"
import AddRoundPage from "./pages/AddRoundPage"
import ViewRoundsPage from "./pages/ViewRoundsPage"

import type { Member, Round } from "./constants/rpg.data"

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

export default function App() {
  const [sheets, setSheets] = useState<BattleSheet[]>([
    {
      id: uuidv4(),
      name: "A Maldição de Cronos",
      type: "Oficial",
      location: "Monte Olimpo",
      createdAt: "2025-07-01T14:00:00Z",
      rounds: [],
    },
    {
      id: uuidv4(),
      name: "O Labirinto de Dédalo",
      type: "Semi-Oficial",
      location: "Subsolo de Nova York",
      createdAt: "2025-06-25T10:30:00Z",
      rounds: [],
    },
    {
      id: uuidv4(),
      name: "Caçada à Hidra",
      type: "Livre",
      location: "Pântano de Everglades",
      createdAt: "2025-06-20T16:45:00Z",
      rounds: [],
    },
  ])

  return (
    <Routes>
      <Route path="/" element={<MainPage sheets={sheets} setSheets={setSheets} />} />
      <Route path="/missao/:id" element={<MissionPage sheets={sheets} setSheets={setSheets} />} />
      <Route path="/missao/:id/adicionar-rodada" element={<AddRoundPage sheets={sheets} setSheets={setSheets} />} />
      <Route path="/missao/:id/rodadas" element={<ViewRoundsPage sheets={sheets} setSheets={setSheets} />} />
    </Routes>
  )
}













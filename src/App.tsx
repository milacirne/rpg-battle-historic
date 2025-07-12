import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Routes, Route } from "react-router-dom"

import MainPage from "./pages/MainPage"
import MissionPage from "./pages/MissionPage"
import RoundPage from "./pages/RoundPage"

type RPType = 'Oficial' | 'Semi-Oficial' | 'Livre'

type BattleSheet = {
  id: string
  name: string
  type: RPType
  location: string
  createdAt: string
}

export default function App() {
  const [sheets, setSheets] = useState<BattleSheet[]>([
    {
      id: uuidv4(),
      name: "A Maldição de Cronos",
      type: "Oficial",
      location: "Monte Olimpo",
      createdAt: "2025-07-01T14:00:00Z",
    },
    {
      id: uuidv4(),
      name: "O Labirinto de Dédalo",
      type: "Semi-Oficial",
      location: "Subsolo de Nova York",
      createdAt: "2025-06-25T10:30:00Z",
    },
    {
      id: uuidv4(),
      name: "Caçada à Hidra",
      type: "Livre",
      location: "Pântano de Everglades",
      createdAt: "2025-06-20T16:45:00Z",
    },
  ])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainPage sheets={sheets} setSheets={setSheets} />
        }
      />
      <Route
        path="/missao/:id"
        element={
          <MissionPage sheets={sheets} />
        }
      />
      <Route 
        path="/missao/:id/rodada" 
        element={<RoundPage sheets={sheets} />} 
      />
    </Routes>
  )
}









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

export const allPowers = [
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

export const allStyles = [
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

export const combatSkills = [
  "Luta",
  "Pontaria",
  "Salvaguarda",
  "Arcano",
  "Anulação",
  "Constrição",
  "Bloqueio",
  "Resistência",
]
export const socialSkills = ["Lábia", "Intimidação", "Persuasão", "Empatia", "Sedução"]
export const utilitySkills = ["Segurança", "Furtividade", "Computação", "Investigação", "Prestidigitação"]
export const complementarySkills = ["Sobrevivência", "Acrobacia", "Atletismo", "Forja", "Medicina"]

export const specializationCategories = {
  languages: "Idiomas",
  arts: "Artes",
  knowledge: "Conhecimento",
  driving: "Condução",
  crafts: "Ofícios",
} as const

export type SpecializationCategory = keyof typeof specializationCategories

// Novo tipo para o estado do accordion
export type AccordionState = {
  powers: boolean
  styles: boolean
  combat: boolean
  social: boolean
  utility: boolean
  complementary: boolean
  specialization: boolean
  languages: boolean
  arts: boolean
  knowledge: boolean
  driving: boolean
  crafts: boolean
}


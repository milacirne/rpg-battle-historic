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
  baseSkills?: {
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
      sports: Record<string, number>
    }
  }
  peculiarities?: string[]
  trejeitos?: string[]
  perks?: string[]
  hindrances?: string[]
  derivedGlobalSkillEffects?: GlobalSkillEffect[]
  divineParentUserSpecializations?: Record<string, string>
  abilities: string[]
  disabilities: string[]
  conductionBonuses?: Record<string, boolean>
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
  "Vitacinese",
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
  sports: "Esportes",
} as const

export type SpecializationCategory = keyof typeof specializationCategories

export type AccordionState = {
  powers: boolean
  styles: boolean
  skills: boolean
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
  sports: boolean
  advantages: boolean
  peculiarities: boolean
  disadvantages: boolean
  trejeitos: boolean
  abilities: boolean
  disabilities: boolean
  perks: boolean
  hindrances: boolean
}

export type SkillEffect = {
  skill: string
  value: number
}

export type PeculiarityData = {
  name: string
  effects: SkillEffect[]
}

export type TrejeitoData = {
  name: string
  effects: SkillEffect[]
}

export type PerkData = {
  name: string
  description: string
}

export type HindranceData = {
  name: string
  description: string
}

export type GlobalSkillEffect = {
  type: "individual" | "category"
  category: SpecializationCategory | "combat" | "social" | "utility" | "complementary"
  skillName: string
  value: number
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const allPeculiarities: PeculiarityData[] = [
  {
    name: "Cortês",
    effects: [
      { skill: "Sedução", value: 2 },
      { skill: "Empatia", value: 2 },
    ],
  },
  {
    name: "Trombadinha",
    effects: [
      { skill: "Furtividade", value: 2 },
      { skill: "Prestidigitação", value: 2 },
    ],
  },
  {
    name: "Caçador",
    effects: [
      { skill: "Medicina", value: 2 },
      { skill: "Sobrevivência", value: 2 },
    ],
  },
  {
    name: "Hacker",
    effects: [
      { skill: "Segurança", value: 2 },
      { skill: "Computação", value: 2 },
    ],
  },
  {
    name: "Brucutu",
    effects: [
      { skill: "Intimidação", value: 2 },
      { skill: "Atletismo", value: 2 },
    ],
  },
  {
    name: "Espião",
    effects: [
      { skill: "Furtividade", value: 2 },
      { skill: "Investigação", value: 2 },
    ],
  },
  {
    name: "Curandeiro",
    effects: [
      { skill: "Empatia", value: 2 },
      { skill: "Medicina", value: 2 },
    ],
  },
  {
    name: "Charlatão",
    effects: [
      { skill: "Lábia", value: 2 },
      { skill: "Persuasão", value: 2 },
    ],
  },
  {
    name: "Malabarista",
    effects: [
      { skill: "Prestidigitação", value: 2 },
      { skill: "Acrobacia", value: 2 },
    ],
  },
  {
    name: "Ferreiro",
    effects: [
      { skill: "Forja", value: 2 },
      { skill: "Computação", value: 2 },
    ],
  },
  {
    name: "Explorador",
    effects: [
      { skill: "Sobrevivência", value: 2 },
      { skill: "Acrobacia", value: 2 },
    ],
  },
  {
    name: "Ladrão",
    effects: [
      { skill: "Segurança", value: 2 },
      { skill: "Intimidação", value: 2 },
    ],
  },
  {
    name: "Manipulador",
    effects: [
      { skill: "Lábia", value: 2 },
      { skill: "Sedução", value: 2 },
    ],
  },
  {
    name: "Soldado",
    effects: [
      { skill: "Forja", value: 2 },
      { skill: "Atletismo", value: 2 },
    ],
  },
  {
    name: "Oportunista",
    effects: [
      { skill: "Persuasão", value: 2 },
      { skill: "Investigação", value: 2 },
    ],
  },
  { name: "Acadêmico", effects: [{ skill: "Conhecimento", value: 2 }] },
  { name: "Atleta", effects: [{ skill: "Esportes", value: 2 }] },
  { name: "Artista", effects: [{ skill: "Artes", value: 2 }] },
  { name: "Linguista", effects: [{ skill: "Idiomas", value: 2 }] },
  { name: "Profissional", effects: [{ skill: "Ofícios", value: 2 }] },
  { name: "Motorista", effects: [{ skill: "Condução", value: 2 }] },
]

export const allTrejeitos: TrejeitoData[] = [
  {
    name: "Brega",
    effects: [
      { skill: "Persuasão", value: -2 },
      { skill: "Prestidigitação", value: -2 },
    ],
  },
  {
    name: "Franco",
    effects: [
      { skill: "Lábia", value: -2 },
      { skill: "Medicina", value: -2 },
    ],
  },
  {
    name: "Rústico",
    effects: [
      { skill: "Computação", value: -2 },
      { skill: "Segurança", value: -2 },
    ],
  },
  {
    name: "Desengonçado",
    effects: [
      { skill: "Acrobacia", value: -2 },
      { skill: "Atletismo", value: -2 },
    ],
  },
  {
    name: "Irônico",
    effects: [
      { skill: "Persuasão", value: -2 },
      { skill: "Lábia", value: -2 },
    ],
  },
  {
    name: "Fofo",
    effects: [
      { skill: "Intimidação", value: -2 },
      { skill: "Sedução", value: -2 },
    ],
  },
  {
    name: "Bruto",
    effects: [
      { skill: "Medicina", value: -2 },
      { skill: "Prestidigitação", value: -2 },
    ],
  },
  {
    name: "Nerd",
    effects: [
      { skill: "Atletismo", value: -2 },
      { skill: "Empatia", value: -2 },
    ],
  },
  {
    name: "Distraído",
    effects: [
      { skill: "Investigação", value: -2 },
      { skill: "Forja", value: -2 },
    ],
  },
  {
    name: "Impetuoso",
    effects: [
      { skill: "Sobrevivência", value: -2 },
      { skill: "Furtividade", value: -2 },
    ],
  },
  {
    name: "Destrutivo",
    effects: [
      { skill: "Forja", value: -2 },
      { skill: "Segurança", value: -2 },
    ],
  },
  {
    name: "Durão",
    effects: [
      { skill: "Sedução", value: -2 },
      { skill: "Empatia", value: -2 },
    ],
  },
  {
    name: "Previsível",
    effects: [
      { skill: "Furtividade", value: -2 },
      { skill: "Investigação", value: -2 },
    ],
  },
  {
    name: "Mimado",
    effects: [
      { skill: "Intimidação", value: -2 },
      { skill: "Sobrevivência", value: -2 },
    ],
  },
  {
    name: "Desastrado",
    effects: [
      { skill: "Computação", value: -2 },
      { skill: "Acrobacia", value: -2 },
    ],
  },
  { name: "Bairrista", effects: [{ skill: "Idiomas", value: -2 }] },
  { name: "Indolente", effects: [{ skill: "Esportes", value: -2 }] },
  { name: "Pretensioso", effects: [{ skill: "Artes", value: -2 }] },
  { name: "Conservador", effects: [{ skill: "Conhecimento", value: -2 }] },
  { name: "Relapso", effects: [{ skill: "Ofícios", value: -2 }] },
  { name: "Barbeiro", effects: [{ skill: "Condução", value: -2 }] },
]

export const allPerks: PerkData[] = [
  { name: "Coragem", description: "Em situações de perigo, o personagem receberá +10 em Iniciativa." },
  {
    name: "Sorte",
    description:
      "Toda vez que o personagem obter 10 ao rolar 1d10, algo maravilhoso acontecerá, a critério do narrador.",
  },
  {
    name: "Gambiarra",
    description:
      "Uma vez por RP, o personagem pode criar uma solução miraculosa para um problema qualquer, sem uso de qualquer ação para tal.",
  },
]

export const allHindrances: HindranceData[] = [
  { name: "Covardia", description: "Em situações de perigo, o personagem receberá -10 em Iniciativa." },
  {
    name: "Azar",
    description: "Toda vez que o personagem obter 1 ao rolar 1d10, algo horrível acontecerá, a critério do narrador.",
  },
  {
    name: "Perseguido por Monstros",
    description: "Toda vez que o personagem rolar 1, aparecerá 1 (um) monstro, a critério do narrador.",
  },
]

export type DivineSkillEffect = {
  skillName: string
  value: number
  category: SpecializationCategory | "combat" | "social" | "utility" | "complementary"
  requiresUserInput?: boolean
  userInputPlaceholder?: string
  isAutoApplied?: boolean
  autoAppliedValue?: string
}

export type DivineParentData = {
  name: string
  greekName: string
  romanName: string
  effects: DivineSkillEffect[]
  tagClass: string
}

export const allDivineParents: DivineParentData[] = [
  {
    name: "Zeus & Júpiter",
    greekName: "Zeus",
    romanName: "Júpiter",
    effects: [
      { skillName: "Persuasão", value: 2, category: "social" },
      { skillName: "Segurança", value: 2, category: "utility" },
      {
        skillName: "Condução",
        value: 2,
        category: "driving",
        isAutoApplied: true,
        autoAppliedValue: "Aéreos",
      },
    ],
    tagClass: "bg-blue-300 text-white",
  },
  {
    name: "Poseidon & Netuno",
    greekName: "Poseidon",
    romanName: "Netuno",
    effects: [
      { skillName: "Empatia", value: 2, category: "social" },
      { skillName: "Medicina", value: 2, category: "complementary" },
      {
        skillName: "Condução",
        value: 2,
        category: "driving",
        isAutoApplied: true,
        autoAppliedValue: "Aquáticos",
      },
    ],
    tagClass: "bg-blue-600 text-white",
  },
  {
    name: "Hades & Plutão",
    greekName: "Hades",
    romanName: "Plutão",
    effects: [
      { skillName: "Intimidação", value: 2, category: "social" },
      { skillName: "Furtividade", value: 2, category: "utility" },
      {
        skillName: "Condução",
        value: 2,
        category: "driving",
        isAutoApplied: true,
        autoAppliedValue: "Terrestres",
      },
    ],
    tagClass: "bg-gray-800 text-white",
  },
  {
    name: "Deméter & Ceres",
    greekName: "Deméter",
    romanName: "Ceres",
    effects: [
      { skillName: "Sobrevivência", value: 2, category: "complementary" },
      { skillName: "Investigação", value: 2, category: "utility" },
      {
        skillName: "Ofícios",
        value: 2,
        category: "crafts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Agricultura, horticultura ou similares",
      },
    ],
    tagClass: "bg-green-600 text-white",
  },
  {
    name: "Ares & Marte",
    greekName: "Ares",
    romanName: "Marte",
    effects: [
      { skillName: "Intimidação", value: 2, category: "social" },
      { skillName: "Segurança", value: 2, category: "utility" },
      {
        skillName: "Esportes",
        value: 2,
        category: "sports",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Futebol, Vôlei ou similares",
      },
    ],
    tagClass: "bg-red-600 text-white",
  },
  {
    name: "Atena",
    greekName: "Atena",
    romanName: "Minerva",
    effects: [
      { skillName: "Investigação", value: 2, category: "utility" },
      { skillName: "Computação", value: 2, category: "utility" },
      {
        skillName: "Conhecimento",
        value: 2,
        category: "knowledge",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Arquitetura, Estratégia ou similares",
      },
    ],
    tagClass: "bg-yellow-600 text-white",
  },
  {
    name: "Apolo & Febo",
    greekName: "Apolo",
    romanName: "Febo",
    effects: [
      { skillName: "Medicina", value: 2, category: "complementary" },
      { skillName: "Atletismo", value: 2, category: "complementary" },
      {
        skillName: "Artes",
        value: 2,
        category: "arts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Música, Poesia ou similares",
      },
    ],
    tagClass: "bg-orange-500 text-white",
  },
  {
    name: "Ártemis & Diana",
    greekName: "Ártemis",
    romanName: "Diana",
    effects: [
      { skillName: "Sobrevivência", value: 2, category: "complementary" },
      { skillName: "Furtividade", value: 2, category: "utility" },
      {
        skillName: "Ofícios",
        value: 2,
        category: "crafts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Caça, Rastreamento ou similares",
      },
    ],
    tagClass: "bg-emerald-600 text-white",
  },
  {
    name: "Hefesto & Vulcano",
    greekName: "Hefesto",
    romanName: "Vulcano",
    effects: [
      { skillName: "Forja", value: 2, category: "complementary" },
      { skillName: "Computação", value: 2, category: "utility" },
      {
        skillName: "Ofícios",
        value: 2,
        category: "crafts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Mecânica, Marcenaria ou similares",
      },
    ],
    tagClass: "bg-stone-700 text-white",
  },
  {
    name: "Afrodite & Vênus",
    greekName: "Afrodite",
    romanName: "Vênus",
    effects: [
      { skillName: "Persuasão", value: 2, category: "social" },
      { skillName: "Sedução", value: 2, category: "social" },
      {
        skillName: "Idiomas",
        value: 2,
        category: "languages",
        isAutoApplied: true,
        autoAppliedValue: "Francês",
      },
    ],
    tagClass: "bg-pink-500 text-white",
  },
  {
    name: "Hermes & Mercúrio",
    greekName: "Hermes",
    romanName: "Mercúrio",
    effects: [
      { skillName: "Lábia", value: 2, category: "social" },
      { skillName: "Segurança", value: 2, category: "utility" },
      {
        skillName: "Esportes",
        value: 2,
        category: "sports",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Futebol, Corrida ou similares",
      },
    ],
    tagClass: "bg-amber-500 text-white",
  },
  {
    name: "Dionísio & Baco",
    greekName: "Dionísio",
    romanName: "Baco",
    effects: [
      { skillName: "Prestidigitação", value: 2, category: "utility" },
      { skillName: "Acrobacia", value: 2, category: "complementary" },
      {
        skillName: "Artes",
        value: 2,
        category: "arts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Teatro, Música ou similares",
      },
    ],
    tagClass: "bg-purple-600 text-white",
  },
  {
    name: "Hécate & Trívia",
    greekName: "Hécate",
    romanName: "Trívia",
    effects: [
      { skillName: "Investigação", value: 2, category: "utility" },
      { skillName: "Furtividade", value: 2, category: "utility" },
      {
        skillName: "Conhecimento",
        value: 2,
        category: "knowledge",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Feitiçaria, Alquimia ou similares",
      },
    ],
    tagClass: "bg-indigo-800 text-white",
  },
  {
    name: "Perséfone & Proserpina",
    greekName: "Perséfone",
    romanName: "Proserpina",
    effects: [
      { skillName: "Medicina", value: 2, category: "complementary" },
      { skillName: "Empatia", value: 2, category: "social" },
      {
        skillName: "Ofícios",
        value: 2,
        category: "crafts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Floricultura, Jardinagem ou similares",
      },
    ],
    tagClass: "bg-fuchsia-700 text-white",
  },
  {
    name: "Tânato & Mors",
    greekName: "Tânato",
    romanName: "Mors",
    effects: [
      { skillName: "Persuasão", value: 2, category: "social" },
      { skillName: "Furtividade", value: 2, category: "utility" },
      {
        skillName: "Conhecimento",
        value: 2,
        category: "knowledge",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Tanatologia, Rituais funerários ou similares",
      },
    ],
    tagClass: "bg-zinc-700 text-white",
  },
  {
    name: "Quione",
    greekName: "Quione",
    romanName: "Chione",
    effects: [
      { skillName: "Sobrevivência", value: 2, category: "complementary" },
      { skillName: "Intimidação", value: 2, category: "social" },
      {
        skillName: "Idiomas",
        value: 2,
        category: "languages",
        isAutoApplied: true,
        autoAppliedValue: "Francês",
      },
    ],
    tagClass: "bg-sky-400 text-white",
  },
  {
    name: "Héracles & Hércules",
    greekName: "Héracles",
    romanName: "Hércules",
    effects: [
      { skillName: "Atletismo", value: 2, category: "complementary" },
      { skillName: "Forja", value: 2, category: "complementary" },
      {
        skillName: "Esportes",
        value: 2,
        category: "sports",
        requiresUserInput: true,
        userInputPlaceholder: "especificar",
      },
    ],
    tagClass: "bg-lime-600 text-white",
  },
  {
    name: "Éris & Discórdia",
    greekName: "Éris",
    romanName: "Discórdia",
    effects: [
      { skillName: "Segurança", value: 2, category: "utility" },
      { skillName: "Sedução", value: 2, category: "social" },
      {
        skillName: "Idiomas",
        value: 2,
        category: "languages",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Francês, Espanhol ou similares",
      },
    ],
    tagClass: "bg-rose-700 text-white",
  },
  {
    name: "Ênio & Belona",
    greekName: "Ênio",
    romanName: "Belona",
    effects: [
      { skillName: "Forja", value: 2, category: "complementary" },
      { skillName: "Acrobacia", value: 2, category: "complementary" },
      {
        skillName: "Esportes",
        value: 2,
        category: "sports",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Futebol, Basquete ou similares",
      },
    ],
    tagClass: "bg-gray-700 text-white",
  },
  {
    name: "Nêmesis & Invidia",
    greekName: "Nêmesis",
    romanName: "Invidia",
    effects: [
      { skillName: "Atletismo", value: 2, category: "complementary" },
      { skillName: "Computação", value: 2, category: "utility" },
      {
        skillName: "Condução",
        value: 2,
        category: "driving",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Carros, Barcos ou similares",
      },
    ],
    tagClass: "bg-slate-500 text-white",
  },
  {
    name: "Melinoe",
    greekName: "Melinoe",
    romanName: "Melinoe",
    effects: [
      { skillName: "Intimidação", value: 2, category: "social" },
      { skillName: "Investigação", value: 2, category: "utility" },
      {
        skillName: "Conhecimento",
        value: 2,
        category: "knowledge",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Espiritualidade, Sobrenatural ou similares",
      },
    ],
    tagClass: "bg-purple-900 text-white",
  },
  {
    name: "Eros & Cupido",
    greekName: "Eros",
    romanName: "Cupido",
    effects: [
      { skillName: "Computação", value: 2, category: "utility" },
      { skillName: "Sedução", value: 2, category: "social" },
      {
        skillName: "Idiomas",
        value: 2,
        category: "languages",
        isAutoApplied: true,
        autoAppliedValue: "Espanhol",
      },
    ],
    tagClass: "bg-red-400 text-white",
  },
  {
    name: "Hipnos & Somno",
    greekName: "Hipnos",
    romanName: "Somno",
    effects: [
      { skillName: "Empatia", value: 2, category: "social" },
      { skillName: "Persuasão", value: 2, category: "social" },
      {
        skillName: "Conhecimento",
        value: 2,
        category: "knowledge",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Onirologia, Meditação ou similares",
      },
    ],
    tagClass: "bg-blue-900 text-white",
  },
  {
    name: "Niké & Victoria",
    greekName: "Niké",
    romanName: "Victoria",
    effects: [
      { skillName: "Acrobacia", value: 2, category: "complementary" },
      { skillName: "Atletismo", value: 2, category: "complementary" },
      {
        skillName: "Esportes",
        value: 2,
        category: "sports",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Futebol, Corrida ou similares",
      },
    ],
    tagClass: "bg-yellow-400 text-white",
  },
  {
    name: "Anemoi",
    greekName: "Anemoi",
    romanName: "Venti",
    effects: [
      { skillName: "Prestidigitação", value: 2, category: "utility" },
      { skillName: "Acrobacia", value: 2, category: "complementary" },
      {
        skillName: "Artes",
        value: 2,
        category: "arts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Dança, música ou similares",
      },
    ],
    tagClass: "bg-sky-700 text-white",
  },
  {
    name: "Oneiros",
    greekName: "Oneiros",
    romanName: "Somnia",
    effects: [
      { skillName: "Lábia", value: 2, category: "social" },
      { skillName: "Empatia", value: 2, category: "social" },
      {
        skillName: "Artes",
        value: 2,
        category: "arts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Pintura, Música ou similares",
      },
    ],
    tagClass: "bg-gray-900 text-white",
  },
  {
    name: "Deimos e Fobos",
    greekName: "Deimos",
    romanName: "Terror e Pavor",
    effects: [
      { skillName: "Prestidigitação", value: 2, category: "utility" },
      { skillName: "Lábia", value: 2, category: "social" },
      {
        skillName: "Idiomas",
        value: 2,
        category: "languages",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Francês, Espanhol ou similares",
      },
    ],
    tagClass: "bg-red-900 text-white",
  },
  {
    name: "Íris",
    greekName: "Íris",
    romanName: "Arcus",
    effects: [
      { skillName: "Sedução", value: 2, category: "social" },
      { skillName: "Lábia", value: 2, category: "social" },
      {
        skillName: "Artes",
        value: 2,
        category: "arts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Pintura, Música ou similares",
      },
    ],
    tagClass: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white",
  },
  {
    name: "Ceto",
    greekName: "Ceto",
    romanName: "Ceto",
    effects: [
      { skillName: "Sobrevivência", value: 2, category: "complementary" },
      { skillName: "Forja", value: 2, category: "complementary" },
      {
        skillName: "Condução",
        value: 2,
        category: "driving",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Barcos, Submarinos ou similares",
      },
    ],
    tagClass: "bg-blue-950 text-white",
  },
  {
    name: "Asclépio & Esculápio",
    greekName: "Asclépio",
    romanName: "Esculápio",
    effects: [
      { skillName: "Medicina", value: 2, category: "complementary" },
      { skillName: "Prestidigitação", value: 2, category: "utility" },
      {
        skillName: "Ofícios",
        value: 2,
        category: "crafts",
        requiresUserInput: true,
        userInputPlaceholder: "Ex: Acupuntura, Terapias naturais ou similares",
      },
    ],
    tagClass: "bg-green-800 text-white",
  },
]

export const abilities = [
  { name: "Corpulento", attribute: "force", value: 2 },
  { name: "Habilidoso", attribute: "dexterity", value: 2 },
  { name: "Veloz", attribute: "agility", value: 2 },
  {
    name: "Sadio",
    attribute: "vigor",
    value: 2,
  },
  { name: "Arguto", attribute: "wisdom", value: 2 },
  { name: "Fascinante", attribute: "charisma", value: 2 },
  { name: "Diligente", attribute: "perception", value: 2 },
  { name: "Resoluto", attribute: "determination", value: 2 },
]

export const disabilities = [
  { name: "Lânguido", attribute: "force", value: -2 },
  { name: "Ababelado", attribute: "dexterity", value: -2 },
  { name: "Moroso", attribute: "agility", value: -2 },
  { name: "Tênue", attribute: "vigor", value: -2 },
  { name: "Incipiente", attribute: "wisdom", value: -2 },
  { name: "Ignóbil", attribute: "charisma", value: -2 },
  { name: "Desatento", attribute: "perception", value: -2 },
  { name: "Displicente", attribute: "determination", value: -2 },
]

const skillToCategoryMap: Record<string, SpecializationCategory | "combat" | "social" | "utility" | "complementary"> =
  {}
combatSkills.forEach((s) => (skillToCategoryMap[s] = "combat"))
socialSkills.forEach((s) => (skillToCategoryMap[s] = "social"))
utilitySkills.forEach((s) => (skillToCategoryMap[s] = "utility"))
complementarySkills.forEach((s) => (skillToCategoryMap[s] = "complementary"))

Object.entries(specializationCategories).forEach(([key, value]) => {
  skillToCategoryMap[value] = key as SpecializationCategory
})

export function calculateFinalSkills(
  baseCombat: Record<string, number>,
  baseSocial: Record<string, number>,
  baseUtility: Record<string, number>,
  baseComplementary: Record<string, number>,
  baseSpecialization: {
    languages: Record<string, number>
    arts: Record<string, number>
    knowledge: Record<string, number>
    driving: Record<string, number>
    crafts: Record<string, number>
    sports: Record<string, number>
  },
  selectedPeculiarities: string[],
  selectedTrejeitos: string[],
  selectedDivineParentName?: string,
  divineParentUserSpecializations?: Record<string, string>,
  selectedConductionBonuses?: Record<string, boolean>,
): {
  skills: Member["baseSkills"]
  globalEffects: GlobalSkillEffect[]
} {
  const skills: Member["baseSkills"] = {
    combat: { ...baseCombat },
    social: { ...baseSocial },
    utility: { ...baseUtility },
    complementary: { ...baseComplementary },
    specialization: {
      languages: { ...baseSpecialization.languages },
      arts: { ...baseSpecialization.arts },
      knowledge: { ...baseSpecialization.knowledge },
      driving: { ...baseSpecialization.driving },
      crafts: { ...baseSpecialization.crafts },
      sports: { ...baseSpecialization.sports },
    },
  }

  const globalEffects: GlobalSkillEffect[] = []

  selectedPeculiarities.forEach((pecName) => {
    const peculiarity = allPeculiarities.find((p) => p.name === pecName)
    if (peculiarity) {
      peculiarity.effects.forEach((effect) => {
        const category = skillToCategoryMap[effect.skill]
        if (category) {
          if (
            category === "combat" ||
            category === "social" ||
            category === "utility" ||
            category === "complementary"
          ) {
            globalEffects.push({ type: "individual", category: category, skillName: effect.skill, value: effect.value })
          } else {
            globalEffects.push({ type: "category", category: category, skillName: category, value: effect.value })
          }
        }
      })
    }
  })

  selectedTrejeitos.forEach((treName) => {
    const trejeito = allTrejeitos.find((t) => t.name === treName)
    if (trejeito) {
      trejeito.effects.forEach((effect) => {
        const category = skillToCategoryMap[effect.skill]
        if (category) {
          if (
            category === "combat" ||
            category === "social" ||
            category === "utility" ||
            category === "complementary"
          ) {
            globalEffects.push({ type: "individual", category: category, skillName: effect.skill, value: effect.value })
          } else {
            globalEffects.push({ type: "category", category: category, skillName: category, value: effect.value })
          }
        }
      })
    }
  })

  if (selectedDivineParentName) {
    const divineParent = allDivineParents.find((dp) => dp.name === selectedDivineParentName)
    if (divineParent) {
      divineParent.effects.forEach((effect) => {
        if (effect.isAutoApplied) {
          globalEffects.push({
            type: "individual",
            category: effect.category,
            skillName: capitalizeFirstLetter(effect.autoAppliedValue!),
            value: effect.value,
          })
        } else if (effect.requiresUserInput && divineParentUserSpecializations?.[effect.skillName]?.trim()) {
          globalEffects.push({
            type: "individual",
            category: effect.category,
            skillName: capitalizeFirstLetter(divineParentUserSpecializations[effect.skillName].trim()),
            value: effect.value,
          })
        } else if (!effect.requiresUserInput && !effect.isAutoApplied) {
          globalEffects.push({
            type: "individual",
            category: effect.category,
            skillName: effect.skillName,
            value: effect.value,
          })
        }
      })
    }
  }

  if (selectedConductionBonuses) {
    for (const skillName in selectedConductionBonuses) {
      if (selectedConductionBonuses[skillName]) {
        globalEffects.push({ type: "individual", category: "driving", skillName: skillName, value: 2 })
      }
    }
  }

  return {
    skills: skills,
    globalEffects,
  }
}

export type InitiativeResult = {
  memberId: string
  name: string
  teamName: string
  baseInitiative: number
  diceRoll: number
  perkModifierApplied: number
  totalInitiative: number
}

export type SkillTestResult = {
  id: string
  testName?: string
  characterName: string
  teamName: string
  skillType: string
  skillName: string
  attributeName: string
  skillValue: number
  attributeValue: number
  diceRoll: number
  totalResult: number
  timestamp: string
  isCombat: boolean
  difficultyLevel?: number
  isSuccess?: boolean
  globalDifficultyLevel?: number
  isGlobalSum?: boolean
  individualDifficultyLevel?: number
  customPhrase?: string
  customPhraseStatus?: "success" | "failure" | "neutral"
}

export type SkillTestGroup = {
  id: string
  testName?: string
  results: SkillTestResult[]
}

export type Round = {
  id: string
  name: string
  initiativeOrder: InitiativeResult[]
  skillTestGroups?: SkillTestGroup[]
  createdAt: string
}

export type BattleSheet = {
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

type RPType = "Oficial" | "Semi-Oficial" | "Livre"



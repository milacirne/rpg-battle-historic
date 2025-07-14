export type Member = {
  id: string
  name: string
  type: "semideus" | "humano" | "monstro"
  divineParent?: string // Agora armazenará o nome da filiação (ex: "Zeus & Júpiter")
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
  derivedGlobalSkillEffects?: GlobalSkillEffect[] // Novo campo para efeitos globais derivados
  divineParentUserSpecializations?: Record<string, string> // NOVO: Para especializações definidas pelo usuário
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
  sports: "Esportes",
} as const

export type SpecializationCategory = keyof typeof specializationCategories

export type AccordionState = {
  powers: boolean
  styles: boolean
  pericias: boolean // NOVO: Estado para o accordion principal de Perícias
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

export type GlobalSkillEffect = {
  type: "individual" | "category" // Novo campo para indicar o tipo de efeito
  category: SpecializationCategory | "combat" | "social" | "utility" | "complementary" // Categoria da perícia
  skillName: string // Nome da perícia específica ou nome da categoria (ex: "Luta", "Idiomas")
  value: number
}

// Helper function to capitalize the first letter and make the rest lowercase
function capitalizeFirstLetter(str: string): string {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const allPeculiarities: PeculiarityData[] = [
  {
    name: capitalizeFirstLetter("Cortês"),
    effects: [
      { skill: "Sedução", value: 2 },
      { skill: "Empatia", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("TROMBADINHA"),
    effects: [
      { skill: "Furtividade", value: 2 },
      { skill: "Prestidigitação", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("CAÇADOR"),
    effects: [
      { skill: "Medicina", value: 2 },
      { skill: "Sobrevivência", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("HACKER"),
    effects: [
      { skill: "Segurança", value: 2 },
      { skill: "Computação", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("BRUCUTU"),
    effects: [
      { skill: "Intimidação", value: 2 },
      { skill: "Atletismo", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("ESPIÃO"),
    effects: [
      { skill: "Furtividade", value: 2 },
      { skill: "Investigação", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("CURANDEIRO"),
    effects: [
      { skill: "Empatia", value: 2 },
      { skill: "Medicina", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("CHARLATÃO"),
    effects: [
      { skill: "Lábia", value: 2 },
      { skill: "Persuasão", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("MALABARISTA"),
    effects: [
      { skill: "Prestidigitação", value: 2 },
      { skill: "Acrobacia", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("FERREIRO"),
    effects: [
      { skill: "Forja", value: 2 },
      { skill: "Computação", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("EXPLORADOR"),
    effects: [
      { skill: "Sobrevivência", value: 2 },
      { skill: "Acrobacia", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("LADRÃO"),
    effects: [
      { skill: "Segurança", value: 2 },
      { skill: "Intimidação", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("MANIPULADOR"),
    effects: [
      { skill: "Lábia", value: 2 },
      { skill: "Sedução", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("SOLDADO"),
    effects: [
      { skill: "Forja", value: 2 },
      { skill: "Atletismo", value: 2 },
    ],
  },
  {
    name: capitalizeFirstLetter("OPORTUNISTA"),
    effects: [
      { skill: "Persuasão", value: 2 },
      { skill: "Investigação", value: 2 },
    ],
  },
  { name: capitalizeFirstLetter("ACADÊMICO"), effects: [{ skill: "Conhecimento", value: 2 }] },
  { name: capitalizeFirstLetter("ATLETA"), effects: [{ skill: "Esportes", value: 2 }] },
  { name: capitalizeFirstLetter("ARTISTA"), effects: [{ skill: "Artes", value: 2 }] },
  { name: capitalizeFirstLetter("LINGUISTA"), effects: [{ skill: "Idiomas", value: 2 }] },
  { name: capitalizeFirstLetter("PROFISSIONAL"), effects: [{ skill: "Ofícios", value: 2 }] },
  { name: capitalizeFirstLetter("MOTORISTA"), effects: [{ skill: "Condução", value: 2 }] },
]

export const allTrejeitos: TrejeitoData[] = [
  {
    name: capitalizeFirstLetter("BREGA"),
    effects: [
      { skill: "Persuasão", value: -2 },
      { skill: "Prestidigitação", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("FRANCO"),
    effects: [
      { skill: "Lábia", value: -2 },
      { skill: "Medicina", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("RÚSTICO"),
    effects: [
      { skill: "Computação", value: -2 },
      { skill: "Segurança", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("DESENGONÇADO"),
    effects: [
      { skill: "Acrobacia", value: -2 },
      { skill: "Atletismo", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("IRÔNICO"),
    effects: [
      { skill: "Persuasão", value: -2 },
      { skill: "Lábia", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("FOFO"),
    effects: [
      { skill: "Intimidação", value: -2 },
      { skill: "Sedução", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("BRUTO"),
    effects: [
      { skill: "Medicina", value: -2 },
      { skill: "Prestidigitação", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("NERD"),
    effects: [
      { skill: "Atletismo", value: -2 },
      { skill: "Empatia", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("DISTRAÍDO"),
    effects: [
      { skill: "Investigação", value: -2 },
      { skill: "Forja", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("IMPETUOSO"),
    effects: [
      { skill: "Sobrevivência", value: -2 },
      { skill: "Furtividade", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("DESTRUTIVO"),
    effects: [
      { skill: "Forja", value: -2 },
      { skill: "Segurança", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("DURÃO"),
    effects: [
      { skill: "Sedução", value: -2 },
      { skill: "Empatia", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("PREVISÍVEL"),
    effects: [
      { skill: "Furtividade", value: -2 },
      { skill: "Investigação", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("MIMADO"),
    effects: [
      { skill: "Intimidação", value: -2 },
      { skill: "Sobrevivência", value: -2 },
    ],
  },
  {
    name: capitalizeFirstLetter("DESASTRADO"),
    effects: [
      { skill: "Computação", value: -2 },
      { skill: "Acrobacia", value: -2 },
    ],
  },
  { name: capitalizeFirstLetter("BAIRRISTA"), effects: [{ skill: "Idiomas", value: -2 }] },
  { name: capitalizeFirstLetter("INDOLENTE"), effects: [{ skill: "Esportes", value: -2 }] },
  { name: capitalizeFirstLetter("PRETENSIOSO"), effects: [{ skill: "Artes", value: -2 }] },
  { name: capitalizeFirstLetter("CONSERVADOR"), effects: [{ skill: "Conhecimento", value: -2 }] },
  { name: capitalizeFirstLetter("RELAPSO"), effects: [{ skill: "Ofícios", value: -2 }] },
  { name: capitalizeFirstLetter("BARBEIRO"), effects: [{ skill: "Condução", value: -2 }] },
]

// NOVO: Tipo para efeitos de perícia de filiação divina
export type DivineSkillEffect = {
  skillName: string // O nome da perícia genérica (ex: "Artes", "Condução")
  value: number
  category: SpecializationCategory | "combat" | "social" | "utility" | "complementary"
  requiresUserInput?: boolean // Se true, o usuário precisa especificar uma sub-perícia
  userInputPlaceholder?: string // Ex: "Teatro ou similares", "veículos aéreos"
}

export type DivineParentData = {
  name: string // Nome da filiação (ex: "Zeus & Júpiter")
  greekName: string
  romanName: string
  effects: DivineSkillEffect[] // Usando o novo tipo DivineSkillEffect
  tagClass: string // Classe Tailwind para a cor da tag (ex: "bg-blue-500 text-white")
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
        requiresUserInput: true,
        userInputPlaceholder: "veículos aéreos",
      },
    ],
    tagClass: "bg-blue-600 text-white",
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
        requiresUserInput: true,
        userInputPlaceholder: "veículos aquáticos",
      },
    ],
    tagClass: "bg-cyan-600 text-white",
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
        requiresUserInput: true,
        userInputPlaceholder: "veículos terrestres",
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
        userInputPlaceholder: "Agricultura ou similares",
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
        userInputPlaceholder: "especificar",
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
        userInputPlaceholder: "especificar",
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
      { skillName: "Artes", value: 2, category: "arts", requiresUserInput: true, userInputPlaceholder: "especificar" },
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
        userInputPlaceholder: "especificar",
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
        userInputPlaceholder: "especificar",
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
        requiresUserInput: true,
        userInputPlaceholder: "Francês",
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
        userInputPlaceholder: "especificar",
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
        userInputPlaceholder: "Teatro ou similares",
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
        userInputPlaceholder: "Magia ou similares",
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
        userInputPlaceholder: "Floricultura ou similares",
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
        userInputPlaceholder: "Tanatologia ou similares",
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
        requiresUserInput: true,
        userInputPlaceholder: "Francês",
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
        userInputPlaceholder: "especificar",
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
        userInputPlaceholder: "especificar",
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
        userInputPlaceholder: "especificar",
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
        userInputPlaceholder: "Sobrenatural ou similar",
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
        requiresUserInput: true,
        userInputPlaceholder: "Espanhol",
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
        userInputPlaceholder: "Onirologia ou similares",
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
        userInputPlaceholder: "especificar",
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
      { skillName: "Artes", value: 2, category: "arts", requiresUserInput: true, userInputPlaceholder: "especificar" },
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
      { skillName: "Artes", value: 2, category: "arts", requiresUserInput: true, userInputPlaceholder: "especificar" },
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
        userInputPlaceholder: "especificar",
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
      { skillName: "Artes", value: 2, category: "arts", requiresUserInput: true, userInputPlaceholder: "especificar" },
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
        userInputPlaceholder: "veículo aquático",
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
        userInputPlaceholder: "Acupuntura ou similares",
      },
    ],
    tagClass: "bg-green-800 text-white",
  },
]

// Mapa auxiliar para encontrar a categoria de uma perícia
const skillToCategoryMap: Record<string, SpecializationCategory | "combat" | "social" | "utility" | "complementary"> =
  {}
combatSkills.forEach((s) => (skillToCategoryMap[s] = "combat"))
socialSkills.forEach((s) => (skillToCategoryMap[s] = "social"))
utilitySkills.forEach((s) => (skillToCategoryMap[s] = "utility"))
complementarySkills.forEach((s) => (skillToCategoryMap[s] = "complementary"))
// Mapeia os nomes de exibição das categorias de especialização para suas chaves
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
  divineParentUserSpecializations?: Record<string, string>, // NOVO: Parâmetro para especializações do usuário
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

  // Coleta todos os efeitos de Peculiaridades
  selectedPeculiarities.forEach((pecName) => {
    const peculiarity = allPeculiarities.find((p) => p.name === pecName)
    if (peculiarity) {
      peculiarity.effects.forEach((effect) => {
        const category = skillToCategoryMap[effect.skill] // effect.skill é o nome da perícia ou da categoria (ex: "Sedução", "Conhecimento")
        if (category) {
          if (
            category === "combat" ||
            category === "social" ||
            category === "utility" ||
            category === "complementary"
          ) {
            // Perícias gerais são sempre tratadas como efeitos individuais
            globalEffects.push({ type: "individual", category: category, skillName: effect.skill, value: effect.value })
          } else {
            // Categorias de especialização (Idiomas, Artes, etc.) são tratadas como efeitos de categoria
            globalEffects.push({ type: "category", category: category, skillName: effect.skill, value: effect.value })
          }
        }
      })
    }
  })

  // Coleta todos os efeitos de Trejeitos
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
            globalEffects.push({ type: "category", category: category, skillName: effect.skill, value: effect.value })
          }
        }
      })
    }
  })

  // NOVO: Coleta todos os efeitos da Filiação Divina
  if (selectedDivineParentName) {
    const divineParent = allDivineParents.find((dp) => dp.name === selectedDivineParentName)
    if (divineParent) {
      divineParent.effects.forEach((effect) => {
        let finalSkillName = effect.skillName
        let effectType: GlobalSkillEffect["type"] = "individual" // Padrão para individual

        if (effect.requiresUserInput && divineParentUserSpecializations?.[effect.skillName]?.trim()) {
          finalSkillName = divineParentUserSpecializations[effect.skillName].trim()
          effectType = "individual" // Especialização definida pelo usuário é um efeito individual
        } else if (effect.requiresUserInput && !divineParentUserSpecializations?.[effect.skillName]?.trim()) {
          // Se requer input mas não foi fornecido, ignora este efeito
          return
        } else {
          // Se não requer input do usuário, é um bônus para a categoria inteira (se for especialização)
          // ou um bônus individual para perícias gerais.
          if (
            effect.category === "languages" ||
            effect.category === "arts" ||
            effect.category === "knowledge" ||
            effect.category === "driving" ||
            effect.category === "crafts" ||
            effect.category === "sports"
          ) {
            effectType = "category"
            finalSkillName = specializationCategories[effect.category] // Usa o nome de exibição da categoria
          } else {
            effectType = "individual" // Para perícias de combate, social, utilidade, complementares
          }
        }

        globalEffects.push({
          type: effectType,
          category: effect.category,
          skillName: finalSkillName,
          value: effect.value,
        })
      })
    }
  }

  return {
    skills: skills,
    globalEffects,
  }
}











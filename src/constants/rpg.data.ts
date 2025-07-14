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
  derivedGlobalSkillEffects?: GlobalSkillEffect[] // Novo campo para efeitos globais derivados
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

// Mapa auxiliar para encontrar a categoria de uma perícia
// Este mapa agora inclui tanto habilidades específicas quanto nomes de categorias de especialização
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
): {
  skills: Member["baseSkills"]
  globalEffects: GlobalSkillEffect[]
} {
  // 'skills' aqui representa os baseSkills, não os valores finais com bônus aplicados.
  // Eles são passados adiante para o MemberInfoModal que fará o cálculo final para exibição.
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

  const processEffect = (effectSkillName: string, value: number) => {
    const category = skillToCategoryMap[effectSkillName]

    if (category) {
      // Se a perícia do efeito está em uma das categorias principais (combate, social, etc.)
      if (category === "combat" || category === "social" || category === "utility" || category === "complementary") {
        // É um efeito em uma perícia individual (ex: "Sedução")
        globalEffects.push({
          type: "individual",
          category: category,
          skillName: effectSkillName,
          value: value,
        })
      } else {
        // É um efeito em uma categoria de especialização (ex: "Idiomas", "Conhecimento")
        globalEffects.push({
          type: "category",
          category: category,
          skillName: effectSkillName, // Salva o nome de exibição da categoria (ex: "Idiomas")
          value: value,
        })
      }
    }
  }

  // Coleta todos os efeitos de Peculiaridades
  selectedPeculiarities.forEach((pecName) => {
    const peculiarity = allPeculiarities.find((p) => p.name === pecName)
    if (peculiarity) {
      peculiarity.effects.forEach((effect) => {
        processEffect(effect.skill, effect.value)
      })
    }
  })

  // Coleta todos os efeitos de Trejeitos
  selectedTrejeitos.forEach((treName) => {
    const trejeito = allTrejeitos.find((t) => t.name === treName)
    if (trejeito) {
      trejeito.effects.forEach((effect) => {
        processEffect(effect.skill, effect.value)
      })
    }
  })

  return {
    skills: skills,
    globalEffects,
  } // Retorna os baseSkills e os efeitos globais
}









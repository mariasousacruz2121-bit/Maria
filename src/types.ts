import { motion } from "motion/react";

export interface User {
  id: number;
  username: string;
  house: string;
  role: "user" | "admin";
}

export interface Spell {
  id: string;
  name: string;
  difficulty: "Iniciante" | "Básico" | "Intermediário" | "Mestre";
  description: string;
  icon: string;
  stars: number;
}

export interface Creature {
  id: string;
  name: string;
  danger: number;
  description: string;
  image: string;
}

export interface House {
  id: string;
  name: string;
  description: string;
  color: string;
  accent: string;
  icon: string;
}

export const SPELLS: Spell[] = [
  {
    id: "1",
    name: "Expecto Patronum",
    difficulty: "Mestre",
    description: "Conjura um guardião de luz prateada, uma manifestação de felicidade pura para repelir Dementadores.",
    icon: "shield_with_heart",
    stars: 5,
  },
  {
    id: "2",
    name: "Wingardium Leviosa",
    difficulty: "Básico",
    description: "Um dos primeiros feitiços ensinados a jovens bruxos. Permite a levitação de objetos através de movimentos suaves.",
    icon: "air",
    stars: 2,
  },
  {
    id: "3",
    name: "Expelliarmus",
    difficulty: "Intermediário",
    description: "O feitiço de desarmamento. Essencial para duelos, força o oponente a largar sua varinha instantaneamente.",
    icon: "flash_on",
    stars: 3,
  },
  {
    id: "4",
    name: "Lumos",
    difficulty: "Iniciante",
    description: "Ilumina a ponta da varinha do conjurador. Simples, mas indispensável em masmorras e florestas escuras.",
    icon: "lightbulb",
    stars: 1,
  },
  {
    id: "5",
    name: "Episkey",
    difficulty: "Intermediário",
    description: "Cura ferimentos leves e fraturas simples. Essencial para primeiros socorros após treinos de Quadribol.",
    icon: "healing",
    stars: 3,
  },
  {
    id: "6",
    name: "Alohomora",
    difficulty: "Básico",
    description: "O feitiço de abertura. Destranca portas e janelas que não estejam protegidas por magia avançada.",
    icon: "lock_open",
    stars: 2,
  },
];

export const HOUSES: House[] = [
  {
    id: "gryffindor",
    name: "Gryffindor",
    description: "Coragem, bravura e determinação definem os leões.",
    color: "#740001",
    accent: "#d4af37",
    icon: "shield",
  },
  {
    id: "slytherin",
    name: "Slytherin",
    description: "Ambição, astúcia e liderança são as nossas marcas.",
    color: "#1b5e20",
    accent: "#aaaaaa",
    icon: "emergency",
  },
  {
    id: "ravenclaw",
    name: "Ravenclaw",
    description: "Inteligência, criatividade e sabedoria infinita.",
    color: "#0e1a40",
    accent: "#946b2d",
    icon: "change_history",
  },
  {
    id: "hufflepuff",
    name: "Hufflepuff",
    description: "Lealdade, paciência e trabalho duro com justiça.",
    color: "#ecb939",
    accent: "#000000",
    icon: "home",
  },
];

export const CREATURES: Creature[] = [
  {
    id: "1",
    name: "Hipogrifo",
    danger: 3,
    description: "Metade águia e metade cavalo, o Hipogrifo é uma criatura de orgulho imenso que exige respeito absoluto antes de qualquer aproximação.",
    image: "https://picsum.photos/seed/hippogriff/800/600",
  },
  {
    id: "2",
    name: "Fênix",
    danger: 2,
    description: "Pássaros magníficos que explodem em chamas ao chegar no fim da vida, renascendo das cinzas. Suas lágrimas possuem imenso poder curativo.",
    image: "https://picsum.photos/seed/phoenix/800/600",
  },
  {
    id: "3",
    name: "Pelúcio",
    danger: 2,
    description: "Pequenas criaturas de focinho longo e pelagem fofa, conhecidas por sua obsessão por tudo que brilha, especialmente ouro e joias.",
    image: "https://picsum.photos/seed/niffler/800/600",
  },
  {
    id: "4",
    name: "Tronquilho",
    danger: 2,
    description: "Guardiões de árvores que parecem gravetos vivos. São extremamente tímidos, mas podem ser ferozes se sua árvore for ameaçada.",
    image: "https://picsum.photos/seed/bowtruckle/800/600",
  },
  {
    id: "5",
    name: "Testrálio",
    danger: 4,
    description: "Cavalos alados esqueléticos visíveis apenas por aqueles que já testemunharam a morte. Criaturas incompreendidas de grande lealdade.",
    image: "https://picsum.photos/seed/thestral/800/600",
  },
];

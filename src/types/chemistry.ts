export type AtomType = 'C' | 'H' | 'O' | 'N' | 'Cl' | 'Br'

export interface MoleculeAtom {
  id: string
  element: AtomType
  x: number
  y: number
  label?: string
}

export interface MoleculeBond {
  from: string
  to: string
  order: 1 | 2 | 3
}

export interface Molecule {
  id: string
  name: string
  iupacName: string
  formula: string
  condensedFormula: string
  molecularWeight: number
  category: 'Alkana' | 'Alkena' | 'Alkuna' | 'Alkohol' | 'Eter' | 'Aldehida' | 'Keton' | 'Asam Karboksilat' | 'Ester' | 'Aromatik'
  description: string
  bondTypes: string[]
  functionalGroup?: string
  dailyUses: string
  boilingPoint: string
  stateAtRoomTemp: 'Gas' | 'Cair' | 'Padat'
  isFeatured?: boolean
  atoms: MoleculeAtom[]
  bonds: MoleculeBond[]
}

export interface LessonSection {
  id: string
  title: string
  content: string
  keyTakeaways: string[]
}

export interface LessonModule {
  id: string
  slug: string
  moduleNumber: number
  title: string
  subtitle: string
  category: string
  description: string
  topics: string[]
  keyFormula?: string
  iconName: string
  badgeText: string
  estimatedMinutes: number
}

export interface QuizQuestion {
  id: string
  category: string
  stimulus?: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  reasoningLevel: 'Pemahaman' | 'Penerapan' | 'Analisis' | 'Penalaran Induktif' | 'Evaluasi'
  difficulty: 'Dasar' | 'Menengah' | 'HOTS'
}

export interface LearningObjective {
  id: number
  code: string
  title: string
  description: string
  category: string
}

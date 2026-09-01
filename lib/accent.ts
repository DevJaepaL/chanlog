export type AccentColor =
  | "sky"
  | "purple"
  | "pink"
  | "orange"
  | "teal"
  | "green";

const DOT: Record<AccentColor, string> = {
  sky: "bg-accent-sky",
  purple: "bg-accent-purple",
  pink: "bg-accent-pink",
  orange: "bg-accent-orange",
  teal: "bg-accent-teal",
  green: "bg-accent-green",
};

export const accentDotClass = (accent: AccentColor) => DOT[accent];

const PROJECT_SKILL_ACCENTS: Record<string, AccentColor> = {
  Python: "orange",
  Java: "orange",
  FastAPI: "teal",
  "REST API": "teal",
  MSA: "teal",
  Spring: "teal",
  LangChain: "purple",
  LangGraph: "purple",
  RAG: "purple",
  "데이터 전처리": "purple",
  MariaDB: "pink",
  MongoDB: "pink",
  "Mongo DB": "pink",
  Docker: "sky",
  Podman: "sky",
  Kubernetes: "sky",
  Git: "sky",
  ReactJS: "green",
  PyQGIS: "sky",
  GIS: "sky",
  PyQt6: "green",
  "Cron Scheduler": "sky",
  RPA: "teal",
};

export function projectSkillAccent(skill: string): AccentColor | undefined {
  return PROJECT_SKILL_ACCENTS[skill];
}

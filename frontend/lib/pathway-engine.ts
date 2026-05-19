import pathways from "../data/career-pathways.json";

export function generatePathways(targetRole: string) {
  return pathways.filter(
    (pathway) =>
      pathway.career.toLowerCase().includes(targetRole.toLowerCase())
  );
}
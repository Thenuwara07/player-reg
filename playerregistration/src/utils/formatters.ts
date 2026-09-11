// src/utils/formatters.ts
import type { AssociationRef, ClubRef } from "@/types/playerViewDataTypes";

export const fmtAssoc = (a?: AssociationRef | null) => {
  if (!a) return "-";
  if (a.name && a.code) return `${a.name} (${a.code})`;
  return a.name ?? a.code ?? "-";
};

export const fmtClub = (c?: ClubRef | null) => {
  if (!c) return "-";
  if (c.name && c.code) return `${c.name} (${c.code})`;
  return c.name ?? c.code ?? "-";
};

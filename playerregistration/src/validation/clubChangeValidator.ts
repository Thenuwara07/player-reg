import {
  User1 } from "../types/index";

export interface ClubChangeData {
  type: "open" | "close";
  userId: string | null;
  currentClubId: number | null;
  currentAssId: number | null;
  currentClub: string | null;
  currentAss: string | null;
  newClubId: number | null;
  newAssId: number | null;
  newClub: string | null;
  newAss: string | null;
  currentImage: string | null;
  newImage: string | null;
  currentClubCode: string | null;
  newClubCode: string | null;
  currentAssCode: string | null;
  newAssCode: string | null;
  resignDate: string | null;
}

/**
 * Returns null if valid, or a human-friendly error message if invalid.
 */
export function validateClubChange(
  currentUser: User1 | null | undefined,
  clubChangeData: ClubChangeData
): string | null {
  const isOpen = clubChangeData.type === "open";
  const isClose = clubChangeData.type === "close";
  const hasOpenMembership = !!currentUser?.player?.openAssId;
  const hasCloseMembership = !!currentUser?.player?.closeAssId;

  // Only these close associations have clubs to pick (schools, universities,
  // mercantile: ids 4/5/6) — the same rule the club change form uses to show
  // the "New Close Club" field. All other close associations have no club.
  const closeAssNeedsClub =
    ["SL Schools", "SL Universities", "Mercantiles"].includes(clubChangeData.newAss ?? "") ||
    [4, 5, 6].includes(Number(clubChangeData.newAssId));

  // Case 1: User is in an open club and is changing an "open" club

  if (isOpen) {
    if (hasOpenMembership && isOpen) {
      if (!clubChangeData.resignDate) {
        return "Please select the resign date";
      }
      if (!clubChangeData.currentImage) {
        return "Please upload a resignation letter images";
      }
    }
    if (!clubChangeData.newAssId) {
      return "Please select a new open association";
    }
    if (!clubChangeData.newClubId) {
      return "Request failed! Select a new open club";
    }
    if (!clubChangeData.newImage) {
      return "Please upload a offer letter images";
    }
    return null;
  }

  // Case 2: User is in a close club and is changing a "close" club
  if (isClose) {
    if (hasCloseMembership && isClose) {
      if (!clubChangeData.resignDate) {
        return "Please select the resign date";
      }
      if (!clubChangeData.currentImage) {
        return "Please upload a resignation letter images";
      }
    }
    if (!clubChangeData.newAssId) {
      return "Please select a new close association";
    }
    if (closeAssNeedsClub) {
      if (!clubChangeData.newClubId) {
        return "Request failed! Select a new close club";
      }
    }
    if (!clubChangeData.newImage) {
      return "Please upload a offer letter images";
    }
    return null;
  }

  return null;
}

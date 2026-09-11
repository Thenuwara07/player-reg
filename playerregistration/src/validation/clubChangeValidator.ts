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

  const isArmy = clubChangeData.newAss === "SL Army";
  const isNavy = clubChangeData.newAss === "SL Navy";
  const isAirForce = clubChangeData.newAss === "SL Air Force";
  const isPolice = clubChangeData.newAss === "SL Police";

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
    if (!isArmy && !isNavy && !isAirForce && !isPolice) {
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

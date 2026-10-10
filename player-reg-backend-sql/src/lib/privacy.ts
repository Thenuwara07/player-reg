// What personal data each caller may see.
// Admins and the player themselves get the full record; everyone else
// (public Players page, other players) gets a public profile without
// contact details, NIC, birth date or ID-document images.

const PRIVATE_USER_FIELDS = ["email", "nicNum", "contact", "dateofBirth", "password"] as const;
const PRIVATE_PLAYER_FIELDS = ["idFrontImage", "idBackImage", "idType"] as const;

export const ageFromBirthDate = (birthDate: Date | string | null | undefined): number | null => {
  if (!birthDate) return null;
  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) age--;
  return age;
};

/** Public version of a user (with optional nested player) — adds `age`. */
export const toPublicUser = <T extends Record<string, any>>(user: T) => {
  const copy: Record<string, any> = { ...user, age: ageFromBirthDate(user.dateofBirth) };
  for (const field of PRIVATE_USER_FIELDS) delete copy[field];
  delete copy.pendingPayment;
  if (copy.player) {
    copy.player = { ...copy.player };
    for (const field of PRIVATE_PLAYER_FIELDS) delete copy.player[field];
  }
  return copy;
};

/** True when the logged-in caller may see this user's private data. */
export const canSeePrivateData = (
  requester: { id?: number; role?: string } | undefined,
  ownerId: number
) => requester?.role === "admin" || (requester?.id !== undefined && Number(requester.id) === ownerId);

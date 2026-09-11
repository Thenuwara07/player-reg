// Common nested shapes
export type AssociationRef = {
  id: number;
  name: string;
  code: string;
};

export type ClubRef = {
  id: number;
  name: string;
  code: string;
};

// Player with both FK ids and populated relation objects
export type Player = {
  id: number;
  userId: number;

  slbfId?: string | null;
  weight?: number | null;
  height?: number | null;

  idType?: string | null;
  idFrontImage?: string | null;
  idBackImage?: string | null;

  // Foreign key ids (from your sample)
  openAssId?: number | null;
  closeAssId?: number | null;
  closeClubId?: number | null;
  openClubId?: number | null;

  closeClubChagngeDate?: string | null; // keeping your spelling from sample
  openClubChagngeDate?: string | null;  // keeping your spelling from sample

  regDate?: string | null;
  regExpDate?: string | null;

  createdAt: string;
  updatedAt: string;

  // Populated relations
  openAssociation?: AssociationRef | null;
  closeAssociation?: AssociationRef | null;
  openClub?: ClubRef | null;
  closeClub?: ClubRef | null;
};

// If you already have a Payment type elsewhere, keep using it.
// Otherwise you can stub it like: export type Payment = Record<string, unknown>;

export type User1 = {
  id: number;
  email: string;
  // password is not present in your dataset; keep optional to avoid breaking older code
  password?: string;

  fullName: string;
  firstName: string;
  lastName: string;

  nicNum: string;          // idCardNumber in your FormData
  contact: string;         // contactNumber in your FormData
  dateofBirth: string;     // ISO string (e.g., "2000-10-04T00:00:00.000Z")
  gender: string;
  role: string;
  status: string;
  district: string;

  profilePictureName: string;
  createdAt: string;

  // Player object can be null if not created yet
  player: Player | null;

  // Keep if used elsewhere in your app
};

export type PlayersResponse = {
  success: boolean;
  data: User1[];
  meta: {
    count: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
};
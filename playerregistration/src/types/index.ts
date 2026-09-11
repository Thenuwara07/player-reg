
// export interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   fullName: string;
//   dateOfBirth: string;
//   district: string;
//   province: string;
//   idCardNumber: string;
//   contactNumber: string;
//   weight: number;
//   height: number;
//   profileImage?: string;
//   idCardImage?: string;
//   openClub?: string;
//   closeClub?: string;
//   registeredDate: string;
//   expiryDate: string;
//   status: 'pending' | 'confirmed' | 'rejected';
//   role: 'player' | 'admin';
// }

import { stringify } from "querystring";

export interface User {
  id: string;
  firstname: string;
  role: "superadmin" | "admin" | "player";
  status: "confirmed" | "banned" | "pending";
}

export type User1 = {
  id: number;
  email: string;
  password: string;
  fullName: string;
  firstName: string;
  lastName: string;
  nicNum: string;  // This is called idCardNumber in your FormData
  contact: string; // This is called contactNumber in your FormData
  dateofBirth: string; // Note the lowercase 'o' in your data
  gender: string;
  role: string;
  status: string;
  district: string;
  profilePictureName: string;
  createdAt: string;
  player: Player | null;
  payments?: Payment;
};

export type Player = {
  id: number;
  slbfId: string | null;
  userId: number;
  weight: number | null;
  height: number | null;
  idType: string | null;
  idFrontImage: string | null;
  idBackImage: string | null;
  closeClubChagngeDate: string | null;
  openClubChagngeDate: string | null;
  closeClubId: number | null;
  openClubId: number | null;
  openAssId: number | null;
  closeAssId: number | null;
  regDate: string | null;
  regExpDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface Payment {
  id: string;
  userId: string;
  referenceNo: string;
  slipImage: string;
  user: User1;
  createdAt: string;
}

export interface Clubchangedetails {
  id: string;
  userId: string;
  type: string; // 'open' or 'close'
  newClubId: number;
  newClubName?: string;
  newAssName: string;
  newAssId: number;
  newClubCode: string;
  newAssCode: string;
  newImage: string; 
  oldClubId: number; 
  oldClubName?: string;
  oldAssId: number;
  oldAssName: string;
  oldClubCode: string; 
  oldAssCode: string; 
  oldImage: string;
  createdAt?: string;
  user : User1;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  author: string;
}

export interface ClubChangeRequest {
  id: string;
  userId: string;
  currentOpenClub?: string;
  currentCloseClub?: string;
  requestedOpenClub: string;
  requestedCloseClub: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ExtensionRequest {
  id: string;
  userId: string;
  currentExpiryDate: string;
  requestedExtension: number; // months
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Filename {
  filename: string;
}

export interface UpdateTableField {
  id: string;
  table: string;
  column: string;
  value: string | number;
}

export type UpdateTableFields = {
  id: number | string;
  table: string;
  updates: Record<string, any>; // e.g. { name: "John", status: "active" }
};

export interface UpdateRegDate {
  id: string;
  regDate: string;
  expDate: string;
}

export interface ResponseupdateTableField {
  success: boolean;
  message: string;
}

export interface RegRequest {
  userId: string;
  reffernceNo: string; // Optional field for reference number
  slipImage: string;
}

export interface ClubRequest {
  userId: string;
  type: string;
  newImage: string;
  newClub?: string;
  newClubId?: number;
  newAss: string;
  newAssId: number;
  newClubCode?: string;
  newAssCode: string;
  currentImage?: string;
  currentClubId?: number;
  currentClub?: string;
  currentAssId?: number;
  currentAss?: string;
  currentClubCode?: string;
  currentAssCode?: string;
  resignDate?: string; // Optional field for resign date
}

export interface Closeclub {
  id: string;
  name: string;
  code: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Openclub {
  id: string;
  name: string;
  code: string;
  district: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface University {
  id: string;
  name: string;
  code: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  town: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MercClub {
  id: string;
  name: string;
  code: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetAssClubDetails {
  id: string;
  name: string;
  code: string;
}

export interface UserUpdateDetails {
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  contact?: string;
  weight?: number;
  height?: number;
}

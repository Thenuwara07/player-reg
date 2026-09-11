export type FormData = {
  fullName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  district: string;
  idCardNumber: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
  profilePictureName: string;
  weight?: string;
  height?: string;
  idType?: string;
  idFrontImageName?: string;
  idBackImageName?: string;
};
export type AdminSignupData = {
  fullName: string;
  firstName: string;
  lastName: string;
  dateOfbirth: string;
  gender: string;
  district: string;
  idCardNumber: string;
  email: string;
  contactNumber: string;
  password: string;
};

export type SigninData = {
  username: string;
  password: string;
};

export type SignUpResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

export type PlayerAllData = {
  fullName: string;
  firstName: string;
  lastName: string;
  dateofBirth: string;
  gender: string;
  role: "player";
  district: string;
  nicNum: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
  profilePictureName?: string;
  weight?: string;
  height?: string;
  idType?: string;
  idFrontImageName?: string;
  idBackImageName?: string;
  slbfId?: string;
  closeClub?: string;
  openClub?: string;
  registeredDate?: string;
  expiryDate?: string;
  status?: string;
  openClubChagngeDate?: string; // fix typo here
  closeClubChagngeDate?: string; // fix typo here
};

export type User = {
  id: number;
  email: string;
  password: string;
  fullName: string;
  firstName: string;
  lastName: string;
  nicNum: string; // This is called idCardNumber in your FormData
  contact: string; // This is called contactNumber in your FormData
  dateofBirth: string; // Note the lowercase 'o' in your data
  gender: string;
  role: string;
  status: string;
  district: string;
  profilePictureName: string;
  createdAt: string;
  player: Player | null;
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
  closeAssId: number | null;
  closeClubId: number | null;
  closeClubChangeDate: string | null;
  openAssId: number | null;
  openClubId: number | null;
  openClubChangeDate: string | null;
  regDate: string | null;
  regExpDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: number;
  title: string;
  subtitle?: string | null;
  content: string;
  imageName: string; // server filename or absolute URL
  userId: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  user: User;
};

export type DefaultDetails = {
  id: number;
  herotitle: string;
  herosubtitle?: string | null;
  imageName?: string | null;
  openclubchangeperiodMonths: string;
  userId: string;
};


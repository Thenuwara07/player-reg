import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  playerDetails,
  AllCloseclubsDetails,
  AllOpenclubsDetails,
  AllUniversities,
  AllSchools,
  AllMercClubs,
  AllAssociations,
  AllOpenClubsByAssociationId,
} from "@/api/commonApi";
import {
  GetAssDetails,
  GetClubDetails,
  updateTableFeilds,
  updateTableFeild,
} from "@/api/adminApi";
import { FaTimes } from "react-icons/fa";
import { imageUpload, saveFileLocally } from "../api/fileApi";
import {
  regRequest,
  clubchangeRequest,
  userdetailsUpdate,
} from "@/api/userApi";
import { RegRequest } from "@/types/index";
import SearchableFreeTextClubInput from "../components/models/SearchableFreeTextClubInput";
import { set } from "date-fns";
import { validateClubChange } from "../validation/clubChangeValidator";
import ConfirmProfileModal, {
  ProfileData,
} from "../components/models/ConfirmProfileModal";
import type { DefaultDetails } from "@/types/authTypes";
import { GetdeafaultDetails } from "@/api/postApi";

const IMG_URL = import.meta.env.VITE_IMG_URL as string;

const Profile = () => {
  const { user: authUser } = useAuth();
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [closeclubInfo, setCloseclubInfo] = useState<any>(null); // Fixed typo seCloseclubInfo
  const [openclubInfo, setOpenclubInfo] = useState<any>(null);   // Fixed typo seOpenclubInfo
  const [allschools, setAllschools] = useState<any>(null);
  const [alluniversities, setAlluniversities] = useState<any>(null);
  const [allmercclubs, setAllmercclubs] = useState<any>(null);
  const [allassociations, setAllassociations] = useState<any>(null);
  const [allassopenclubs, setAllassopenclubs] = useState<any>(null);
  const [openassdetails, setOpenAssdetails] = useState<any>(null);
  const [openclubdetails, setOpenclubdetails] = useState<any>(null);
  const [closeassdetails, setCloseAssdetails] = useState<any>(null);
  const [closeclubdetails, setCloseclubdetails] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [regopen, setRegopen] = useState(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [formData, setFormData] = useState<DefaultDetails | null>(null);

  const currentUser = playerInfo;

  useEffect(() => {
    if (authUser?.id && !playerInfo) {
      fetchPlayerData();
      fetchAllCloseclubData();
      fetchAllOpenclubData();
      fetchAllUniversities();
      fetchAllSchools();
      fetchAllMercClubs();
      fetchAllAssosiatons();
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [authUser?.id, playerInfo]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await GetdeafaultDetails();

      let initialData: DefaultDetails | null = null;

      if (Array.isArray(data) && data.length > 0) {
        initialData = data[0];
      } else if (data && !Array.isArray(data)) {
        initialData = data as DefaultDetails;
      }

      if (initialData) {
        setFormData(initialData);
      }
    } catch (error) {
      console.error("Failed to load settings", error);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const getAssClubdetails = async (
    openAssId?: number,
    openclubId?: number,
    closeAssId?: number,
    closeClubId?: number
  ) => {
    try {
      setLoading(true);
      if (openAssId) {
        const openAssData = await GetAssDetails("open", openAssId);
        setOpenAssdetails(openAssData);
        const openClubData = await GetClubDetails(
          "open",
          openAssId,
          openclubId
        );
        setOpenclubdetails(openClubData);
      }
      if (closeAssId) {
        const closeAssData = await GetAssDetails("close", closeAssId);
        setCloseAssdetails(closeAssData);
        if (closeClubId) {
          const closeClubData = await GetClubDetails(
            "close",
            closeAssId,
            closeClubId
          );
          setCloseclubdetails(closeClubData);
        }
      }
    } catch (error) {
      toast.error("Failed to load association and club details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerData = async () => {
    try {
      const userId = parseInt(authUser?.id || "0"); // Handled possible undefined
      if (!userId) {
        setLoading(false);
        return;
      }

      const playerData = await playerDetails(userId);
      setPlayerInfo(playerData);
      getAssClubdetails(
        playerData?.player?.openAssId,
        playerData?.player?.openClubId,
        playerData?.player?.closeAssId,
        playerData?.player?.closeClubId
      );
    } catch (error) {
      toast.error("Failed to load player details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCloseclubData = async () => {
    try {
      const userId = parseInt(authUser?.id || "0");
      if (!userId) {
        setLoading(false);
        return;
      }

      const allcloseData = await AllCloseclubsDetails();
      setCloseclubInfo(allcloseData); // Fixed typo seCloseclubInfo
    } catch (error) {
      toast.error("Failed to load club details.");
    } finally {
      setLoading(false);
    }
  };

  const closeclubs = (closeclubInfo ?? []).map((c: any) => c.name);
  const closecodeByName = Object.fromEntries(
    (closeclubInfo ?? []).map((c: any) => [c.name, c.code])
  );

  const fetchAllOpenclubData = async () => {
    try {
      const userId = parseInt(authUser?.id || "0");
      if (!userId) {
        setLoading(false);
        return;
      }

      const allopenData = await AllOpenclubsDetails();
      setOpenclubInfo(allopenData); // Fixed typo seOpenclubInfo
    } catch (error) {
      toast.error("Failed to load club details.");
    } finally {
      setLoading(false);
    }
  };

  const openclubs = (openclubInfo ?? []).map((c: any) => c.name);
  const opencodeByName = Object.fromEntries(
    (openclubInfo ?? []).map((c: any) => [c.name, c.code])
  );

  const fetchAllUniversities = async () => {
    try {
      const userId = parseInt(authUser?.id || "0");
      if (!userId) {
        setLoading(false);
        return;
      }

      const alluniData = await AllUniversities();
      setAlluniversities(alluniData);
    } catch (error) {
      toast.error("Failed to load Uni details.");
    } finally {
      setLoading(false);
    }
  };

  const unies = (alluniversities ?? []).map((c: any) => c.name);
  const uniescodeByName = Object.fromEntries(
    (alluniversities ?? []).map((c: any) => [c.name, c.code])
  );

  const fetchAllSchools = async () => {
    try {
      const userId = parseInt(authUser?.id || "0");
      if (!userId) {
        setLoading(false);
        return;
      }

      const allschoolData = await AllSchools();
      setAllschools(allschoolData);
    } catch (error) {
      toast.error("Failed to load school details.");
    } finally {
      setLoading(false);
    }
  };

  const schools = (allschools ?? []).map((c: any) => c.name);
  const schoolscodeByName = Object.fromEntries(
    (allschools ?? []).map((c: any) => [c.name, c.code])
  );

  const fetchAllMercClubs = async () => {
    try {
      const userId = parseInt(authUser?.id || "0");
      if (!userId) {
        setLoading(false);
        return;
      }

      const allmercclubsData = await AllMercClubs();
      setAllmercclubs(allmercclubsData);
    } catch (error) {
      toast.error("Failed to load Merc club details.");
    } finally {
      setLoading(false);
    }
  };

  const mercclubs = (allmercclubs ?? []).map((c: any) => c.name);
  const mercclubscodeByName = Object.fromEntries(
    (allmercclubs ?? []).map((c: any) => [c.name, c.code])
  );

  const fetchAllAssosiatons = async () => {
    try {
      const userId = parseInt(authUser?.id || "0");
      if (!userId) {
        setLoading(false);
        return;
      }

      const allassociationData = await AllAssociations();
      setAllassociations(allassociationData);
    } catch (error) {
      toast.error("Failed to load Associations details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAssOpenclubs = async (assId: number) => {
    try {
      const userId = parseInt(authUser?.id || "0");
      if (!userId) {
        setLoading(false);
        return;
      }

      const allassopenclubData = await AllOpenClubsByAssociationId(assId);
      setAllassopenclubs(allassopenclubData);
    } catch (error) {
      toast.error("Failed to load Openclubs details.");
    } finally {
      setLoading(false);
    }
  };

  const status = playerInfo?.status;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    userId: currentUser?.id,
    firstName: currentUser?.firstName,
    lastName: currentUser?.lastName,
    email: currentUser?.email,
    contact: currentUser?.contact,
    weight: currentUser?.player?.weight,
    height: currentUser?.player?.height,
  });

  const [clubChangeData, setClubChangeData] = useState({
    type: "",
    userId: "",
    currentClubId: null,
    currentAssId: null,
    currentClub: "",
    currentAss: "",
    newClubId: null,
    newAssId: 0,
    newClub: "",
    newAss: "",
    currentImage: "",
    newImage: "",
    currentClubCode: "",
    newClubCode: "",
    currentAssCode: "",
    newAssCode: "",
    resignDate: "",
  });

  const [extensionData, setExtensionData] = useState({
    months: "",
    reason: "",
  });

  const [showClubModal, setShowClubModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    userId: "",
    reffernceNo: "",
    slipImage: "",
  });
  const [previews, setPreviews] = useState({
    slip: "",
    currentletter: "",
    newletter: "",
  });

  const slipFileRef = React.useRef<HTMLInputElement>(null);
  const lettercurrentFileRef = React.useRef<HTMLInputElement>(null);
  const letternewFileRef = React.useRef<HTMLInputElement>(null);
  let tempSliptName: string | null = null;
  let tempCurrentName: string | null = null;
  let tempNewName: string | null = null;

  const handleSaveProfile = () => {
    setEditData((prev) => ({
      ...prev,
      userId: currentUser?.id
        ? parseInt(String(currentUser?.id), 10)
        : prev.userId,
    }));
    const isfname =
      editData.firstName !== currentUser?.firstName &&
      editData.firstName !== undefined;
    const islname =
      editData.lastName !== currentUser?.lastName &&
      editData.lastName !== undefined;
    const isemail =
      editData.email !== currentUser?.email && editData.email !== undefined;
    const iscontact =
      editData.contact !== currentUser?.contact &&
      editData.contact !== undefined;
    const isweight =
      editData.weight !== currentUser?.player?.weight &&
      editData.weight !== undefined;
    const isheight =
      editData.height !== currentUser?.player?.height &&
      editData.height !== undefined;

    if (
      !isfname &&
      !islname &&
      !isemail &&
      !iscontact &&
      !isweight &&
      !isheight
    ) {
      toast.error("No changes made to save.");
      setIsEditing(false);
      return;
    }
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    try {
      const updatedData = await userdetailsUpdate(editData);
      if (updatedData.success) {
        toast.success("Profile updated successfully!");
        fetchPlayerData();
      } else {
        toast.error(
          updatedData.message || "Profile update failed. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
    }

    setIsEditing(false);
    setShowConfirm(false);
  };

  const cancelSave = () => {
    setShowConfirm(false);
  };

  const handleExtensionRequest = () => {
    if (!extensionData.months || !extensionData.reason) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Extension request submitted successfully!");
    setExtensionData({ months: "", reason: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClubInputChange = (field: string, value: string) => {
    setClubChangeData((prev) => ({ ...prev, [field]: value }));
  };

  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [opencloseDialog, setOpencloseDialog] = useState(false);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading profile...</div>;
  }

  if (!currentUser) {
    return <div className="p-4 text-gray-500">User not found</div>;
  }

  const calculateDaysRemaining = (
    expiryDate: string | undefined
  ): number | string => {
    if (!expiryDate) return "N/A";

    const expiry = new Date(expiryDate);
    const today = new Date();

    if (isNaN(expiry.getTime())) return "Invalid date";

    const diffInMs = expiry.getTime() - today.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays > 0 ? diffInDays : "Expired";
  };

  const handleFileChange = async (
    type: "slip" | "currentletter" | "newletter",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file (JPEG, PNG)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
      };

      reader.readAsDataURL(file);

      const filename = await saveFileLocally(file);
      if (type === "slip") {
        handleInputChange("slipImage", filename);
        setSlipFile(file);
      } else if (type === "currentletter") {
        handleClubInputChange("currentImage", filename);
        setCurrentFile(file);
      } else {
        handleClubInputChange("newImage", filename);
        setNewFile(file);
      }
    }
  };

  const resetClubChangeForm = () => {
    setClubChangeData({
      currentClubId: "",
      newClubId: "",
      currentAssId: "",
      newAssId: 0,
      currentAss: "",
      newAss: "",
      currentClub: "",
      newClub: "",
      currentImage: "",
      newImage: "",
      currentClubCode: "",
      newClubCode: "",
      currentAssCode: "",
      newAssCode: "",
      type: "",
      userId: "",
      resignDate: "",
    } as any);

    setPreviews({
      slip: "",
      currentletter: "",
      newletter: "",
    });

    setSlipFile(null);
    setCurrentFile(null);
    setNewFile(null);

    if (lettercurrentFileRef.current) {
      lettercurrentFileRef.current.value = "";
    }
    if (letternewFileRef.current) {
      letternewFileRef.current.value = "";
    }
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentData.reffernceNo) {
      toast.error("Please add a reference number");
      return;
    }

    if (!paymentData.slipImage) {
      toast.error("Please upload the slip image");
      return;
    }

    try {
      try {
        const slipImg = await imageUpload(slipFile);
        tempSliptName = slipImg;
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again."
        );
      }

      const payemt: RegRequest = {
        userId: currentUser.id,
        reffernceNo: paymentData.reffernceNo,
        slipImage: tempSliptName || "",
      };
      
      const result = await regRequest(payemt);

      if (result.success) {
        toast.success("Registration request submitted successfully!");
        fetchPlayerData();
        setRegopen(false);
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
        setRegopen(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
      setRegopen(false);
    } finally {
      setRegopen(false);
    }
  };

  const handleClubChangeRequest = async () => {
    const error = validateClubChange(currentUser, clubChangeData);
    if (error) {
      toast.error(error);
      return;
    }
    try {
      if (currentFile && newFile) {
        const currentImg = await imageUpload(currentFile);
        tempCurrentName = currentImg;
        const newImg = await imageUpload(newFile);
        tempNewName = newImg;
      } else if (currentFile) {
        const currentImg = await imageUpload(currentFile);
        tempCurrentName = currentImg;
      } else if (newFile) {
        const newImg = await imageUpload(newFile);
        tempNewName = newImg;
      }

      const clubChangeRequest = {
        userId: currentUser.id,
        currentClubId: clubChangeData.currentClubId || null,
        currentAssId: clubChangeData.currentAssId || null,
        currentClubCode: clubChangeData.currentClubCode || null,
        currentAssCode: clubChangeData.currentAssCode || null,
        newAss: clubChangeData.newAss || null,
        currentAss: clubChangeData.currentAss || null,
        currentClub: clubChangeData.currentClub || null,
        newClub: clubChangeData.newClub || null,
        newClubId: clubChangeData.newClubId || null,
        newAssId: clubChangeData.newAssId || null,
        newClubCode: clubChangeData.newClubCode || null,
        newAssCode: clubChangeData.newAssCode || null,
        currentImage: tempCurrentName || null,
        newImage: tempNewName,
        type: clubChangeData.type,
        resignDate: clubChangeData.resignDate || null,
      };

      const res = await clubchangeRequest(clubChangeRequest);
      if (res.success) {
        toast.success("Club change request submitted successfully!");
        resetClubChangeForm();
        setOpenDialog(false);
        setOpencloseDialog(false);
      } else {
        toast.error("Failed to submit club change request.");
      }
    } catch (error) {
      toast.error("Failed to submit club change request.");
    }
  };

  const daysRemaining = calculateDaysRemaining(currentUser?.expiryDate);

  //----------------------------------------------------------------------------------
  // helpers
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const parseMaybeDate = (val: unknown): Date | null => {
    if (!val) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    if (typeof val === "number") {
      const ms = val > 1e12 ? val : val * 1000;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
    if (typeof val === "string") {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  };

  // derive status + cooldown (Fixed Typo on "ChangeDate")
  const openchangeDate = parseMaybeDate(
    currentUser?.player?.openClubChangeDate
  );
  const closechangeDate = parseMaybeDate(
    currentUser?.player?.closeClubChangeDate
  );

  // Added optional chaining and fallback to prevent null reference crash
  const changePeriodMonths = Number(formData?.openclubchangeperiodMonths || 0);

  const inopenCooldown = openchangeDate
    ? addMonths(openchangeDate, changePeriodMonths) > new Date()
    : false;
  const incloseCooldown = closechangeDate
    ? addMonths(closechangeDate, changePeriodMonths) > new Date()
    : false;

//   return (
//     <div>
//       {/* Component UI Rendering Logic */}
//     </div>
//   );
// };

// export default Profile;
  return (
    <div className="min-h-screen bg-gray-50 sports-gradient pb-12">
      <div className="container mx-auto px-4 py-8 sports-gradient">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Your personal details and registration info
                    </CardDescription>
                  </div>
                  {/* <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() =>
                      isEditing ? handleSaveProfile() : setIsEditing(true)
                    }
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button> */}
                  {/* <button
                    type="button"
                    onClick={handleSaveProfile}
                    style={{ marginLeft: 8 }}
                  >
                    Save
                  </button> */}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    {currentUser.profilePictureName ? (
                      <div>
                        <div className="w-[150px] h-[150px] rounded-full">
                          <img
                            src={`${
                              currentUser?.profilePictureName
                            }`}
                            alt="Profile preview"
                            className="w-[150px] h-[150px] rounded-full object-cover border-2 border-gray-300"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-2xl">
                          {(currentUser?.firstName?.charAt(0) || "") +
                            (currentUser?.lastName?.charAt(0) || "")}
                        </div>
                      </div>
                    )}
                    <div className="w-full">
                      <h3 className="text-xl font-semibold">
                        {currentUser.firstName} {currentUser.lastName}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {currentUser.fullName}
                      </span>
                      <div className="flex items-center space-x-2 mt-2">
                        {status === "pending" ? (
                          <Badge className="bg-yellow-100 text-yellow-800  w-auto">
                            ⏳ Pending
                          </Badge>
                        ) : status === "confirmed" ? (
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Verified
                          </Badge>
                        ) : status === "rejected" ? (
                          <Badge className="bg-red-100 text-red-800">
                            ❌ Rejected
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-black">
                            🚫 Banned
                          </Badge>
                        )}
                        {(() => {
                          const hasPending =
                            currentUser?.pendingPayment?.status === "pending";
                          const regExp = currentUser?.player?.regExpDate
                            ? new Date(currentUser.player.regExpDate)
                            : null;
                          const now = new Date();

                          // 1) Pending payment -> yellow badge
                          if (hasPending && status === "confirmed") {
                            return (
                              <Badge className="bg-yellow-100 text-yellow-900">
                                🟡 Registration Pending
                              </Badge>
                            );
                          }

                          // 2) No pending payment AND no regExpDate -> Not Registered + Register button
                          if (
                            !currentUser?.pendingPayment &&
                            !regExp &&
                            status === "confirmed"
                          ) {
                            return (
                              <>
                                <Badge className="bg-gray-100 text-black">
                                  ⚫ Not Registered
                                </Badge>

                                <Dialog
                                  open={regopen}
                                  onOpenChange={setRegopen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      onClick={() => setRegopen(true)}
                                    >
                                      Register Account
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Register your account in SLBF
                                      </DialogTitle>
                                      <DialogDescription>
                                        Add the payment details
                                      </DialogDescription>
                                    </DialogHeader>

                                    <form
                                      onSubmit={handleRegSubmit}
                                      className="space-y-6"
                                    >
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label>
                                            Enter the Reference Number
                                          </Label>
                                          <Input
                                            id="referenceNo"
                                            placeholder="Reference Number"
                                            value={paymentData.reffernceNo}
                                            onChange={(e) =>
                                              handleInputChange(
                                                "reffernceNo",
                                                e.target.value
                                              )
                                            }
                                            required
                                          />
                                        </div>

                                        <div className="space-y-4">
                                          <Label>Upload the slip</Label>
                                          <div className="items-center gap-4">
                                            <div className="relative">
                                              {previews.slip ? (
                                                <img
                                                  src={previews.slip}
                                                  alt="Slip preview"
                                                  className="w-60 h-90 rounded-lg object-cover border-2 border-gray-300 mb-10"
                                                />
                                              ) : (
                                                <div className="w-60 h-[200px] rounded-lg bg-gray-200 flex items-center justify-center mb-10">
                                                  <span className="text-gray-500">
                                                    No image
                                                  </span>
                                                </div>
                                              )}
                                            </div>

                                            <div className="flex-1">
                                              <input
                                                type="file"
                                                ref={slipFileRef}
                                                onChange={(e) =>
                                                  handleFileChange("slip", e)
                                                }
                                                accept="image/*"
                                                className="hidden"
                                                id="slipImage"
                                              />
                                              <Label
                                                htmlFor="slipImage"
                                                className="cursor-pointer"
                                              >
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  onClick={() =>
                                                    slipFileRef.current?.click()
                                                  }
                                                >
                                                  {previews.slip
                                                    ? "Change Image"
                                                    : "Upload Image"}
                                                </Button>
                                              </Label>
                                              <p className="text-xs text-gray-500 mt-1">
                                                Recommended size: 200x200
                                                pixels, Max 2MB
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Submit uses the form handler */}
                                        <Button
                                          type="submit"
                                          className="w-full"
                                        >
                                          Submit
                                        </Button>
                                      </div>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              </>
                            );
                          }

                          // 3) No pending payment AND regExpDate exists
                          if (
                            !currentUser?.pendingPayment &&
                            regExp &&
                            status === "confirmed"
                          ) {
                            const isActive = regExp > now;

                            if (isActive) {
                              return (
                                <Badge className="bg-green-100 text-green-800">
                                  🟢 Registered
                                </Badge>
                              );
                            }

                            // Expired -> red badge + extension dialog
                            return (
                              <>
                                <Badge className="bg-red-100 text-red-800">
                                  🔴 Registration Expired
                                </Badge>

                                <Dialog
                                  open={regopen}
                                  onOpenChange={setRegopen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      onClick={() => setRegopen(true)}
                                    >
                                      Register Account
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Extend your registration in SLBF
                                      </DialogTitle>
                                      <DialogDescription>
                                        Add the payment details
                                      </DialogDescription>
                                    </DialogHeader>

                                    <form
                                      onSubmit={handleRegSubmit}
                                      className="space-y-6"
                                    >
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label>
                                            Enter the Reference Number
                                          </Label>
                                          <Input
                                            id="referenceNo"
                                            placeholder="Reference Number"
                                            value={paymentData.reffernceNo}
                                            onChange={(e) =>
                                              handleInputChange(
                                                "reffernceNo",
                                                e.target.value
                                              )
                                            }
                                            required
                                          />
                                        </div>

                                        <div className="space-y-4">
                                          <Label>Upload the slip</Label>
                                          <div className="items-center gap-4">
                                            <div className="relative">
                                              {previews.slip ? (
                                                <img
                                                  src={previews.slip}
                                                  alt="Slip preview"
                                                  className="w-60 h-90 rounded-lg object-cover border-2 border-gray-300 mb-10"
                                                />
                                              ) : (
                                                <div className="w-60 h-[200px] rounded-lg bg-gray-200 flex items-center justify-center mb-10">
                                                  <span className="text-gray-500">
                                                    No image
                                                  </span>
                                                </div>
                                              )}
                                            </div>

                                            <div className="flex-1">
                                              <input
                                                type="file"
                                                ref={slipFileRef}
                                                onChange={(e) =>
                                                  handleFileChange("slip", e)
                                                }
                                                accept="image/*"
                                                className="hidden"
                                                id="slipImage"
                                              />
                                              <Label
                                                htmlFor="slipImage"
                                                className="cursor-pointer"
                                              >
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  onClick={() =>
                                                    slipFileRef.current?.click()
                                                  }
                                                >
                                                  {previews.slip
                                                    ? "Change Image"
                                                    : "Upload Image"}
                                                </Button>
                                              </Label>
                                              <p className="text-xs text-gray-500 mt-1">
                                                Recommended size: 200x200
                                                pixels, Max 2MB
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Submit uses the form handler */}
                                        <Button
                                          type="submit"
                                          className="w-full"
                                        >
                                          Submit
                                        </Button>
                                      </div>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              </>
                            );
                          }

                          return null;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ["First Name", "firstName"],
                      ["Last Name", "lastName"],
                      ["Email", "email"],
                      ["Contact Number", "contact"],
                      ["Weight (kg)", "weight", "number"],
                      ["Height (cm)", "height", "number"],
                    ].map(([label, key, type = "text"]) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}</Label>
                        <Input
                          type={type}
                          value={
                            isEditing
                              ? editData[key]
                              : currentUser.player?.[key] ??
                                currentUser[key] ??
                                ""
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              [key]:
                                type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Read-only Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        value={new Date(
                          currentUser.dateofBirth
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ID Card Number</Label>
                      <Input value={currentUser.nicNum || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>District</Label>
                      <Input value={currentUser.district || ""} disabled />
                    </div>
                    {/* <div className="space-y-2">
                      <Label>Registered Date</Label>
                      <Input
                        value={new Date(
                          currentUser?.player?.regDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        disabled
                      />
                    </div> */}
                    {/* <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input
                        value={new Date(
                          currentUser?.player?.regExpDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        disabled
                      />
                    </div> */}
                  </div>

                  {/* Club Information */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold">
                        Club Information
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Open Association</Label>
                        {currentUser?.player?.openAssId ? (
                          <>
                            <Input value={openassdetails?.name} disabled />
                          </>
                        ) : (
                          <>
                            <Input value="Not available" disabled />
                          </>
                        )}
                        <Label>Open Club</Label>
                        {currentUser?.player?.openClubId ? (
                          <>
                            <Input value={openclubdetails?.name} disabled />
                          </>
                        ) : (
                          <>
                            <Input value="Not available" disabled />
                          </>
                        )}
                        {!(
                          inopenCooldown || currentUser?.player?.openAssId === 0
                        ) && (
                          <Dialog
                            open={openDialog}
                            onOpenChange={setOpenDialog}
                          >
                            <DialogTrigger asChild>
                              {new Date(currentUser?.player?.regExpDate) >
                              new Date() ? (
                                <Button
                                  className="w-full mt-4"
                                  variant="outline"
                                >
                                  {currentUser?.player?.openAssId
                                    ? "Request Open Club Change"
                                    : "Select Open Club"}
                                </Button>
                              ) : null}
                            </DialogTrigger>

                            <DialogContent className="max-w-2xl w-full">
                              <DialogHeader>
                                {!currentUser?.player?.openAssId ? (
                                  <DialogTitle>
                                    Select Your Open Club
                                  </DialogTitle>
                                ) : (
                                  <>
                                    <DialogTitle>
                                      Request Open Club Change
                                    </DialogTitle>
                                    <DialogDescription>
                                      Submit a request to change your current
                                      Open club
                                    </DialogDescription>
                                  </>
                                )}
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-x-6  flex align-middle justify-between">
                                  {currentUser?.player?.openAssId ? (
                                    <div className="space-y-4">
                                      <Label>Current Open Association</Label>
                                      <Input
                                        value={openassdetails?.name}
                                        disabled
                                      />
                                      <Label>Current Open Club</Label>
                                      <Input
                                        value={openclubdetails?.name}
                                        disabled
                                      />
                                      {/* <SearchableFreeTextClubInput
                                        value={
                                          clubChangeData.currentClubId || ""
                                        } // display the name
                                        onChange={(name) =>
                                          setClubChangeData((prev) => ({
                                            ...prev,
                                            currentClub: name,
                                          }))
                                        }
                                        onChangeDetailed={({ label, value }) =>
                                          setClubChangeData((prev) => ({
                                            ...prev,
                                            currentClub: label, // name
                                            currentClubCode: value, // code ('' if not found)
                                          }))
                                        }
                                        clubs={openclubs} // string[]
                                        codeByName={opencodeByName} // name -> code
                                        onOpenType={() =>
                                          handleClubInputChange("type", "close")
                                        }
                                      /> */}
                                      {/* --- Resignation Date (new) --- */}
                                      <div className="space-y-2">
                                        <Label htmlFor="resignDate">
                                          Resignation Date
                                        </Label>
                                        <input
                                          id="resignDate"
                                          type="date"
                                          value={
                                            clubChangeData.resignDate ?? ""
                                          }
                                          onChange={(e) =>
                                            setClubChangeData((prev) => ({
                                              ...prev,
                                              resignDate: e.target.value,
                                            }))
                                          }
                                          max={
                                            new Date()
                                              .toISOString()
                                              .split("T")[0]
                                          } // disallow future dates
                                          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500">
                                          Select the date you resigned from the
                                          current club.
                                        </p>
                                      </div>
                                      <div className="space-y-4">
                                        <Label>
                                          Please upload your resignation letter
                                          as an image
                                        </Label>
                                        <div className="items-center ">
                                          <div className="relative">
                                            {previews.currentletter ? (
                                              <img
                                                src={previews.currentletter}
                                                alt="Profile preview"
                                                className="w-40 h-70 rounded-lg object-cover border-2 border-gray-300 mb-10"
                                              />
                                            ) : (
                                              <div className="w-40 h-[150px]  rounded-1g bg-gray-200 flex items-center justify-center mb-10">
                                                <span className="text-gray-500">
                                                  No image
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <input
                                              type="file"
                                              ref={lettercurrentFileRef}
                                              onChange={(e) =>
                                                handleFileChange(
                                                  "currentletter",
                                                  e
                                                )
                                              }
                                              // onChange={(e) => setFile(e.target.files?.[0] || null)}
                                              accept="image/*"
                                              className="hidden"
                                              id="currentLetterImage"
                                              required
                                            />
                                            <Label
                                              htmlFor="currentLetterImage"
                                              className="cursor-pointer"
                                            >
                                              <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                  lettercurrentFileRef.current?.click()
                                                }
                                              >
                                                {previews.currentletter
                                                  ? "Change Image"
                                                  : "Upload Image"}
                                              </Button>
                                            </Label>
                                            <p className="text-xs text-gray-500 mt-1">
                                              Recommended size: 200x200 pixels,
                                              Max 2MB
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <div className="space-y-4">
                                    <Label>New District Association</Label>
                                    <SearchableFreeTextClubInput
                                      value={clubChangeData.newAss || ""}
                                      associations={allassociations} // association array
                                      onChange={(name) =>
                                        setClubChangeData((prev) => ({
                                          ...prev,
                                          currentAss: "",
                                          currentAssId: null, // Clear the associated ID when the name changes
                                          newAss: name, // Clear the new association when the input changes
                                          newAssId: null, // Reset the new association ID
                                          newAssCode: "", // Reset the new association code
                                          newClub: "", // Clear the club when association is cleared
                                          newClubId: null, // Reset the club ID
                                          newClubCode: "", // Reset the club code
                                        }))
                                      }
                                      onChangeDetailed={({
                                        id,
                                        name,
                                        code,
                                      }) => {
                                        setClubChangeData((prev) => ({
                                          ...prev,
                                          newAss: name,
                                          newAssId: id, // Save id
                                          newAssCode: code, // Save code
                                        }));

                                        // Fetch open clubs based on the selected association
                                        fetchAllAssOpenclubs(id);
                                      }}
                                      onOpenType={() =>
                                        handleClubInputChange("type", "open")
                                      }
                                      placeholder="Search association by name"
                                    />

                                    {/* Conditionally render the club dropdown based on newAssId */}
                                    {clubChangeData.newAssId &&
                                    clubChangeData.newAss.trim() !== "" ? (
                                      <>
                                        <Label>New Club</Label>
                                        <SearchableFreeTextClubInput
                                          value={clubChangeData.newClub || ""}
                                          associations={allassopenclubs} // You may need to update this if you have separate club data
                                          onChange={(name) =>
                                            setClubChangeData((prev) => ({
                                              ...prev,
                                              newClub: name,
                                              newClubId: null, // Clear the associated ID when the club name changes
                                            }))
                                          }
                                          onChangeDetailed={({
                                            id,
                                            name,
                                            code,
                                          }) => {
                                            setClubChangeData((prev) => ({
                                              ...prev,
                                              newClub: name,
                                              newClubId: id, // Save club id
                                              newClubCode: code, // Save club code
                                              currentAss: openassdetails?.name, // Ensure current association name is set
                                              currentAssId: openassdetails?.id, // Ensure current association ID is set
                                              currentAssCode:
                                                openassdetails?.code, // Ensure current association code is set
                                              currentClub:
                                                openclubdetails?.name, // Ensure current club name is set
                                              currentClubId:
                                                openclubdetails?.id, // Ensure current club ID is set
                                              currentClubCode:
                                                openclubdetails?.code, // Ensure current club code is set
                                            }));

                                            // Fetch or handle the club details
                                            // fetchAllAssOpenclubs(id);
                                          }}
                                          onOpenType={() =>
                                            handleClubInputChange(
                                              "type",
                                              "open"
                                            )
                                          }
                                          placeholder="Search club by name"
                                        />
                                      </>
                                    ) : null}
                                    <div className="space-y-4">
                                      <Label>
                                        Please upload your offer letter as an
                                        image
                                      </Label>
                                      <div className="items-center ">
                                        <div className="relative">
                                          {previews.newletter ? (
                                            <img
                                              src={previews.newletter}
                                              alt="Profile preview"
                                              className="w-40 h-70 rounded-lg object-cover border-2 border-gray-300 mb-10"
                                            />
                                          ) : (
                                            <div className="w-40 h-[150px]  rounded-1g bg-gray-200 flex items-center justify-center mb-10">
                                              <span className="text-gray-500">
                                                No image
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <input
                                            type="file"
                                            ref={letternewFileRef}
                                            onChange={(e) =>
                                              handleFileChange("newletter", e)
                                            }
                                            // onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            accept="image/*"
                                            className="hidden"
                                            id="newLetterImage"
                                          />
                                          <Label
                                            htmlFor="newLetterImage"
                                            className="cursor-pointer"
                                          >
                                            <Button
                                              type="button"
                                              variant="outline"
                                              onClick={() =>
                                                letternewFileRef.current?.click()
                                              }
                                            >
                                              {previews.newletter
                                                ? "Change Image"
                                                : "Upload Image"}
                                            </Button>
                                          </Label>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Recommended size: 200x200 pixels,
                                            Max 2MB
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2"></div>

                                <Button
                                  onClick={handleClubChangeRequest}
                                  className="w-full"
                                >
                                  Submit Request
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Close Association</Label>
                        {currentUser?.player?.closeAssId ? (
                          <>
                            <Input value={closeassdetails?.name} disabled />
                          </>
                        ) : (
                          <>
                            <Input value="Not available" disabled />
                          </>
                        )}
                        <Label>Close Club</Label>
                        {currentUser?.player?.closeClubId ? (
                          <>
                            <Input value={closeclubdetails?.name} disabled />
                          </>
                        ) : (
                          <>
                            <Input value="Not available" disabled />
                          </>
                        )}
                        {/* <Label>Close Club</Label>
                        <Input
                          value={
                            currentUser?.player?.closeClub || "Not selected"
                          }
                          disabled
                        /> */}
                        {!(
                          incloseCooldown ||
                          currentUser?.player?.closeAssId === 0
                        ) && (
                          <Dialog
                            open={opencloseDialog}
                            onOpenChange={setOpencloseDialog}
                          >
                            <DialogTrigger asChild>
                              {new Date(currentUser?.player?.regExpDate) >
                              new Date() ? (
                                <Button
                                  className="w-full mt-4"
                                  variant="outline"
                                >
                                  {currentUser?.player?.closeAssId
                                    ? "Request Close Club Change"
                                    : "Select Close Club"}
                                </Button>
                              ) : null}
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl w-full">
                              <DialogHeader>
                                {!currentUser?.player?.closeAssId ? (
                                  <DialogTitle>
                                    Select your Close Club
                                  </DialogTitle>
                                ) : (
                                  <>
                                    <DialogTitle>
                                      Request Close Club Change
                                    </DialogTitle>
                                    <DialogDescription>
                                      Submit a request to change your current
                                      Close club
                                    </DialogDescription>
                                  </>
                                )}
                              </DialogHeader>
                              <div className="space-y-2">
                                <div className="space-x-6  flex  align-middle">
                                  {currentUser?.player?.closeAssId ? (
                                    <div className="space-y-2 w-1/2">
                                      <Label>Current Close Association</Label>
                                      <Input
                                        value={closeassdetails?.name}
                                        disabled
                                      />
                                      <Label>Current Close Club</Label>
                                      <Input
                                        value={closeclubdetails?.name}
                                        disabled
                                      />
                                      {/* <SearchableFreeTextClubInput
                                        value={
                                          clubChangeData.currentClubId || ""
                                        } // display the name
                                        onChange={(name) =>
                                          setClubChangeData((prev) => ({
                                            ...prev,
                                            currentClub: name,
                                          }))
                                        }
                                        onChangeDetailed={({ label, value }) =>
                                          setClubChangeData((prev) => ({
                                            ...prev,
                                            currentClub: label, // name
                                            currentClubCode: value, // code ('' if not found)
                                          }))
                                        }
                                        clubs={closeclubs} // string[]
                                        codeByName={closecodeByName} // name -> code
                                        onOpenType={() =>
                                          handleClubInputChange("type", "close")
                                        }
                                      /> */}
                                      {/* --- Resignation Date (new) --- */}
                                      <div className="space-y-2">
                                        <Label htmlFor="resignDate">
                                          Resignation Date
                                        </Label>
                                        <input
                                          id="resignDate"
                                          type="date"
                                          value={
                                            clubChangeData.resignDate ?? ""
                                          }
                                          onChange={(e) =>
                                            setClubChangeData((prev) => ({
                                              ...prev,
                                              resignDate: e.target.value,
                                            }))
                                          }
                                          max={
                                            new Date()
                                              .toISOString()
                                              .split("T")[0]
                                          } // disallow future dates
                                          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-500">
                                          Select the date you resigned from the
                                          current club.
                                        </p>
                                      </div>
                                      <div className="space-y-4">
                                        <Label>
                                          Please upload your resignation letter
                                          as an image
                                        </Label>
                                        <div className="items-center ">
                                          <div className="relative">
                                            {previews.currentletter ? (
                                              <img
                                                src={previews.currentletter}
                                                alt="Profile preview"
                                                className="w-40 h-70 rounded-lg object-cover border-2 border-gray-300 mb-10"
                                              />
                                            ) : (
                                              <div className="w-40 h-[150px]  rounded-1g bg-gray-200 flex items-center justify-center mb-10">
                                                <span className="text-gray-500">
                                                  No image
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <input
                                              type="file"
                                              ref={lettercurrentFileRef}
                                              onChange={(e) =>
                                                handleFileChange(
                                                  "currentletter",
                                                  e
                                                )
                                              }
                                              // onChange={(e) => setFile(e.target.files?.[0] || null)}
                                              accept="image/*"
                                              className="hidden"
                                              id="currentLetterImage"
                                            />
                                            <Label
                                              htmlFor="currentLetterImage"
                                              className="cursor-pointer"
                                            >
                                              <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                  lettercurrentFileRef.current?.click()
                                                }
                                              >
                                                {previews.currentletter
                                                  ? "Change Image"
                                                  : "Upload Image"}
                                              </Button>
                                            </Label>
                                            <p className="text-xs text-gray-500 mt-1">
                                              Recommended size: 200x200 pixels,
                                              Max 2MB
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <div className="space-y-2">
                                    <div className="space-y-2">
                                      {/* <Label>New Close Club</Label>
                                      <SearchableFreeTextClubInput
                                        value={
                                          clubChangeData.currentAssociationName ||
                                          ""
                                        }
                                        associations={
                                          allassociations as {
                                            id: number;
                                            name: string;
                                            code: string;
                                          }[]
                                        }
                                        onChange={(name) =>
                                          setClubChangeData((prev) => ({
                                            ...prev,
                                            currentAssociationName: name,
                                          }))
                                        }
                                        onChangeDetailed={({
                                          id,
                                          name,
                                          code,
                                        }) =>
                                          setClubChangeData((prev) => ({
                                            ...prev,
                                            currentAssociationName: name,
                                            currentAssociationId: id, // ✅ you can save id
                                            currentAssociationCode: code, // ✅ and code
                                          }))
                                        }
                                        onOpenType={() =>
                                          handleClubInputChange("type", "close")
                                        }
                                        placeholder="Search association by name or code…"
                                      /> */}
                                      <Label>New Close Association</Label>
                                      <SearchableFreeTextClubInput
                                        value={clubChangeData.newAss || ""}
                                        associations={closeclubInfo} // association array
                                        onChange={(name) =>
                                          setClubChangeData((prev) => ({
                                            ...prev,
                                            currentAss: "",
                                            currentAssId: null, // Clear the associated ID when the name changes
                                            newAss: name, // Clear the new association when the input changes
                                            newAssId: null, // Reset the new association ID
                                            newAssCode: "", // Reset the new association code
                                            newClub: "", // Clear the club when association is cleared
                                            newClubId: null, // Reset the club ID
                                            newClubCode: "", // Reset the club code
                                          }))
                                        }
                                        onChangeDetailed={({
                                          id,
                                          name,
                                          code,
                                        }) => {
                                          setClubChangeData((prev) => ({
                                            ...prev,
                                            newAss: name,
                                            newAssId: id, // Save id
                                            newAssCode: code, // Save code
                                            currentAss: closeassdetails?.name, // Ensure current association name is set
                                            currentAssId: closeassdetails?.id, // Ensure current association ID is set
                                            currentAssCode:
                                              closeassdetails?.code, // Ensure current association code is set
                                            currentClub: closeclubdetails?.name, // Ensure current club name is set
                                            currentClubId: closeclubdetails?.id, // Ensure current club ID is set
                                            currentClubCode:
                                              closeclubdetails?.code, // Ensure current club code is set
                                          }));

                                          // Fetch open clubs based on the selected association
                                          fetchAllAssOpenclubs(id);
                                        }}
                                        onOpenType={() =>
                                          handleClubInputChange("type", "close")
                                        }
                                        placeholder="Search association by name"
                                      />

                                      {/* Conditionally render the club dropdown based on newAssId */}
                                      {clubChangeData.newAssId &&
                                      clubChangeData.newAss.trim() !== "" &&
                                      (clubChangeData.newAss ===
                                        "Mercantiles" ||
                                        clubChangeData.newAss ===
                                          "SL Schools" ||
                                        clubChangeData.newAss ===
                                          "SL Universities") ? (
                                        <>
                                          <Label>New Close Club</Label>
                                          <SearchableFreeTextClubInput
                                            value={clubChangeData.newClub || ""}
                                            associations={
                                              clubChangeData.newAss ===
                                              "Mercantiles"
                                                ? allmercclubs
                                                : clubChangeData.newAss ===
                                                  "SL Schools"
                                                ? allschools
                                                : clubChangeData.newAss ===
                                                  "SL Universities"
                                                ? alluniversities
                                                : ""
                                            } // You may need to update this if you have separate club data
                                            onChange={(name) =>
                                              setClubChangeData((prev) => ({
                                                ...prev,
                                                newClub: name,
                                                newClubId: null, // Clear the associated ID when the club name changes
                                              }))
                                            }
                                            onChangeDetailed={({
                                              id,
                                              name,
                                              code,
                                            }) => {
                                              setClubChangeData((prev) => ({
                                                ...prev,
                                                newClub: name,
                                                newClubId: id, // Save club id
                                                newClubCode: code, // Save club code
                                                currentAss:
                                                  closeassdetails?.name, // Ensure current association name is set
                                                currentAssId:
                                                  closeassdetails?.id, // Ensure current association ID is set
                                                currentAssCode:
                                                  closeassdetails?.code, // Ensure current association code is set
                                                currentClub:
                                                  closeclubdetails?.name, // Ensure current club name is set
                                                currentClubId:
                                                  closeclubdetails?.id, // Ensure current club ID is set
                                                currentClubCode:
                                                  closeclubdetails?.code, // Ensure current club code is set
                                              }));

                                              // Fetch or handle the club details
                                              // fetchAllAssOpenclubs(id);
                                            }}
                                            onOpenType={() =>
                                              handleClubInputChange(
                                                "type",
                                                "close"
                                              )
                                            }
                                            placeholder="Search club by name"
                                          />
                                        </>
                                      ) : null}
                                      <div className="space-y-4">
                                        <Label>
                                          Please upload your offer letter as an
                                          image
                                        </Label>
                                        <div className="items-center ">
                                          <div className="relative">
                                            {previews.newletter ? (
                                              <img
                                                src={previews.newletter}
                                                alt="Profile preview"
                                                className="w-40 h-70 rounded-lg object-cover border-2 border-gray-300 mb-10"
                                              />
                                            ) : (
                                              <div className="w-40 h-[150px]  rounded-1g bg-gray-200 flex items-center justify-center mb-10">
                                                <span className="text-gray-500">
                                                  No image
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <input
                                              type="file"
                                              ref={letternewFileRef}
                                              onChange={(e) =>
                                                handleFileChange("newletter", e)
                                              }
                                              // onChange={(e) => setFile(e.target.files?.[0] || null)}
                                              accept="image/*"
                                              className="hidden"
                                              id="newLetterImage"
                                            />
                                            <Label
                                              htmlFor="newLetterImage"
                                              className="cursor-pointer"
                                            >
                                              <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                  letternewFileRef.current?.click()
                                                }
                                              >
                                                {previews.newletter
                                                  ? "Change Image"
                                                  : "Upload Image"}
                                              </Button>
                                            </Label>
                                            <p className="text-xs text-gray-500 mt-1">
                                              Recommended size: 200x200 pixels,
                                              Max 2MB
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2"></div>

                                <Button
                                  onClick={handleClubChangeRequest}
                                  className="w-full"
                                >
                                  Submit Request
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: Registration Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registration Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Number</span>
                    <span className="font-medium">
                      {currentUser?.player?.slbfId || "Not Registered"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registered Date</span>
                    <span className="font-medium">
                      {currentUser?.player?.regDate
                        ? new Date(
                            currentUser?.player?.regDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiry Date</span>
                    <span className="font-medium">
                      {currentUser?.player?.regExpDate
                        ? new Date(
                            currentUser?.player?.regExpDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <ConfirmProfileModal
          open={showConfirm}
          data={editData}
          onConfirm={confirmSave}
          onCancel={cancelSave}
        />
      </div>
    </div>
  );
};

export default Profile;
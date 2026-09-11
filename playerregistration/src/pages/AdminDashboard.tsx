import React, { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  ClubChangeRequest,
  ExtensionRequest,
  UpdateTableField,
  UpdateRegDate,
  User1,
  Payment,
  Clubchangedetails,
} from "@/types/index";
import {
  UserPlus,
  Clock,
  Users,
  Settings,
  Contact,
  NfcIcon,
  FileText,
} from "lucide-react";
import {
  Getpendingplayers,
  GetpendingRegplayers,
  GetclubgReq,
  updateTableFeild,
  updateRegDates,
  GetAssDetails,
  GetClubDetails,
  updateTableFeilds,
  registerAdmin,
  GetAdminDetails,
  getNotRegisteredPlayerCount,
} from "@/api/adminApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { generate1partSLBFId, idrestgenerator } from "../lib/idGenerator";
import NewAdminConfirmModel from "../components/models/NewAdminConfirmModel";
import { Link } from "react-router-dom";
import { getPostCount } from "@/api/postApi";
import { X, ExternalLink } from "lucide-react"; // Icons

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedView, setExpandedView] = useState(null);

  // --- selected section from URL (?tab=...) ---
  const currentTab = (searchParams.get("tab") || "overview") as
    | "overview"
    | "users"
    | "club-changes"
    | "extensions"
    | "admin-accounts";

  const gotoTab = (tab: string) => setSearchParams({ tab });

  const [pendingUsers, setpendingPlayersInfo] = useState<User1[] | null>(null);
  const [admins, setAdmins] = useState<User1[] | null>(null);
  const [pendingReg, setpendingRegInfo] = useState<Payment[] | null>(null);
  const [clubChangeReq, setClubChangeReq] = useState<
    Clubchangedetails[] | null
  >(null);
  const [newassdetails, setNewAssdetails] = useState(null);
  const [newclubdetails, setNewclubdetails] = useState(null);
  const [oldassdetails, setOldAssdetails] = useState(null);
  const [oldclubdetails, setOldclubdetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showPdetailsModal, setShowPdetailsModal] = useState(false);
  const [showPaymentdetailsModal, setShowPaymentdetailsModal] = useState(false);
  const [culbchangedetailsModel, setCulbchangedetailsModel] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User1 | null>(null);
  const [regUser, setRegUser] = useState<Payment | null>(null);
  const [clubchangeuser, setClubchangeuser] =
    useState<Clubchangedetails | null>(null);

  const [showRejectModal, setShowRejectModal] = useState({
    show: false,
    message: "",
  });
  // const IMG_URL = import.meta.env.VITE_IMG_URL;
  const IMG_URL = import.meta.env.VITE_IMG_URL as string;
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [postCount, setPostCount] = useState<number>(0);
  const [notRegisteredPlayerCount, setNotRegisteredPlayerCount] =
    useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
  ];
  const gengerTypes = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  useEffect(() => {
    if (!pendingUsers) fetchPlayerData();
    if (!pendingReg) fetchRegData();
    if (!clubChangeReq) fetchClubchangereq();
    if (!admins) fetchAdmins();
    fetchPostCount();
    fetchNotRegisteredPlayerCount();
  }, [pendingUsers, pendingReg, clubChangeReq, admins]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      const playersData = await Getpendingplayers();
      setpendingPlayersInfo(playersData);
    } catch (error) {
      toast.error("Failed to load player details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegData = async () => {
    try {
      setLoading(true);
      const RegData = await GetpendingRegplayers();
      setpendingRegInfo(RegData);
    } catch (error) {
      toast.error("Failed to load player details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const adminData = await GetAdminDetails();
      setAdmins(adminData);
    } catch (error) {
      toast.error("Failed to load admin details.");
    } finally {
      setLoading(false);
    }
  };
  console.log("admins", admins);

  const fetchClubchangereq = async () => {
    try {
      setLoading(true);
      const RegData = await GetclubgReq();
      setClubChangeReq(RegData);
    } catch (error) {
      toast.error("Failed to load player details.");
    } finally {
      setLoading(false);
    }
  };
  console.log("clubChangeReq", clubChangeReq);

  const fetchPostCount = async () => {
    try {
      const postCount = await getPostCount();
      console.log("postCount", postCount);
      setPostCount(postCount);
    } catch (error) {
      toast.error("Failed to fetch post count", error);
    }
  };

  const fetchNotRegisteredPlayerCount = async () => {
    try {
      const count = await getNotRegisteredPlayerCount();
      console.log("notRegisteredPlayerCount", count);
      setNotRegisteredPlayerCount(count);
      return count;
    } catch (error) {
      toast.error("Failed to fetch not registered player count", error);
      console.error("Failed to fetch not registered player count", error);
      return 0;
    }
  };

  // const getAssClubdetails = async (
  //   type: string,
  //   newAssId: number,
  //   newclubId?: number,
  //   oldAssId?: number,
  //   oldClubId?: number
  // ) => {
  //   if (type === "open") {
  //     if (oldAssId) {
  //       try {
  //         setLoading(true);
  //         const oldAssData = await GetAssDetails(type, oldAssId);
  //         setOldAssdetails(oldAssData);
  //         const oldClubData = await GetClubDetails(type, oldAssId, oldClubId);
  //         setOldclubdetails(oldClubData);
  //       } catch (error) {
  //         toast.error("Failed to load new association details.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //     try {
  //       setLoading(true);
  //       const NewAssData = await GetAssDetails(type, newAssId);
  //       setNewAssdetails(NewAssData);
  //       const NewClubData = await GetClubDetails(type, newAssId, newclubId);
  //       setNewclubdetails(NewClubData);
  //     } catch (error) {
  //       toast.error("Failed to load new association details.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     if (oldAssId) {
  //       try {
  //         setLoading(true);
  //         const oldAssData = await GetAssDetails(type, oldAssId);
  //         setOldAssdetails(oldAssData);
  //         if (![1, 2, 3, 7].includes(oldAssId)) {
  //           const oldClubData = await GetClubDetails(type, oldAssId, oldClubId);
  //           setOldclubdetails(oldClubData);
  //         }
  //       } catch (error) {
  //         toast.error("Failed to load new association details.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //     try {
  //       setLoading(true);
  //       const NewAssData = await GetAssDetails(type, newAssId);
  //       setNewAssdetails(NewAssData);
  //       if (![1, 2, 3, 7].includes(newAssId)) {
  //         const NewClubData = await GetClubDetails(type, newAssId, newclubId);
  //         setNewclubdetails(NewClubData);
  //       }
  //     } catch (error) {
  //       toast.error("Failed to load new club details.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };
  console.log("load new association details", newassdetails);

  const handleReject = async (data: UpdateTableField) => {
    try {
      const res = await updateTableFeild(data);
      if (res.success) {
        toast.success("Rejected successfully!");
        setShowRejectModal({ show: false, message: "" });
        fetchPlayerData();
        fetchClubchangereq();
        fetchRegData();
      } else {
        toast.error("Failed to reject.");
      }
    } catch (error) {
      toast.error("An error occurred while rejecting.");
    }
  };

  const [newAdminData, setNewAdminData] = useState({
    email: "",
    fullName: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    district: "",
    idCardNumber: "",
    dateOfbirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setNewAdminData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAdmin = () => {
    if (
      !newAdminData.email ||
      !newAdminData.firstName ||
      !newAdminData.lastName ||
      !newAdminData.contactNumber ||
      !newAdminData.district ||
      !newAdminData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newAdminData.password !== newAdminData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    console.log("Creating admin with data:", newAdminData);
    setShowConfirm(true);
    // toast.success("New admin account created successfully!");
  };

  const cancelCreate = () => {
    setShowConfirm(false);
  };

  const confirmCreate = async () => {
    try {
      const data = await registerAdmin(newAdminData);
      if (data.success) {
        toast.success("New admin account created successfully!");
        setNewAdminData({
          email: "",
          firstName: "",
          lastName: "",
          contactNumber: "",
          password: "",
          confirmPassword: "",
          district: "",
          dateOfbirth: "",
          gender: "",
          idCardNumber: "",
          fullName: "",
        });
        fetchAdmins();
      } else {
        toast.error(data.message || "Failed to create. Please try again.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
      );
    }

    setShowConfirm(false);
  };

  const handleViewDetails = (user: User1) => {
    setSelectedUser(user);
    setShowPdetailsModal(true);
  };

  const handleRegDetails = (p: Payment) => {
    setRegUser(p);
    setShowPaymentdetailsModal(true);
  };

  const handleclubDetails = (c: Clubchangedetails) => {
    setClubchangeuser(c);
    // getAssClubdetails(c.type, c.newAssId, c.newClubId, c.oldAssId, c.oldClubId);
    setCulbchangedetailsModel(true);
  };

  // ---------- helpers ----------
  const buildDistrictCode = (district?: string) =>
    (district ?? "")
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, 3)
      .padEnd(3, "X");

  const buildUniqueNumber = (d: Date) => {
    const yyyy = d.getFullYear().toString();
    const MM = (d.getMonth() + 1).toString().padStart(2, "0");
    const DD = d.getDate().toString().padStart(2, "0");
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    const ss = d.getSeconds().toString().padStart(2, "0");
    return `${yyyy}${MM}${DD}${hh}${mm}${ss}`;
  };

  const buildSlbfId = (dob: Date, district?: string) => {
    const unique = buildUniqueNumber(new Date());
    const dist3 = buildDistrictCode(district);
    const bornYear = dob.getFullYear().toString();
    return `SLBF${unique}${dist3}${bornYear}OOOOOO`;
  };

  const handleUserApproval = async (
    userId?: string,
    playerId?: string,
    dob?: Date,
    district?: string,
  ) => {
    if (!userId || !playerId || !dob) return;
    const approvrData = {
      id: userId,
      table: "user",
      column: "status",
      value: "confirmed",
    };
    const slbfId = generate1partSLBFId(parseInt(userId));
    const regnumberslbf = {
      id: playerId,
      table: "player",
      column: "slbfId",
      value: slbfId,
    };

    try {
      const response = await updateTableFeild(approvrData);
      if (response.success) {
        const response1 = await updateTableFeild(regnumberslbf);
        if (response1.success) {
          toast.success("User approved successfully!");
          setShowPdetailsModal(false);
          fetchPlayerData();
        }
      } else {
        toast.error("Failed to approve user.");
      }
    } catch (error) {
      toast.error("An error occurred while approving the user.");
    }
  };

  const handleUserpaymentApproval = async (
    userId?: string,
    id?: string,
    playerId?: string,
    slbfId?: string | null,
  ) => {
    if (!id) return;
    const approvrData = {
      id,
      table: "payment",
      column: "status",
      value: "approved",
    };

    try {
      const response = await updateTableFeild(approvrData);
      if (response.success) {
        const regDate = new Date();
        const expDate = new Date(regDate);
        expDate.setFullYear(expDate.getFullYear() + 1);

        const reg_expDates: UpdateRegDate = {
          id: playerId!,
          regDate: regDate.toISOString(),
          expDate: expDate.toISOString(),
        };
        const updatedRegDate = await updateRegDates(reg_expDates);
        // if (updatedRegDate.success) {
        //   if (!slbfId || slbfId === "pending") {
        //     const newslbfId = `SLBF${userId}`;
        //     const slbfdata = { id: playerId!, table: "player", column: "slbfId", value: newslbfId };
        //     await updateTableFeild(slbfdata);
        //   }
        // }
        toast.success("Payment approved successfully!");
        setShowPaymentdetailsModal(false);
        fetchRegData();
      } else {
        toast.error("Failed to approve payment.");
      }
    } catch (error) {
      toast.error("An error occurred while approving the payment.");
    }
  };

  const handleClubChangeRequest = async (
    clubchangeId?: string,
    playerId?: string,
    slbfId?: string,
    type?: string,
    newAssId: number,
    newAss: string,
    newAssCode: string,
    newClubId?: number,
    newClub?: string,
    newClubCode?: string,
    oldAssId?: number,
    oldAss?: string,
    oldAssCode?: string,
    oldClubId?: number,
    oldClub?: string,
    oldClubCode?: string,
  ) => {
    if (!clubchangeId || !playerId || !type || !newAssId || !slbfId) return;

    try {
      const clubapproveData = {
        id: clubchangeId,
        table: "clubchange",
        column: "status",
        value: "approved",
      };
      const newslbfId = idrestgenerator(
        slbfId,
        newAssCode,
        newClubCode,
        oldAssCode,
        oldClubCode,
      );
      const clubapprovedData = await updateTableFeild(clubapproveData);

      if (clubapprovedData.success) {
        if (type === "open") {
          const playerclubdata = {
            id: playerId,
            table: "player",
            updates: {
              openAssId: newAssId,
              openClubId: newClubId,
              openClubChagngeDate: new Date().toISOString(),
              slbfId: newslbfId,
            },
          };
          try {
            await updateTableFeilds(playerclubdata);
          } catch (error) {
            console.error("Failed to update player club data:", error);
          }
        } else {
          const playerclubdata = {
            id: playerId,
            table: "player",
            updates: {
              closeAssId: newAssId,
              closeClubId: newClubId,
              closeClubChagngeDate: new Date().toISOString(),
              slbfId: newslbfId,
            },
          };
          try {
            await updateTableFeilds(playerclubdata);
          } catch (error) {
            console.error("Failed to update player club data:", error);
          }
        }
      }
      toast.success("Change approved successfully!");
      setCulbchangedetailsModel(false);
      fetchClubchangereq();
    } catch (error) {
      toast.error("An error occurred while approving the change.");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Access Denied
      </div>
    );
  }

  return (
    <div className="min-h-screen sports-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* IMPORTANT: No TabsList; we still use Tabs to reuse your existing TabsContent blocks */}
        <Tabs value={currentTab} className="space-y-6">
          {/* ---------- OVERVIEW (landing) ---------- */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                onClick={() => gotoTab("users")}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Players’ Verifications
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground mr-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pendingUsers?.length ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card
                onClick={() => gotoTab("club-changes")}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Club Change Requests
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground mr-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clubChangeReq?.length ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card
                onClick={() => gotoTab("extensions")}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New & Renew Player Registration Requests
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground mr-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pendingReg?.length ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>
              <Link to="/allPlayers" className="text-decoration-none">
                <Card className="cursor-pointer hover:shadow-lg transition">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      All players
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground mr-5" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {notRegisteredPlayerCount ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Not Registered Players
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/allPosts" className="text-decoration-none">
                <Card className="cursor-pointer hover:shadow-lg transition">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      All posts
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground mr-5" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{postCount ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Total Posts</p>
                  </CardContent>
                </Card>
              </Link>
              {/* <Link to="/settings" className="text-decoration-none">
                <Card className="cursor-pointer hover:shadow-lg transition">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Settings
                    </CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground mr-5" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Platform Configuration
                    </p>
                  </CardContent>
                </Card>
              </Link> */}
              <Link to="/settings" className="fixed bottom-8 right-8 z-50">
                <Card className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl border-2 hover:border-primary hover:scale-105 transition-all duration-300 group bg-white">
                  {/* The Wheel Icon */}
                  <Settings className="w-8 h-8 text-gray-600 group-hover:rotate-90 transition-transform duration-500" />
                </Card>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2">
              <Card
                onClick={() => gotoTab("admin-accounts")}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Admin Accounts
                  </CardTitle>
                  <CardDescription>
                    Manage administrator accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tap to create or view admins
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ---------- USERS ---------- */}
          <TabsContent value="users">
            <Card>
              <CardTitle className="ml-5 mt-5">
                Pending Players’ Verifications
              </CardTitle>
              <CardHeader>
                <CardDescription>
                  Review and Approve New Player Verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers?.map((u) => (
                      <TableRow key={u?.id}>
                        <TableCell>
                          <img
                            src={` ${u?.profilePictureName}`}
                            alt="Profile"
                            className="w-[50px] h-[50px] rounded-full object-cover border-2 border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          {u?.firstName} {u?.lastName}
                        </TableCell>
                        <TableCell>{u?.contact}</TableCell>
                        <TableCell>{u?.district}</TableCell>
                        <TableCell>
                          {new Date(u?.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(u)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- CLUB CHANGES ---------- */}
          <TabsContent value="club-changes">
            <Card>
              <CardTitle className="ml-5 mt-5">Club Change Requests</CardTitle>
              <CardHeader>
                <CardDescription>
                  Review requests to change club affiliations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SLBF ID</TableHead>
                      <TableHead>New Association</TableHead>
                      <TableHead>New Club</TableHead>
                      {/* <TableHead>Club Type</TableHead> */}
                      <TableHead>Request Date</TableHead>
                      {/* <TableHead>Resigned Association</TableHead>
                      <TableHead>New Association</TableHead> */}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clubChangeReq?.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {request?.user?.firstName} {request?.user?.lastName}
                        </TableCell>
                        <TableCell>{request?.user?.player?.slbfId}</TableCell>
                        {/* <TableCell>{request?.type}</TableCell> */}
                        <TableCell>{request?.newAssName}</TableCell>
                        <TableCell>{request?.newClubName || "N/A"}</TableCell>
                        {/* <TableCell>
                          {request?.oldAssId ? request.oldAssId : "None"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {request?.newClubId}
                        </TableCell> */}
                        <TableCell>
                          {request?.createdAt
                            ? new Date(request.createdAt).toLocaleString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleclubDetails(request)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- EXTENSIONS ---------- */}
          <TabsContent value="extensions">
            <Card>
              <CardTitle className="ml-5 mt-5">
                New & Renew Player Registration Requests
              </CardTitle>
              <CardHeader>
                <CardDescription>Review New & Renewal Requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SLBF Reg.No.</TableHead>
                      <TableHead>Reference No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReg?.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {request?.user?.firstName} {request?.user?.lastName}
                        </TableCell>
                        <TableCell>{request?.user?.player?.slbfId}</TableCell>
                        <TableCell>{request?.referenceNo}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {new Date(request?.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleRegDetails(request)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- ALLPLAYERS ---------- */}
          <TabsContent value="allplayers">
            <Card>
              <CardTitle className="ml-5 mt-5">ppp</CardTitle>
              <CardHeader>
                <CardDescription>Review New & Renewal Requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SLBF Reg.No.</TableHead>
                      <TableHead>Reference No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReg?.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {request?.user?.firstName} {request?.user?.lastName}
                        </TableCell>
                        <TableCell>{request?.user?.player?.slbfId}</TableCell>
                        <TableCell>{request?.referenceNo}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {new Date(request?.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleRegDetails(request)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- ADMIN ACCOUNTS ---------- */}
          <TabsContent value="admin-accounts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create New Admin Account
                  </CardTitle>
                  <CardDescription>Add a new administrator</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={newAdminData.fullName}
                        onChange={(e) =>
                          setNewAdminData((p) => ({
                            ...p,
                            fullName: e.target.value,
                          }))
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={newAdminData.firstName}
                        onChange={(e) =>
                          setNewAdminData((p) => ({
                            ...p,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={newAdminData.lastName}
                        onChange={(e) =>
                          setNewAdminData((p) => ({
                            ...p,
                            lastName: e.target.value,
                          }))
                        }
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={newAdminData.email}
                        onChange={(e) =>
                          setNewAdminData((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact</Label>
                      <Input
                        type="email"
                        value={newAdminData.contactNumber}
                        onChange={(e) =>
                          setNewAdminData((p) => ({
                            ...p,
                            contactNumber: e.target.value,
                          }))
                        }
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>NIC Number</Label>
                      <Input
                        type="email"
                        value={newAdminData.idCardNumber}
                        onChange={(e) =>
                          setNewAdminData((p) => ({
                            ...p,
                            idCardNumber: e.target.value,
                          }))
                        }
                        placeholder="Enter NIC number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={newAdminData.dateOfbirth}
                        onChange={(e) =>
                          setNewAdminData((p) => ({
                            ...p,
                            dateOfbirth: e.target.value,
                          }))
                        }
                        placeholder="Select date of birth"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Select
                        value={newAdminData.district}
                        onValueChange={(value) =>
                          handleInputChange("district", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gengerTypes">Gender</Label>
                      <Select
                        value={newAdminData.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {gengerTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={newAdminData.password}
                        onChange={(e) =>
                          setNewAdminData((p) => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        value={newAdminData.confirmPassword}
                        onChange={(e) =>
                          setNewAdminData((p) => ({
                            ...p,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateAdmin} className="w-full">
                    Create Admin Account
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Admin Accounts</CardTitle>
                  <CardDescription>Current administrators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {admins && admins.length > 0 ? (
                      admins.some(
                        (admin) => Number(admin.id) !== Number(user.id),
                      ) ? (
                        admins
                          .filter(
                            (admin) => Number(admin.id) !== Number(user.id),
                          )
                          .map((admin, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div>
                                <div className="font-medium">
                                  {admin.firstName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {admin.email}
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-gray-500 text-sm">
                          You are the only admin.
                        </div>
                      )
                    ) : (
                      <div className="text-gray-500 text-sm">
                        You are the only admin.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- Reject Confirm Modal (unchanged) --- */}
      {showRejectModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6 text-gray-600">
              This action will {showRejectModal.message}. Do you want to
              continue?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  const rejectUser = {
                    id: selectedUser?.id?.toString() || "",
                    table: "user",
                    column: "status",
                    value: "rejected",
                  };
                  const rejectPayment = {
                    id: regUser?.id?.toString() || "",
                    table: "payment",
                    column: "status",
                    value: "rejected",
                  };
                  const rejectClubchange = {
                    id: clubchangeuser?.id?.toString() || "",
                    table: "clubchange",
                    column: "status",
                    value: "rejected",
                  };

                  if (showRejectModal.message === "reject this user") {
                    handleReject(rejectUser);
                  } else if (
                    showRejectModal.message === "reject this payment"
                  ) {
                    handleReject(rejectPayment);
                  } else if (
                    showRejectModal.message === "reject this club change"
                  ) {
                    handleReject(rejectClubchange);
                  }
                  setShowRejectModal({ show: false, message: "" });
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Reject
              </button>
              <button
                onClick={() => setShowRejectModal({ show: false, message: "" })}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Your three detail dialogs (unchanged except they still work here) --- */}
      {/* PdetailsModel */}
      <Dialog open={showPdetailsModal} onOpenChange={setShowPdetailsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Player Details</DialogTitle>
            <DialogDescription>
              Review the player information and ID documents before taking
              action.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <div>
                <Label>Full Name</Label>
                <p>{selectedUser?.fullName}</p>
              </div>
              <div>
                <Label>Gender</Label>
                <p>{selectedUser?.gender}</p>
              </div>
              <div>
                <Label>ID Number</Label>
                <p>{selectedUser?.nicNum}</p>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <p>
                  {selectedUser?.dateofBirth
                    ? new Date(selectedUser?.dateofBirth).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <Label>District</Label>
                <p>{selectedUser?.district}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p>{selectedUser?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>ID Front</Label>
                <div className="flex gap-4 p-4 transition-all duration-300">
                  {/* LEFT SIDE: The Thumbnail/Initial View */}
                  <div
                    className={`${expandedView === "front" ? "w-1/2" : "w-full"} transition-all`}
                  >
                    <img
                      src={selectedUser?.player?.idFrontImage}
                      alt="ID Front"
                      className="w-full h-52 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition"
                      onClick={() =>
                        setExpandedView(
                          expandedView === "front" ? null : "front",
                        )
                      }
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {expandedView === "front"
                        ? "Click the image to close"
                        : "Click to view full image"}
                    </p>
                  </div>

                  {/* RIGHT SIDE: The Full Image (Only shows after click) */}
                  {expandedView === "front" && (
                    <div className="fixed top-0 right-0 z-50 w-1/2 h-full bg-white border-l shadow-2xl animate-in slide-in-from-right duration-300 rounded-l">
                      {/* Close Button (X) */}
                      <button
                        onClick={() => setExpandedView(null)}
                        className="absolute top-4 left-4 z-[60] bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
                      >
                        ✕
                      </button>

                      {/* Full Image Container */}
                      <div className="w-full h-full flex items-center justify-center p-2 bg-gray-100">
                        <img
                          src={selectedUser?.player?.idFrontImage}
                          alt="Full ID Front"
                          className="max-w-full max-h-full object-contain shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>ID Back</Label>
                <div className="flex gap-4 p-4 transition-all duration-300">
                  {/* LEFT SIDE: The Thumbnail/Initial View */}
                  <div
                    className={`${expandedView === "back" ? "w-1/2" : "w-full"} transition-all`}
                  >
                    <img
                      src={selectedUser?.player?.idBackImage}
                      alt="ID Back"
                      className="w-full h-52 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition"
                      onClick={() =>
                        setExpandedView(expandedView === "back" ? null : "back")
                      }
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {expandedView === "back"
                        ? "Click the image to close"
                        : "Click to view full image"}
                    </p>
                  </div>

                  {/* RIGHT SIDE: The Full Image (Only shows after click) */}
                  {expandedView === "back" && (
                    <div className="fixed top-0 right-0 z-50 w-1/2 h-full bg-white border-l shadow-2xl animate-in slide-in-from-right duration-300 rounded-l">
                      {/* Close Button (X) */}
                      <button
                        onClick={() => setExpandedView(null)}
                        className="absolute top-4 left-4 z-[60] bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
                      >
                        ✕
                      </button>

                      {/* Full Image Container */}
                      <div className="w-full h-full flex items-center justify-center p-2 bg-gray-100">
                        <img
                          src={selectedUser?.player?.idBackImage}
                          alt="Full ID Back"
                          className="max-w-full max-h-full object-contain shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                setShowRejectModal({ show: true, message: "reject this user" });
                setShowPdetailsModal(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
            <Button
              onClick={() =>
                handleUserApproval(
                  selectedUser?.id?.toString(),
                  selectedUser?.player?.id?.toString(),
                  selectedUser?.dateofBirth
                    ? new Date(selectedUser?.dateofBirth)
                    : undefined,
                  selectedUser?.district,
                )
              }
            >
              Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PaymentdetailsModel */}
      <Dialog
        open={showPaymentdetailsModal}
        onOpenChange={setShowPaymentdetailsModal}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Review the player information and payment.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <div>
                <Label>Name</Label>
                <p>
                  {regUser?.user?.firstName} {regUser?.user?.lastName}
                </p>
              </div>
              <div>
                <Label>Gender</Label>
                <p>{regUser?.user?.gender}</p>
              </div>
              <div>
                <Label>ID Number</Label>
                <p>{regUser?.user?.nicNum}</p>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <p>
                  {regUser?.user?.dateofBirth
                    ? new Date(regUser?.user?.dateofBirth).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <Label>District</Label>
                <p>{regUser?.user?.district}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p>{regUser?.user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Reference No.</Label>
                <p>{regUser?.referenceNo}</p>
              </div>
              <div>
                <Label>Payment Slip</Label>
                {/* <img
                  src={`${regUser?.slipImage}`}
                  alt="slip"
                  className="w-full h-[400px] object-cover rounded-lg border"
                /> */}
                <div className="flex gap-4 p-4 transition-all duration-300">
                  {/* LEFT SIDE: The Thumbnail/Initial View */}
                  <div
                    className={`${isExpanded ? "w-1/2" : "w-full"} transition-all`}
                  >
                    <img
                      src={regUser?.slipImage}
                      alt="ID Back"
                      className="w-full h-52 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition"
                      onClick={() => setIsExpanded(!isExpanded)}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {isExpanded
                        ? "Click the image to close"
                        : "Click to view full image"}
                    </p>
                  </div>

                  {/* RIGHT SIDE: The Full Image (Only shows after click) */}
                  {isExpanded && (
                    <div className="fixed top-0 right-0 z-50 w-1/2 h-full bg-white border-l shadow-2xl animate-in slide-in-from-right duration-300 rounded-l">
                      {/* Close Button (X) */}
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-4 left-4 z-[60] bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
                      >
                        ✕
                      </button>

                      {/* Full Image Container */}
                      <div className="w-full h-full flex items-center justify-center p-2 bg-gray-100">
                        <img
                          src={regUser?.slipImage}
                          alt="Full ID Back"
                          className="max-w-full max-h-full object-contain shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                setShowRejectModal({
                  show: true,
                  message: "reject this payment",
                });
                setShowPaymentdetailsModal(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
            <Button
              onClick={() =>
                handleUserpaymentApproval(
                  regUser?.userId?.toString(),
                  regUser?.id?.toString(),
                  regUser?.user?.player?.id?.toString(),
                  regUser?.user?.player?.slbfId,
                )
              }
            >
              Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CulbchangedetailsModel */}
      <Dialog
        open={culbchangedetailsModel}
        onOpenChange={setCulbchangedetailsModel}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            {clubchangeuser?.type === "open" ? (
              <DialogTitle>Open Club Change Details</DialogTitle>
            ) : (
              <DialogTitle>Close Club Change Details</DialogTitle>
            )}
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="flex items-center gap-x-2">
              <Label>Name :</Label>
              <p>
                {clubchangeuser?.user?.firstName}{" "}
                {clubchangeuser?.user?.lastName}
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <Label>SLBF ID :</Label>
              <p className="text-sm">{clubchangeuser?.user?.player?.slbfId} </p>
            </div>
            <div className="flex items-center gap-x-2">
              <Label>District :</Label>
              <p>{clubchangeuser?.user?.district}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clubchangeuser?.oldAssId ? (
              <div className="s">
                <div className="flex items-center gap-x-2">
                  {clubchangeuser?.type === "open" ? (
                    <Label>Old Open Association Name :</Label>
                  ) : (
                    <Label>Old Close Association Name :</Label>
                  )}
                  <p>{clubchangeuser?.oldAssName || "N/A"}</p>
                </div>
                <div className="flex items-center gap-x-2">
                  {clubchangeuser?.type === "open" ? (
                    <Label>Old Open Club Name :</Label>
                  ) : (
                    <Label>Old Close Club Name :</Label>
                  )}
                  <p>{clubchangeuser?.oldClubName || "N/A"}</p>
                </div>
                <div>
                  <Label>Resignation Letter</Label>
                  <img
                    src={`${clubchangeuser?.oldImage}`}
                    alt="Resignation Letter"
                    className="w-full h-[300px] object-cover rounded-lg border"
                  />
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="">
              <div className="flex items-center gap-x-2">
                {clubchangeuser?.type === "open" ? (
                  <Label>New Open Association Name :</Label>
                ) : (
                  <Label>New Close Association Name :</Label>
                )}
                <p>{clubchangeuser?.newAssName || "N/A"}</p>
              </div>
              <div className="flex items-center gap-x-2">
                {clubchangeuser?.type === "open" ? (
                  <Label>New Open Club Name :</Label>
                ) : (
                  <Label>New Close Club Name :</Label>
                )}
                <p>{clubchangeuser?.newClubName || "N/A"}</p>
              </div>
              <div>
                <Label>Offer Letter</Label>
                <img
                  src={`${clubchangeuser?.newImage}`}
                  alt="Offer Letter"
                  className="w-full h-[300px] object-cover rounded-lg border"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                setShowRejectModal({
                  show: true,
                  message: "reject this club change",
                });
                setCulbchangedetailsModel(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
            <Button
              onClick={() =>
                handleClubChangeRequest(
                  clubchangeuser?.id?.toString(),
                  clubchangeuser?.user?.player?.id?.toString(),
                  clubchangeuser?.user?.player?.slbfId || "",
                  clubchangeuser?.type,
                  clubchangeuser?.newAssId,
                  clubchangeuser?.newAssName,
                  clubchangeuser?.newAssCode,
                  clubchangeuser?.newClubId,
                  clubchangeuser?.newClubName,
                  clubchangeuser?.newClubCode,
                  clubchangeuser?.oldAssId,
                  clubchangeuser?.oldAssName,
                  clubchangeuser?.oldAssCode,
                  clubchangeuser?.oldClubId,
                  clubchangeuser?.oldClubName,
                  clubchangeuser?.oldClubCode,
                )
              }
            >
              Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <NewAdminConfirmModel
        open={showConfirm}
        data={newAdminData}
        onConfirm={confirmCreate}
        onCancel={cancelCreate}
      />
    </div>
  );
};

export default AdminDashboard;

// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button"; // if unused elsewhere, you can remove
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { playerDetails } from "@/api/commonApi";
import { GetAssDetails, GetClubDetails } from "@/api/adminApi";
import { useAuth } from "@/contexts/AuthContext";

// -------------------- Component --------------------
const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const location = useLocation();

  // Route param/state
  const userIdFromState = (
    location.state as { userId?: string | number } | undefined
  )?.userId;
  const id = userIdFromState ? String(userIdFromState) : "";

  // Data state
  const [playerInfo, setPlayerInfo] = useState(null);

  // For showing existing club names fetched by id (fallbacks to simple “Not selected” if absent)
  const [openassdetails, setOpenAssdetails] = useState(null);
  const [openclubdetails, setOpenclubdetails] = useState(null);
  const [closeassdetails, setCloseAssdetails] = useState(null);
  const [closeclubdetails, setCloseclubdetails] = useState(null);

  const [loading, setLoading] = useState<boolean>(true);

  const currentUser = playerInfo;
  const status = currentUser?.status;

  // -------------------- Effects --------------------
  useEffect(() => {
    if (id && !playerInfo) {
      fetchPlayerData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, playerInfo]);
  console.log("addddd User Data:", authUser?.role);

  // -------------------- API helpers --------------------
  const getAssClubdetails = async (
    openAssId?: number | null,
    openclubId?: number | null,
    closeAssId?: number | null,
    closeClubId?: number | null
  ) => {
    try {
      if (openAssId) {
        const openAssData = await GetAssDetails("open", openAssId);
        setOpenAssdetails(openAssData);

        const openClubData = await GetClubDetails(
          "open",
          openAssId,
          openclubId ?? undefined
        );
        setOpenclubdetails(openClubData ?? null);
      }
      if (closeAssId) {
        const closeAssData = await GetAssDetails("close", closeAssId);
        setCloseAssdetails(closeAssData ?? null);

        if (closeClubId) {
          const closeClubData = await GetClubDetails(
            "close",
            closeAssId,
            closeClubId
          );
          setCloseclubdetails(closeClubData ?? null);
        }
      }
    } catch {
      toast.error("Failed to load association and club details.");
    }
  };

  const fetchPlayerData = async () => {
    try {
      const numericId = parseInt(id, 10);
      if (!numericId) {
        setLoading(false);
        return;
      }

      const playerData: UserShape = await playerDetails(numericId);
      setPlayerInfo(playerData);

      await getAssClubdetails(
        playerData?.player?.openAssId ?? null,
        playerData?.player?.openClubId ?? null,
        playerData?.player?.closeAssId ?? null,
        playerData?.player?.closeClubId ?? null
      );
    } catch (error) {
      toast.error("Failed to load player details.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Render guards --------------------
  if (loading) {
    return <div className="p-4 text-gray-500">Loading profile...</div>;
  }

  if (!currentUser) {
    return <div className="p-4 text-gray-500">User not found</div>;
  }

  // -------------------- JSX (styled to match the provided reference) --------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-12 sports-gradient">
      <div className="container mx-auto px-4 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Player Information</CardTitle>
                    <CardDescription>
                      Personal details and registration info
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-12">
                  {/* Header: avatar + name + badges */}
                  <div className="flex items-center space-x-8">
                    {currentUser.profilePictureName ? (
                      <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                        <img
                          // src={`http://localhost:3000/uploads/${currentUser?.profilePictureName}`}
                          src={`${currentUser?.profilePictureName}`}
                          alt="Profile preview"
                          className="w-[150px] h-[150px] rounded-full object-cover border-2 border-gray-300"
                        />
                      </div>
                    ) : (
                      <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-2xl">
                        {(currentUser?.firstName?.charAt(0) || "") +
                          (currentUser?.lastName?.charAt(0) || "")}
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
                          <Badge className="bg-yellow-100 text-yellow-800 w-auto">
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

                        {/* Registration state */}
                        {(() => {
                          const hasPending =
                            currentUser?.pendingPayment?.status === "pending";
                          const regExp = currentUser?.player?.regExpDate
                            ? new Date(currentUser.player.regExpDate)
                            : null;
                          const now = new Date();

                          if (hasPending) {
                            return (
                              <Badge className="bg-yellow-100 text-yellow-900">
                                🟡 Registration Pending
                              </Badge>
                            );
                          }

                          if (!currentUser?.pendingPayment && !regExp) {
                            return (
                              <Badge className="bg-gray-100 text-black">
                                ⚫ Not Registered
                              </Badge>
                            );
                          }

                          if (!currentUser?.pendingPayment && regExp) {
                            const isActive = regExp > now;
                            if (isActive) {
                              return (
                                <Badge className="bg-green-100 text-green-800">
                                  🟢 Registered
                                </Badge>
                              );
                            }
                            return (
                              <Badge className="bg-red-100 text-red-800">
                                🔴 Registration Expired
                              </Badge>
                            );
                          }

                          return null;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Read-only section 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    {authUser?.role === "admin" ? (
                      <>
                        <div className="space-y-2">
                          <Label>NIC Number</Label>
                          <Input value={currentUser?.nicNum || ""} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={currentUser?.email || ""} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Number</Label>
                          <Input value={currentUser?.contact} disabled />
                        </div>
                      </>
                    ) : null}

                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        value={
                          currentUser.dateofBirth
                            ? new Date(
                                currentUser.dateofBirth
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"
                        }
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>District</Label>
                      <Input value={currentUser.district || ""} disabled />
                    </div>
                    {authUser?.role === "admin" ? (
                      <>
                        <div className="space-y-2">
                          <Label>Height (cm)</Label>
                          <Input value={currentUser?.player?.height} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>Weight (kg)</Label>
                          <Input value={currentUser?.player?.weight} disabled />
                        </div>
                      </>
                    ) : null}
                  </div>

                  {/* Club Information (simplified like reference) */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold">
                        Club Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="space-y-2">
                          <Label>Open Association</Label>
                          <Input
                            value={
                              openassdetails?.name ??
                              (currentUser?.player as any)?.openAssociation ??
                              "Not selected"
                            }
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Open Club</Label>
                          <Input
                            value={
                              openclubdetails?.name ??
                              (currentUser?.player as any)?.openClub ??
                              "Not selected"
                            }
                            disabled
                          />
                        </div>
                      </div>

                      <div>
                        <div className="space-y-2">
                          <Label>Close Association</Label>
                          <Input
                            value={
                              closeassdetails?.name ??
                              (currentUser?.player as any)?.closeClub ??
                              "Not selected"
                            }
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Close Club</Label>
                          <Input
                            value={
                              closeclubdetails?.name ??
                              (currentUser?.player as any)?.closeClub ??
                              "Not selected"
                            }
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Registration details card */}
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
                            currentUser.player.regDate
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
                            currentUser.player.regExpDate
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
      </div>
    </div>
  );
};

export default Profile;

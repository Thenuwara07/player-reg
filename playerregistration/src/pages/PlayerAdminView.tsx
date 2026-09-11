// src/pages/Players.tsx
// - Left sidebar (filters): 1/4 width on lg+
// - Right content (players data): 3/4 width on lg+
// - Mobile: stacked (filters above results)

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlayerRow from "@/components/Common/PlayerRow";
import type { User1, PlayersResponse } from "@/types/playerViewDataTypes";
import { Search, Filter, Users, XCircle } from "lucide-react";
import { getAllPlayers } from "@/api/adminApi";
import { toast } from "sonner";

const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

type RegStatus = "not_registered" | "active" | "expired";

const getRegStatus = (p: User1): RegStatus => {
  const regDateStr = p?.player?.regDate as string | undefined;
  const regExpStr = p?.player?.regExpDate as string | undefined;
  if (!regDateStr) return "not_registered";

  const now = new Date();
  const regDate = new Date(regDateStr);
  const regExp = regExpStr ? new Date(regExpStr) : undefined;

  if (regExp && now > regExp) return "expired";
  if (now >= regDate && (!regExp || now <= regExp)) return "active";
  return "not_registered";
};

const norm = (v: any) => (v ?? "").toString().toLowerCase();
const digitsOnly = (v: any) => (v ?? "").toString().replace(/\D/g, "");

type CodeName = { code?: string; name?: string } | undefined | null;

// safer label that never returns a dangling “)”
const labelOf = (o: CodeName) => {
  if (!o?.code && !o?.name) return "";
  if (o?.code && o?.name) return `${o.name} (${o.code})`;
  return o?.name ?? o?.code ?? "";
};

const uniqueBy = <T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (x: T) => K | undefined
) => {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const it of arr) {
    const k = keyFn(it);
    if (k === undefined) continue;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }
  return out;
};

const Players: React.FC = () => {
  // store ONLY the array of users
  const [players, setPlayers] = useState<User1[] | null>(null);
  const [loading, setLoading] = useState(true);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [clubFilter, setClubFilter] = useState("all"); // fuzzy (any club name/code)
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "unconfirmed">("all");
  const [regFilter, setRegFilter] = useState<"all" | RegStatus>("all");
  const [slbfFilter, setSlbfFilter] = useState("");
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");

  // exact selects by CODE
  const [openAssocFilter, setOpenAssocFilter] = useState<string>("all");
  const [closeAssocFilter, setCloseAssocFilter] = useState<string>("all");
  const [openClubFilterExact, setOpenClubFilterExact] = useState<string>("all");
  const [closeClubFilterExact, setCloseClubFilterExact] = useState<string>("all");

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const resp: PlayersResponse = await getAllPlayers();
        setPlayers(resp.data); // store only the array
        console.log("Fetched players data:", resp);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load player details.");
      } finally {
        setLoading(false);
      }
    };
    if (!players) fetchPlayerData();
  }, [players]);

  const playersWithAge = useMemo(() => {
    if (!players) return [];
    return players.map((p) => ({ ...p, age: calculateAge(p.dateofBirth) }));
  }, [players]);

  // ---- options for selects ----
  const [districts, clubTextOptions] = useMemo(() => {
    const ds = Array.from(new Set(playersWithAge.map((p) => p.district).filter(Boolean)));
    // For fuzzy club text filter, gather unique strings from both name and code
    const allClubsText = playersWithAge.flatMap((p) => {
      const oc = p?.player?.openClub;
      const cc = p?.player?.closeClub;
      const pieces: string[] = [];
      if (oc?.name) pieces.push(oc.name);
      if (oc?.code) pieces.push(oc.code);
      if (cc?.name) pieces.push(cc.name);
      if (cc?.code) pieces.push(cc.code);
      return pieces;
    });
    const cs = Array.from(new Set(allClubsText.filter(Boolean))) as string[];
    return [ds, cs];
  }, [playersWithAge]);

  const openAssocOptions = useMemo(() => {
    const arr = playersWithAge
      .map((p) => p.player?.openAssociation)
      .filter(Boolean) as { code?: string; name?: string }[];
    return uniqueBy(arr, (x) => x.code ?? "").filter((x) => x.code);
  }, [playersWithAge]);

  const closeAssocOptions = useMemo(() => {
    const arr = playersWithAge
      .map((p) => p.player?.closeAssociation)
      .filter(Boolean) as { code?: string; name?: string }[];
    return uniqueBy(arr, (x) => x.code ?? "").filter((x) => x.code);
  }, [playersWithAge]);

  const openClubOptions = useMemo(() => {
    const arr = playersWithAge
      .map((p) => p.player?.openClub)
      .filter(Boolean) as { code?: string; name?: string }[];
    return uniqueBy(arr, (x) => x.code ?? "").filter((x) => x.code);
  }, [playersWithAge]);

  const closeClubOptions = useMemo(() => {
    const arr = playersWithAge
      .map((p) => p.player?.closeClub)
      .filter(Boolean) as { code?: string; name?: string }[];
    return uniqueBy(arr, (x) => x.code ?? "").filter((x) => x.code);
  }, [playersWithAge]);

  const filteredPlayers = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();
    const searchDigits = digitsOnly(searchTerm);
    const slbfLower = slbfFilter.trim().toLowerCase();
    const minA = minAge === "" ? undefined : Number(minAge);
    const maxA = maxAge === "" ? undefined : Number(maxAge);

    return playersWithAge.filter((p) => {
      const first = norm(p.firstName);
      const last = norm(p.lastName);
      const full = norm(`${p.firstName} ${p.lastName}`);
      const slbf = norm(p?.player?.slbfId);
      const nic = norm(p.nicNum);
      const phoneDigits = digitsOnly(p.contact);

      // fuzzy search: name, SLBF, NIC, phone
      const matchesSearch =
        first.includes(searchLower) ||
        last.includes(searchLower) ||
        full.includes(searchLower) ||
        slbf.includes(searchLower) ||
        nic.includes(searchLower) ||
        (searchDigits && phoneDigits.includes(searchDigits));

      const matchesDistrict = districtFilter === "all" || p.district === districtFilter;

      // fuzzy "Club" text filter (any of name/code for open/close club)
      const clubLower = clubFilter.toLowerCase();
      const openClubName = norm(p.player?.openClub?.name);
      const openClubCode = norm(p.player?.openClub?.code);
      const closeClubName = norm(p.player?.closeClub?.name);
      const closeClubCode = norm(p.player?.closeClub?.code);

      const matchesClubText =
        clubFilter === "all" ||
        openClubName.includes(clubLower) ||
        openClubCode.includes(clubLower) ||
        closeClubName.includes(clubLower) ||
        closeClubCode.includes(clubLower);

      // exact filters by CODE
      const matchesOpenAssoc =
        openAssocFilter === "all" || p.player?.openAssociation?.code === openAssocFilter;

      const matchesCloseAssoc =
        closeAssocFilter === "all" || p.player?.closeAssociation?.code === closeAssocFilter;

      const matchesOpenClubExact =
        openClubFilterExact === "all" || p.player?.openClub?.code === openClubFilterExact;

      const matchesCloseClubExact =
        closeClubFilterExact === "all" || p.player?.closeClub?.code === closeClubFilterExact;

      const ageOk =
        (minA === undefined || p.age >= minA) &&
        (maxA === undefined || p.age <= maxA);

      const isConfirmed = norm(p.status) === "confirmed";
      const statusOk =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && isConfirmed) ||
        (statusFilter === "unconfirmed" && !isConfirmed);

      const regStatus = getRegStatus(p);
      const regOk = regFilter === "all" || regStatus === regFilter;

      const slbfOk = !slbfLower || slbf.includes(slbfLower);

      return (
        matchesSearch &&
        matchesDistrict &&
        matchesClubText &&
        matchesOpenAssoc &&
        matchesCloseAssoc &&
        matchesOpenClubExact &&
        matchesCloseClubExact &&
        ageOk &&
        statusOk &&
        regOk &&
        slbfOk
      );
    });
  }, [
    playersWithAge,
    searchTerm,
    districtFilter,
    clubFilter,
    minAge,
    maxAge,
    statusFilter,
    regFilter,
    slbfFilter,
    openAssocFilter,
    closeAssocFilter,
    openClubFilterExact,
    closeClubFilterExact,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setDistrictFilter("all");
    setClubFilter("all");
    setMinAge("");
    setMaxAge("");
    setStatusFilter("all");
    setRegFilter("all");
    setSlbfFilter("");
    setOpenAssocFilter("all");
    setCloseAssocFilter("all");
    setOpenClubFilterExact("all");
    setCloseClubFilterExact("all");
  };

  const activeFiltersCount = useMemo(() => {
    let n = 0;
    if (searchTerm.trim() !== "") n++;
    if (districtFilter !== "all") n++;
    if (clubFilter !== "all") n++;
    if (statusFilter !== "all") n++;
    if (regFilter !== "all") n++;
    if (slbfFilter.trim() !== "") n++;
    if (minAge !== "") n++;
    if (maxAge !== "") n++;
    if (openAssocFilter !== "all") n++;
    if (closeAssocFilter !== "all") n++;
    if (openClubFilterExact !== "all") n++;
    if (closeClubFilterExact !== "all") n++;
    return n;
  }, [
    searchTerm,
    districtFilter,
    clubFilter,
    statusFilter,
    regFilter,
    slbfFilter,
    minAge,
    maxAge,
    openAssocFilter,
    closeAssocFilter,
    openClubFilterExact,
    closeClubFilterExact,
  ]);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="min-h-screen sports-gradient">
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-50">All Players</h2>
          <Badge className="bg-green-100 text-green-800">
            {filteredPlayers.length} of {playersWithAge?.length || 0} Players
          </Badge>
        </div>

        {/* Two-column layout: filters (1/4) | results (3/4) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* LEFT: Filters */}
          <aside className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter Players
                </CardTitle>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      {activeFiltersCount} active
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="gap-2"
                    title="Clear all filters"
                  >
                    <XCircle className="w-4 h-4" />
                    Clear
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search name, SLBF, NIC, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* General selects */}
                <div className="space-y-3 mb-4">
                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {districts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Fuzzy Club text (any name/code) */}
                  {/* <Select value={clubFilter} onValueChange={setClubFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Club (name/code contains…)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clubs</SelectItem>
                      {clubTextOptions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}

                  <Select
                    value={statusFilter}
                    onValueChange={(v: "all" | "confirmed" | "unconfirmed") => setStatusFilter(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Verified</SelectItem>
                      <SelectItem value="unconfirmed">Unverified</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={regFilter}
                    onValueChange={(v: "all" | RegStatus) => setRegFilter(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Registration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Registration</SelectItem>
                      <SelectItem value="active">Registered (Active)</SelectItem>
                      <SelectItem value="expired">Registration Expired</SelectItem>
                      <SelectItem value="not_registered">Not Registered</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="SLBF ID (e.g., SLBF-3-ARM-KDY/KBC)"
                    value={slbfFilter}
                    onChange={(e) => setSlbfFilter(e.target.value)}
                  />
                </div>

                {/* Age */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Min Age"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="Max Age"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                  />
                </div>

                {/* Exact by CODE */}
                <div className="space-y-3">
                  <Select value={openAssocFilter} onValueChange={setOpenAssocFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Open Association (code)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Open Associations</SelectItem>
                      {openAssocOptions.map((a) => (
                        <SelectItem key={a.code} value={a.code!}>
                          {labelOf(a)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={closeAssocFilter} onValueChange={setCloseAssocFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Close Association (code)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Close Associations</SelectItem>
                      {closeAssocOptions.map((a) => (
                        <SelectItem key={a.code} value={a.code!}>
                          {labelOf(a)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={openClubFilterExact} onValueChange={setOpenClubFilterExact}>
                    <SelectTrigger>
                      <SelectValue placeholder="Open Club (code)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Open Clubs</SelectItem>
                      {openClubOptions.map((c) => (
                        <SelectItem key={c.code} value={c.code!}>
                          {labelOf(c)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={closeClubFilterExact} onValueChange={setCloseClubFilterExact}>
                    <SelectTrigger>
                      <SelectValue placeholder="Close Club (code)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Close Clubs</SelectItem>
                      {closeClubOptions.map((c) => (
                        <SelectItem key={c.code} value={c.code!}>
                          {labelOf(c)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* RIGHT: Results */}
          <main className="lg:col-span-3">
            <div className="overflow-x-auto">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    Loading players…
                  </CardContent>
                </Card>
              ) : filteredPlayers.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Open Club Details</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Close Club Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPlayers.map((player) => (
                      <PlayerRow key={player.id} player={player} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-500">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No players found</h3>
                      <p>Try adjusting your filters to see more results.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Players;

// src/pages/AssClubChangeHistory.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { XCircle, Search } from "lucide-react";
import {fetchApprovedClubchanges} from "@/api/adminApi";



// ---- Helpers ----
const safe = (v?: string | null) => (v ?? "").trim();
const label = (code?: string | null, name?: string | null) => {
  const c = safe(code);
  const n = safe(name);
  if (!c && !n) return "-";
  if (c && n) return `${n} (${c})`;
  return c || n;
};
const fmtDate = (isoOrYmd?: string | null) => {
  const s = safe(isoOrYmd);
  if (!s) return "-";
  const d = new Date(s);
  // If it's plain YYYY-MM-DD, Date treats as UTC: still fine for display
  return isNaN(d.getTime()) ? s : d.toLocaleString();
};
const buildImgSrc = (imageBaseUrl: string | undefined, path?: string | null) => {
  const p = safe(path);
  if (!p) return "";
  if (p.startsWith("http://") || p.startsWith("https://") || p.startsWith("/")) return p;
  return `${imageBaseUrl ?? ""}${p}`;
};

// ---- Status + Type badges ----
const TypeBadge: React.FC<{ t: string }> = ({ t }) => {
  const tone =
    t === "open"
      ? "bg-blue-100 text-blue-800"
      : t === "close"
      ? "bg-orange-100 text-orange-800"
      : "bg-gray-100 text-gray-800";
  return <Badge className={tone} title={t}>{t}</Badge>;
};

const StatusBadge: React.FC<{ s: string }> = ({ s }) => {
  const tone =
    s === "approved"
      ? "bg-green-100 text-green-800"
      : s === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : s === "rejected"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";
  return <Badge className={tone} title={s}>{s}</Badge>;
};

// ---- Page ----
type Props = {
  data: AssClubChangeRecord[];
  imageBaseUrl?: string; // e.g., "/uploads/" or "https://cdn.example.com/changes/"
};

const AssClubChangeHistory: React.FC<Props> = ({ data, imageBaseUrl }) => {
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "open" | "close">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">(
    "all"
  );
  const [clubChanges, setClubChanges] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const changes = await fetchApprovedClubchanges();
        setClubChanges(changes);
      } catch (error) {
        console.error("Failed to fetch club changes:", error);
      }
    };

    fetchData();
  }, []);

  const clearAll = () => {
    setQ("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Association / Club Change History</h2>
          <Badge variant="secondary">{changes.length} of {changes.length}</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Filters</CardTitle>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 text-sm px-3 py-1.5 border rounded-md hover:bg-gray-50"
              title="Clear filters"
            >
              <XCircle className="w-4 h-4" />
              Clear
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  className="pl-10"
                  placeholder="Search code/name/type/status/userId…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <Select
                value={typeFilter}
                onValueChange={(v: "all" | "open" | "close") => setTypeFilter(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="close">Close</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(v: "all" | "approved" | "pending" | "rejected") =>
                  setStatusFilter(v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>#</Th>
                <Th>User</Th>
                <Th>Type</Th>
                <Th>Old Association</Th>
                <Th>Old Club</Th>
                <Th>Old Proof</Th>
                <Th>Resign Date</Th>
                <Th>New Association</Th>
                <Th>New Club</Th>
                <Th>New Proof</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Updated</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((r) => {
                const oldImg = buildImgSrc(imageBaseUrl, r.oldImage);
                const newImg = buildImgSrc(imageBaseUrl, r.newImage);
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td>{r.id}</Td>
                    <Td title={`User ID: ${r.userId}`}>{r.userId}</Td>
                    <Td><TypeBadge t={r.type} /></Td>

                    <Td>{label(r.oldAssCode, r.oldAssName)}</Td>
                    <Td>{label(r.oldClubCode, r.oldClubName)}</Td>
                    <Td>
                      {oldImg ? (
                        <a href={oldImg} target="_blank" rel="noreferrer">
                          <img
                            src={oldImg}
                            alt="old proof"
                            className="h-10 w-10 object-cover rounded border"
                          />
                        </a>
                      ) : (
                        "-"
                      )}
                    </Td>

                    <Td>{fmtDate(r.resignDate)}</Td>

                    <Td>{label(r.newAssCode, r.newAssName)}</Td>
                    <Td>{label(r.newClubCode, r.newClubName)}</Td>
                    <Td>
                      {newImg ? (
                        <a href={newImg} target="_blank" rel="noreferrer">
                          <img
                            src={newImg}
                            alt="new proof"
                            className="h-10 w-10 object-cover rounded border"
                          />
                        </a>
                      ) : (
                        "-"
                      )}
                    </Td>

                    <Td><StatusBadge s={r.status} /></Td>
                    <Td>{fmtDate(r.createdAt)}</Td>
                    <Td>{fmtDate(r.updatedAt)}</Td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={13}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Small helpers to keep JSX tidy
const Th: React.FC<React.PropsWithChildren> = ({ children }) => (
  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{children}</th>
);
const Td: React.FC<React.PropsWithChildren<{ title?: string }>> = ({ children, title }) => (
  <td className="px-4 py-3 whitespace-nowrap" title={title}>
    {children}
  </td>
);

export default AssClubChangeHistory;

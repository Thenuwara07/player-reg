import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw, ScrollText, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityLog, getActivityLogs } from "@/api/logsApi";

const PAGE_SIZE = 50;
const ALL_ROLES = "all";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  player: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  guest: "bg-gray-100 text-gray-700 hover:bg-gray-100",
};

const pad = (n: number) => String(n).padStart(2, "0");

// Local, readable date & time: 2026-10-02 01:26:45
const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// <input type="datetime-local"> value (local time) -> ISO for the API
const toIso = (localValue: string) =>
  localValue ? new Date(localValue).toISOString() : undefined;

const userName = (log: ActivityLog) =>
  log.user
    ? `${log.user.firstName} ${log.user.lastName}`.trim()
    : log.userId
    ? `Deleted user #${log.userId}`
    : "Unknown user";

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [role, setRole] = useState(ALL_ROLES);
  const [userInput, setUserInput] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Ignore responses from older requests when filters change quickly
  const requestId = useRef(0);

  // Debounce the user search so we don't query on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setUserSearch(userInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [userInput]);

  // Any filter change goes back to the first page
  useEffect(() => {
    setPage(1);
  }, [from, to, role, userSearch]);

  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    getActivityLogs({
      from: toIso(from),
      to: toIso(to),
      role: role === ALL_ROLES ? undefined : role,
      user: userSearch || undefined,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((res) => {
        if (id !== requestId.current) return;
        setLogs(res.data);
        setTotal(res.meta.total);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setError(err instanceof Error ? err.message : "Failed to load logs");
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, [from, to, role, userSearch, page, refreshKey]);

  const hasFilters = !!(from || to || userInput || role !== ALL_ROLES);
  const clearFilters = () => {
    setFrom("");
    setTo("");
    setRole(ALL_ROLES);
    setUserInput("");
    setUserSearch("");
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const firstRow = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="min-h-screen sports-gradient">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <ScrollText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-50">Activity Logs</h1>
              <p className="text-gray-200/80">
                All user and admin actions. Logs older than 1 month are
                deleted automatically.
              </p>
            </div>
          </div>
          <Button asChild variant="secondary">
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-xl mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="log-from">From (date &amp; time)</Label>
                <Input
                  id="log-from"
                  type="datetime-local"
                  step="1"
                  value={from}
                  max={to || undefined}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="log-to">To (date &amp; time)</Label>
                <Input
                  id="log-to"
                  type="datetime-local"
                  step="1"
                  value={to}
                  min={from || undefined}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="log-user">User</Label>
                <Input
                  id="log-user"
                  placeholder="Name, email or user ID"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger aria-label="Role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ROLES}>All roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
              <p className="text-sm text-muted-foreground">
                {loading
                  ? "Loading..."
                  : `Showing ${firstRow}–${lastRow} of ${total} logs`}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  disabled={!hasFilters}
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRefreshKey((k) => k + 1)}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs table */}
        <Card className="border-none shadow-xl">
          <CardContent className="p-0">
            {error ? (
              <p className="p-6 text-center text-red-600">{error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[190px]">Date &amp; Time</TableHead>
                    <TableHead className="w-[200px]">User</TableHead>
                    <TableHead className="w-[100px]">Role</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center">
                        <Loader2 className="w-6 h-6 animate-spin inline-block text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No logs found
                        {hasFilters ? " for these filters." : "."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow
                        key={log.id}
                        className={loading ? "opacity-60" : undefined}
                      >
                        <TableCell className="whitespace-nowrap">
                          <div className="font-medium">
                            {formatDateTime(log.createdAt)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {log.createdAt}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{userName(log)}</div>
                          {log.user?.email && (
                            <div className="text-xs text-muted-foreground">
                              {log.user.email}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={ROLE_STYLES[log.role] ?? ROLE_STYLES.guest}
                          >
                            {log.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.description}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-100">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;

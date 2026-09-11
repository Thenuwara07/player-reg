// src/pages/AllPosts.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Plus, User, CalendarDays, Search, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "../types/authTypes";
import { GetPosts, deletePost } from "@/api/postApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// shadcn alert dialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const IMG_URL =
  (import.meta.env.VITE_IMG_URL as string);

type AuthorPreview = {
  id: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  district?: string;
  profilePictureName?: string;
  role?: string;
  status?: string;
};

type PostRow = Post & { user?: AuthorPreview };

const formatDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const AllPosts: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentUserId = user?.id;
  const initialTab = (searchParams.get("tab") || "all") as "all" | "mine";
  const initialQ = searchParams.get("q") || "";

  const [tab, setTab] = useState<"all" | "mine">(initialTab);
  const [search, setSearch] = useState(initialQ);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null); // for dialog state

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // keep URL in sync (deep-link/back-forward)
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    if (search.trim()) next.set("q", search.trim());
    else next.delete("q");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search]);

  const fetchPosts = async () => {
    try {
      const serverPosts = await GetPosts(); // returns Post[] with nested user
      setPosts(serverPosts as PostRow[]);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      fetchPosts();
      toast.success("Post deleted.");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  const myPosts = useMemo(
    () => posts.filter((p) => String(p.userId) === String(currentUserId)),
    [posts, currentUserId]
  );

  const visible = useMemo(() => {
    const base = tab === "all" ? posts : myPosts;
    const q = search.trim().toLowerCase();
    if (!q) return base;

    const authorText = (p: PostRow) => {
      const full =
        p.user?.fullName ||
        [p.user?.firstName, p.user?.lastName].filter(Boolean).join(" ").trim();
      return (full || String(p.userId)).toLowerCase();
    };

    return base.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(q);
      const inSubtitle = (p.subtitle || "").toLowerCase().includes(q);
      const inContent = p.content.toLowerCase().includes(q);
      const inAuthor = authorText(p).includes(q);
      return inTitle || inSubtitle || inContent || inAuthor;
    });
  }, [tab, search, posts, myPosts]);

  return (
    <div className="min-h-screen sports-gradient">
      <div className="container mx-auto px-4 py-12">
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-50">Posts</h2>
            <Badge variant="secondary">{visible.length} shown</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="pl-9"
              />
            </div>
            <Link to="/posts/new" className="no-underline">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "all" | "mine")}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="all" aria-label="All posts">
              All Posts
            </TabsTrigger>
            <TabsTrigger value="mine" aria-label="My posts">
              My Posts
            </TabsTrigger>
          </TabsList>

          {/* Grid of cards */}
          <TabsContent value="all">
            <PostGrid
              items={visible}
              currentUserId={String(currentUserId)}
              onDelete={(id) => setDeletingId(id)}
            />
          </TabsContent>

          <TabsContent value="mine">
            <PostGrid
              items={visible}
              currentUserId={String(currentUserId)}
              emptyHint="You haven’t created any posts yet."
              onDelete={(id) => setDeletingId(id)}
            />
          </TabsContent>
        </Tabs>

        {/* Empty state when no results at all */}
        {visible.length === 0 && (
          <Card className="mt-10">
            <CardContent className="p-8 text-center text-gray-500">
              No posts found. Try a different search.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingId !== null && handleDelete(deletingId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

/** Extracted grid for reuse across tabs */
const PostGrid: React.FC<{
  items: PostRow[];
  currentUserId: string;
  emptyHint?: string;
  onDelete: (id: number) => void;
}> = ({ items, currentUserId, emptyHint, onDelete }) => {
  if (items.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-8 text-center text-gray-500">
          {emptyHint ?? "Nothing here yet."}
        </CardContent>
      </Card>
    );
  }

  const resolveImg = (name: string) =>
    name?.startsWith("http") ? name : `${IMG_URL}/${name}`;

  const authorName = (p: PostRow) =>
    p.user?.fullName ||
    [p.user?.firstName, p.user?.lastName].filter(Boolean).join(" ").trim() ||
    `ID #${p.userId}`;

  const authorAvatar = (p: PostRow) =>
    p.user?.profilePictureName ? `${IMG_URL}/${p.user.profilePictureName}` : "";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((p) => {
        const canEdit = String(p.userId) === String(currentUserId);
        return (
          <Card
            key={p.id}
            className="overflow-hidden hover:shadow-lg transition"
          >
            {p.imageName && (
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={resolveImg(p.imageName)}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex items-start gap-3">
                {authorAvatar(p) ? (
                  // <img
                  //   src={authorAvatar(p)}
                  //   alt={authorName(p)}
                  //   className="w-9 h-9 rounded-full object-cover border"
                  //   loading="lazy"
                  // />
                  <p />
                ) : (
                  // <div className="w-9 h-9 rounded-full border flex items-center justify-center">
                  //   <User className="w-4 h-4 text-muted-foreground" />
                  // </div>
                  <p />
                )}
                <div>
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                  {p.subtitle && (
                    <CardDescription className="mt-1">
                      {p.subtitle}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="inline-flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {authorName(p)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(p.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-6">
                {p.content.length > 180
                  ? p.content.slice(0, 180) + "…"
                  : p.content}
              </p>
            </CardContent>

            {canEdit && (
              <div className="flex items-center justify-between gap-2 m-4">
                {/* Delete (opens confirm dialog from parent) */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => onDelete(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>

                <Link
                  to="/posts/new"
                  state={{ mode: "edit", post: p }}
                  className="no-underline"
                >
                  <Button variant="outline" size="sm" className="gap-1">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default AllPosts;

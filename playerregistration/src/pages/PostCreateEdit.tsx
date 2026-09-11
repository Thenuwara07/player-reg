
// src/pages/PostCreateEdit.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { imageUpload } from "@/api/fileApi";
import { createPost, updatePost } from "@/api/postApi";
import { useAuth } from "@/contexts/AuthContext";

const API_URL =
  (import.meta.env.VITE_API_URL as string);

type PostEditable = {
  id?: number;
  title: string;
  subtitle?: string;
  content: string;
  userId: number;
  createdAt: string; // YYYY-MM-DD (for input)
  imageName: string; // server filename OR data URL (preview only)
};

const MAX_IMG_BYTES = 4 * 1024 * 1024; // 4MB

const PostCreateEdit: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { mode?: "edit"; post?: any } };

  const mode: "create" | "edit" =
    location?.state?.mode === "edit" ? "edit" : "create";
  const editingPost = location?.state?.post;

  // Normalize incoming date (works even if it's an ISO string with time)
  const normalizedEditDate =
    editingPost?.createdAt
      ? new Date(editingPost.createdAt).toISOString().slice(0, 10)
      : undefined;

  // form state
  const [title, setTitle] = useState<string>(editingPost?.title ?? "");
  const [subtitle, setSubtitle] = useState<string>(editingPost?.subtitle ?? "");
  const [content, setContent] = useState<string>(editingPost?.content ?? "");
  const [userId, setUserId] = useState<number>(
    editingPost?.userId ?? user?.id ?? 0
  );
  const [createdAt, setCreatedAt] = useState<string>(
    normalizedEditDate ?? new Date().toISOString().slice(0, 10)
  );

  // image state
  const [imageName, setImageName] = useState<string>(
    editingPost?.imageName ?? ""
  ); // this can be a filename (from server) or a dataURL (preview)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagefileName, setimagefileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && !editingPost) {
      navigate("/allPosts", { replace: true });
    }
  }, [mode, editingPost, navigate]);

  const canSave = useMemo(
    () => Boolean(title.trim() && content.trim() && userId),
    [title, content, userId]
  );

  // Build preview URL: if we only have a filename, prefix with API_URL.
  const previewSrc = useMemo(() => {
    if (!imageName) return "";
    if (imageName.startsWith("data:") || imageName.startsWith("http")) {
      return imageName;
    }
    return `${API_URL}/${imageName}`;
  }, [imageName]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > MAX_IMG_BYTES) {
      setUploadError("Image is too large (max 4 MB). Please choose a smaller file.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImageName(dataUrl);    // show preview immediately
        setimagefileName(file.name);
        setImageFile(file);       // upload this on submit
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadError("Failed to read the image. Please try again.");
    }
  };

  const clearImage = () => {
    setImageName("");
    setimagefileName("");
    setImageFile(null);
    setUploadError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    try {
      // keep old filename unless replaced
      let finalImageName = editingPost?.imageName || "";

      // If a new file is selected, upload and replace the filename
      if (imageFile) {
        const uploaded = await imageUpload(imageFile);
        // IMPORTANT: your upload API returns { filename }, not { fileName }
        finalImageName = uploaded;
      } else if (mode === "create") {
        // On create we need an image
        if (!finalImageName) {
          toast.error("Please upload a cover image.");
          return;
        }
      }

      const payload: PostEditable = {
        id: editingPost?.id,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        content: content.trim(),
        imageName: finalImageName, // store filename
        userId: Number(userId),
        createdAt,                 // "YYYY-MM-DD"
      };

      if (mode === "edit") {
        console.log("Updating post:", payload);
        // Send only fields that may change; let Prisma set updatedAt
        await updatePost({
          id: payload.id!,
          title: payload.title,
          subtitle: payload.subtitle,
          content: payload.content,
          imageName: payload.imageName,
          // If you want to allow changing createdAt on edit, uncomment:
          // createdAt: new Date(createdAt),
        });
        toast.success("Post updated.");
      } else {
        // Backend expects Date for createdAt; convert
        await createPost({
          title: payload.title,
          subtitle: payload.subtitle,
          content: payload.content,
          imageName: payload.imageName,
          userId: payload.userId,
          createdAt: new Date(createdAt),
        });
        toast.success("Post created.");
      }

      navigate("/allPosts");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save post.");
    }
  };

  const pageTitle = mode === "edit" ? "Edit Post" : "Create New Post";
  const submitLabel = mode === "edit" ? "Update Post" : "Save Post";

  return (
    <div className="min-h-screen sports-gradient">
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{pageTitle}</CardTitle>
            <Link to="/allPosts" className="no-underline">
              <Button variant="outline">Back</Button>
            </Link>
          </CardHeader>

          <CardContent>
            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* LEFT: Image area */}
              <div className="lg:col-span-2">
                <div className="relative rounded-md border overflow-hidden min-h-[520px] bg-muted">
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
                      <ImageIcon className="w-10 h-10 opacity-70" />
                      <p className="text-sm">No image selected</p>
                      <p className="text-xs">Choose a file to upload</p>
                    </div>
                  )}

                  {/* Top overlay */}
                  <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between gap-3 bg-background/60 backdrop-blur-sm">
                    <div className="inline-flex rounded-md border bg-muted p-1">
                      <Button type="button" size="sm" className="gap-1" disabled>
                        <Upload className="w-4 h-4" />
                        Upload
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {imageName && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearImage}
                          className="gap-1"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                          Clear
                        </Button>
                      )}

                      <label
                        htmlFor="post-image"
                        className="inline-flex items-center px-3 py-2 rounded-md border cursor-pointer text-sm bg-background"
                        title="Choose image file"
                      >
                        Choose file
                      </label>
                      <Input
                        id="post-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-background/60 backdrop-blur-sm">
                    <p className="text-xs text-muted-foreground truncate">
                      {imagefileName ? `Selected: ${imagefileName}` : "No file selected"}
                    </p>
                    {uploadError && (
                      <p className="text-xs text-red-600">{uploadError}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      JPEG/PNG/WebP up to 4&nbsp;MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT: Form fields */}
              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Post title"
                      required
                    />
                  </div>

                  {/* Subtitle (optional) */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Subtitle <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <Input
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Short tagline for this post"
                    />
                  </div>

                  {/* Author + Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* <div>
                      <label className="block mb-2 text-sm font-medium">
                        Author ID
                      </label>
                      <Input
                        value={userId}
                        onChange={(e) => setUserId(Number(e.target.value))}
                        placeholder="e.g., 2"
                        required
                      />
                    </div> */}

                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={createdAt}
                        onChange={(e) => setCreatedAt(e.target.value)}
                        required
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">Content</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your post content…"
                      className="w-full min-h-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={!canSave}>
                      {submitLabel}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostCreateEdit;

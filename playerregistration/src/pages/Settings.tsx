// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "sonner";
// import {
//   Save,
//   Loader2,
//   Upload,
//   ImageIcon,
//   Settings as SettingsIcon,
// } from "lucide-react";
// import { GetdeafaultDetails } from "@/api/postApi";
// import { updateDetails } from "@/api/detailsApi";
// import type { DefaultDetails } from "@/types/authTypes";
// import { imageUpload } from "@/api/fileApi";
// import { useAuth } from "@/contexts/AuthContext"; // Assuming you have this context

// // --- Types ---
// type SettingsData = {
//   id: number;
//   herotitle: string;
//   herosubtitle: string;
//   imageName: string;
//   openclubchangeperiodMonths: number;
//   userId?: number;
//   updatedAt?: string;
// };

// const MAX_IMG_BYTES = 4 * 1024 * 1024;

// const mockUpdateSettings = async (data: FormData): Promise<any> => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return { success: true };
// };

// const IMG_URL =
//   (import.meta.env.VITE_IMG_URL as string) || "http://localhost:5000/uploads";

// const SettingsPage: React.FC = () => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState<DefaultDetails | null>(null);

//   // To handle file upload preview
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadError, setUploadError] = useState<string | null>(null);
//   const [userId, setUserId] = useState<number>(
//     // Convert to Number, default to 0 (or -1) if user.id is missing/invalid
//     Number(user?.id) || 0,
//   );

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       // TODO: Replace with real API call: const data = await getSettings();
//       const data = await GetdeafaultDetails();
//       if (Array.isArray(data) && data.length > 0) {
//         setFormData(data[0]);
//       } else if (!Array.isArray(data)) {
//         // If it's already an object (just in case API changes)
//         setFormData(data as DefaultDetails);
//       }

//       // Set initial preview if imageName exists
//       if (data.imageName) {
//         const url = data.imageName.startsWith("http")
//           ? data.imageName
//           : `${IMG_URL}/${data.imageName}`;
//         setPreviewUrl(url);
//       }
//     } catch (error) {
//       console.error("Failed to load settings", error);
//       toast.error("Failed to load settings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!formData) return;
//     const { name, value } = e.target;
//     setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (!file) return;

//       if (!file.type.startsWith("image/")) {
//         setUploadError("Please select an image file.");
//         return;
//       }
//       if (file.size > MAX_IMG_BYTES) {
//         setUploadError(
//           "Image is too large (max 4 MB). Please choose a smaller file.",
//         );
//         return;
//       }
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file)); // Create local preview
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData) return;

//     try {
//       setSaving(true);

//       // Prepare FormData for file upload support
//       const submitData = new FormData();
//       submitData.append("userid", String(formData.id));
//       submitData.append("herotitle", formData.herotitle);
//       submitData.append("herosubtitle", formData.herosubtitle);
//       submitData.append(
//         "openclubchangeperiodMonths",
//         String(formData.openclubchangeperiodMonths),
//       );
//       let finalImageName = formData?.imageName || "";
//       if (selectedFile) {
//         const uploaded = await imageUpload(selectedFile);
//         finalImageName = uploaded;
//       }
      
//       const payload = new DefaultDetails({
//         herotitle: formData.herotitle,
//         herosubtitle: formData?.herosubtitle,
//         imageName: finalImageName,
//         openclubchangeperiodMonths: formData.openclubchangeperiodMonths,
//         // Fix: Convert to Number if DefaultDetails expects a number
//         userId: Number(userId) || 0,
//       });

//       // TODO: Replace with real API call: await updateSettings(submitData);
//       const res = await updateDetails(payload);

//       toast.success("Settings updated successfully!");
//     } catch (error) {
//       console.error("Error saving settings:", error);
//       toast.error("Failed to save settings.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen sports-gradient flex items-center justify-center">
//         <div className="flex flex-col items-center gap-2 text-white">
//           <Loader2 className="h-8 w-8 animate-spin" />
//           <p>Loading settings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen sports-gradient">
//       <div className="container mx-auto px-4 py-12 max-w-4xl">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-8">
//           <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
//             <SettingsIcon className="w-8 h-8 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-50">
//               Platform Settings
//             </h1>
//             <p className="text-gray-200/80">
//               Manage global configurations and hero content.
//             </p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-6">
//             {/* 1. Hero Configuration Card */}
//             <Card className="border-none shadow-xl">
//               <CardHeader>
//                 <CardTitle>Hero Section</CardTitle>
//                 <CardDescription>
//                   Customize the landing page title and messaging.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="herotitle">Main Title</Label>
//                   <Input
//                     id="herotitle"
//                     name="herotitle"
//                     placeholder="Enter main heading..."
//                     value={formData?.herotitle || ""}
//                     onChange={handleInputChange}
//                     className="font-medium text-lg"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="herosubtitle">Subtitle / Description</Label>
//                   <Input
//                     id="herosubtitle"
//                     name="herosubtitle"
//                     placeholder="Enter subtitle..."
//                     value={formData?.herosubtitle || ""}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 {/* Image Upload Area */}
//                 <div className="space-y-2">
//                   <Label>Hero Banner Image</Label>
//                   <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition">
//                     {previewUrl ? (
//                       <div className="relative w-full aspect-[21/9] rounded-md overflow-hidden shadow-sm">
//                         <img
//                           src={previewUrl}
//                           alt="Hero Preview"
//                           className="w-full h-full object-cover"
//                         />
//                         {/* Overlay to indicate change capability */}
//                         <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition flex items-center justify-center group">
//                           <p className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium pointer-events-none">
//                             Change Image
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center text-muted-foreground">
//                         <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
//                         <p>No image set</p>
//                       </div>
//                     )}

//                     <div className="relative">
//                       <Input
//                         id="imageUpload"
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleFileChange}
//                       />
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="gap-2 cursor-pointer"
//                         asChild
//                       >
//                         <label htmlFor="imageUpload">
//                           <Upload className="w-4 h-4" />
//                           {previewUrl ? "Replace Image" : "Upload Image"}
//                         </label>
//                       </Button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Recommended size: 1920x600px (JPG, PNG)
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* 2. System Configuration Card */}
//             <Card className="border-none shadow-xl">
//               <CardHeader>
//                 <CardTitle>System Configuration</CardTitle>
//                 <CardDescription>
//                   Manage global rules and constraints.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid sm:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="openclubchangeperiodMonths">
//                       Club Change Period (Months)
//                     </Label>
//                     <div className="relative">
//                       <Input
//                         id="openclubchangeperiodMonths"
//                         name="openclubchangeperiodMonths"
//                         type="number"
//                         min="1"
//                         max="24"
//                         value={formData?.openclubchangeperiodMonths || 0}
//                         onChange={handleInputChange}
//                         className="pl-4"
//                       />
//                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
//                         months
//                       </span>
//                     </div>
//                     <p className="text-[0.8rem] text-muted-foreground">
//                       The duration a player must wait before changing clubs
//                       again.
//                     </p>
//                   </div>

//                   {/* You can add more settings fields here in the grid */}
//                 </div>
//               </CardContent>

//               <Separator className="mb-4" />

//               <CardFooter className="flex justify-between items-center bg-gray-50/50 py-4">
//                 <div className="text-xs text-muted-foreground">
//                   Last updated:{" "}
//                   {formData?.updatedAt
//                     ? new Date(formData.updatedAt).toLocaleDateString()
//                     : "Never"}
//                 </div>
//                 <Button
//                   type="submit"
//                   disabled={saving}
//                   className="w-full sm:w-auto gap-2"
//                 >
//                   {saving ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4" />
//                       Save Changes
//                     </>
//                   )}
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;





import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Upload,
  ImageIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { GetdeafaultDetails } from "@/api/postApi";
import { updateDetails } from "@/api/detailsApi";
import type { DefaultDetails } from "@/types/authTypes";
import { imageUpload } from "@/api/fileApi";
import { useAuth } from "@/contexts/AuthContext";

const MAX_IMG_BYTES = 4 * 1024 * 1024; // 4MB
const IMG_URL = (import.meta.env.VITE_IMG_URL as string) || "http://localhost:5000/uploads";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<DefaultDetails | null>(null);

  // File Upload State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fix 1: Ensure userId is strictly a number, defaulting to 0 if undefined
  // const [userId] = useState<number>(
  //   user?.id ?? Number(user.id) ?? 0
  // );
  const userId = user?.id;
  console.log("1ppp",userId);

  useEffect(() => {
    fetchSettings();
  }, []);

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
        // Set initial preview if imageName exists
        if (initialData.imageName) {
          const url = initialData.imageName.startsWith("http")
            ? initialData.imageName
            : `${IMG_URL}/${initialData.imageName}`;
          setPreviewUrl(url);
        }
      }
    } catch (error) {
      console.error("Failed to load settings", error);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;

    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        // Fix 3: If the input type is number, parse it. Otherwise use the string value.
        [name]: type === "number" ? Number(value) : value,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null); // Reset error
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file.");
        return;
      }
      if (file.size > MAX_IMG_BYTES) {
        setUploadError("Image is too large (max 4 MB). Please choose a smaller file.");
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setSaving(true);

      // 1. Handle Image Upload if a file is selected
      let finalImageName = formData.imageName || "";
      if (selectedFile) {
        try {
            const uploaded = await imageUpload(selectedFile);
            finalImageName = uploaded;
        } catch (uploadErr) {
            console.error("Image upload failed", uploadErr);
            toast.error("Failed to upload image. Saving canceled.");
            setSaving(false);
            return;
        }
      }

      // Fix 2: Create a plain object payload instead of 'new DefaultDetails'
      // Since DefaultDetails is imported as a 'type', it cannot be instantiated with 'new'.
      const payload: DefaultDetails = {
        ...formData, // Spread existing form data to keep ID and other fields
        herotitle: formData.herotitle,
        herosubtitle: formData.herosubtitle,
        imageName: finalImageName,
        openclubchangeperiodMonths: Number(formData.openclubchangeperiodMonths),
        userId: userId, // Uses the number state we fixed earlier
      };
      console.log("data",payload);

      // 2. Update Details
      await updateDetails(payload);

      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen sports-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sports-gradient">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-50">
              Platform Settings
            </h1>
            <p className="text-gray-200/80">
              Manage global configurations and hero content.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* 1. Hero Configuration Card */}
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  Customize the landing page title and messaging.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="herotitle">Main Title</Label>
                  <Input
                    id="herotitle"
                    name="herotitle"
                    placeholder="Enter main heading..."
                    value={formData?.herotitle || ""}
                    onChange={handleInputChange}
                    className="font-medium text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="herosubtitle">Subtitle / Description</Label>
                  <Input
                    id="herosubtitle"
                    name="herosubtitle"
                    placeholder="Enter subtitle..."
                    value={formData?.herosubtitle || ""}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Image Upload Area */}
                <div className="space-y-2">
                  <Label>Hero Banner Image</Label>
                  <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 transition ${uploadError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}>
                    {previewUrl ? (
                      <div className="relative w-full aspect-[21/9] rounded-md overflow-hidden shadow-sm">
                        <img
                          src={previewUrl}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay to indicate change capability */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition flex items-center justify-center group pointer-events-none">
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No image set</p>
                      </div>
                    )}

                    <div className="relative">
                      <Input
                        id="imageUpload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 cursor-pointer"
                        asChild
                      >
                        <label htmlFor="imageUpload">
                          <Upload className="w-4 h-4" />
                          {previewUrl ? "Replace Image" : "Upload Image"}
                        </label>
                      </Button>
                    </div>
                    {uploadError && (
                        <p className="text-sm text-red-500 font-medium">{uploadError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1920x600px (JPG, PNG)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. System Configuration Card */}
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Manage global rules and constraints.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="openclubchangeperiodMonths">
                      Club Change Period (Months)
                    </Label>
                    <div className="relative">
                      <Input
                        id="openclubchangeperiodMonths"
                        name="openclubchangeperiodMonths"
                        type="number"
                        min="1"
                        max="24"
                        value={formData?.openclubchangeperiodMonths || 0}
                        onChange={handleInputChange}
                        className="pl-4"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        months
                      </span>
                    </div>
                    <p className="text-[0.8rem] text-muted-foreground">
                      The duration a player must wait before changing clubs again.
                    </p>
                  </div>
                </div>
              </CardContent>

              <Separator className="mb-4" />

              <CardFooter className="flex justify-between items-center bg-gray-50/50 py-4">
                <div className="text-xs text-muted-foreground">
                  Last updated:{" "}
                  {formData?.updatedAt
                    ? new Date(formData.updatedAt).toLocaleDateString()
                    : "Never"}
                </div>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
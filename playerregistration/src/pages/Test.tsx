import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { imageUpload } from "../api/fileApi";
import { saveFileLocally } from "../api/fileApi";
import { set } from "date-fns";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    district: "",
    idCardNumber: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    profilePictureName: "",
    weight: "",
    height: "",
    role: "player",
    idType: "nic",
    idFrontImageName: "",
    idBackImageName: "",
  });

  const [previews, setPreviews] = useState({
    front: "",
    back: "",
    profile: "",
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      district: "",
      idCardNumber: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
      profilePictureName: "",
      weight: "",
      height: "",
      role: "",
      idType: "nic",
      idFrontImageName: "",
      idBackImageName: "",
    });
    setPreviews({ front: "", back: "", profile: "" });
    if (frontFileRef.current) frontFileRef.current.value = "";
    if (backFileRef.current) backFileRef.current.value = "";
    if (profileFileRef.current) profileFileRef.current.value = "";
  };

  const [isLoading, setIsLoading] = useState(false);
  const frontFileRef = useRef<HTMLInputElement>(null);
  const backFileRef = useRef<HTMLInputElement>(null);
  const profileFileRef = useRef<HTMLInputElement>(null);
  // const [profilefile, setProfileFile] = useState(null);
  // const [frontfile, setFrontFile] = useState(null);
  // const [backfile, setBackFile] = useState(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const navigate = useNavigate();

  let tempProfileName: string | null = null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (
    type: "front" | "back" | "profile",
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
      if (type === "profile") {
        // handleInputChange("profilePictureName", filename);
        setProfileFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!formData.profilePictureName) {
    //   toast.error("Please upload a profile picture");
    //   return;
    // }

    setIsLoading(true);

    try {
      const result = await imageUpload(profileFile);
      if (result) {
        tempProfileName = result;

        // If you're maintaining formData state, update it properly
        handleInputChange("profilePictureName", tempProfileName);
        console.log("Profile picture uploaded1111:", formData.profilePictureName);

        // Optionally, set it to a local state too
        // setProfileName(tempProfileName);

        await setFormData({
          ...formData,
          profilePictureName: tempProfileName,
        });
        console.log("Profile picture uploaded2222:", formData.profilePictureName);
      } else {
        console.error("Image upload failed or returned no filename.");
      }

      console.log("tempProfileName0000:", tempProfileName);

      if (result.filename) {
        resetForm();
        toast.success("Registration successful!");
      } else {
        toast.error("Registration failed. Please try again.");
      }
      console.log("Form Data:", formData);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
    } finally {
      console.log("Form Data:", formData);
      console.log("Previews:", previews);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen sports-gradient py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-center">
              Join our sports platform community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Profile Picture
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {previews.profile ? (
                      <img
                        src={previews.profile}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={profileFileRef}
                      onChange={(e) => handleFileChange("profile", e)}
                      // onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept="image/*"
                      className="hidden"
                      id="profilePicture"
                    />
                    <Label htmlFor="profilePicture" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => profileFileRef.current?.click()}
                      >
                        {previews.profile ? "Change Image" : "Upload Image"}
                      </Button>
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 200x200 pixels, Max 2MB
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;

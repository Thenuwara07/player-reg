// import React, { useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { toast } from "sonner";
// import { registerUser } from "../api/authApi";
// import { imageUpload, saveFileLocally } from "../api/fileApi";
// import { set } from "date-fns";

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     firstName: "",
//     lastName: "",
//     dateOfBirth: "",
//     gender: "",
//     district: "",
//     idCardNumber: "",
//     email: "",
//     contactNumber: "",
//     password: "",
//     confirmPassword: "",
//     profilePictureName: "",
//     weight: "",
//     height: "",
//     role: "player",
//     idType: "nic",
//     idFrontImageName: "",
//     idBackImageName: "",
//   });

//   const [previews, setPreviews] = useState({
//     front: "",
//     back: "",
//     profile: "",
//   });

//   const [img, setImg] = useState({
//     front: "",
//     back: "",
//     profile: "",
//   });

//   const resetForm = () => {
//     setFormData({
//       fullName: "",
//       firstName: "",
//       lastName: "",
//       dateOfBirth: "",
//       gender: "",
//       district: "",
//       idCardNumber: "",
//       email: "",
//       contactNumber: "",
//       password: "",
//       confirmPassword: "",
//       profilePictureName: "",
//       weight: "",
//       height: "",
//       role: "",
//       idType: "nic",
//       idFrontImageName: "",
//       idBackImageName: "",
//     });
//     setPreviews({ front: "", back: "", profile: "" });
//     if (frontFileRef.current) frontFileRef.current.value = "";
//     if (backFileRef.current) backFileRef.current.value = "";
//     if (profileFileRef.current) profileFileRef.current.value = "";
//   };

//   const [isLoading, setIsLoading] = useState(false);
//   const frontFileRef = useRef<HTMLInputElement>(null);
//   const backFileRef = useRef<HTMLInputElement>(null);
//   const profileFileRef = useRef<HTMLInputElement>(null);
//   // const [profilefile, setProfileFile] = useState(null);
//   // const [frontfile, setFrontFile] = useState(null);
//   // const [backfile, setBackFile] = useState(null);
//   const [profileFile, setProfileFile] = useState<File | null>(null);
//   const [frontFile, setFrontFile] = useState<File | null>(null);
//   const [backFile, setBackFile] = useState<File | null>(null);
//   const [profilename, setProfileName] = useState(null);
//   const [frontname, setFrontName] = useState(null);
//   const [backname, setBackName] = useState(null);
//   const navigate = useNavigate();

//   const districts = [
//     "Ampara",
//     "Anuradhapura",
//     "Badulla",
//     "Batticaloa",
//     "Colombo",
//     "Galle",
//     "Gampaha",
//     "Hambantota",
//     "Jaffna",
//     "Kalutara",
//     "Kandy",
//     "Kegalle",
//     "Kilinochchi",
//     "Kurunegala",
//     "Mannar",
//     "Matale",
//     "Matara",
//     "Monaragala",
//     "Mullaitivu",
//     "Nuwara Eliya",
//     "Polonnaruwa",
//     "Puttalam",
//     "Ratnapura",
//     "Trincomalee",
//     "Vavuniya",
//   ];
//   const idTypes = [
//     { value: "nic", label: "National Identity Card (NIC)" },
//     { value: "passport", label: "Passport" },
//     { value: "license", label: "Driver's License" },
//     { value: "schoolletter", label: "School Letter" },
//   ];
//   const gengerTypes = [
//     { value: "Male", label: "Male" },
//     { value: "Female", label: "Female" },
//   ];

//   let tempFrontName: string | null = null;
//   let tempBackName: string | null = null;
//   let tempProfileName: string | null = null;

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleImageChange = (
//     type: "front" | "back" | "profile",
//     value: string
//   ) => {
//     setImg((prev) => ({ ...prev, [type]: value }));
//   };

//   const handleFileChange = async (
//     type: "front" | "back" | "profile",
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.match("image.*")) {
//         toast.error("Please select an image file (JPEG, PNG)");
//         return;
//       }
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error("File size should be less than 2MB");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
//       };
//       reader.readAsDataURL(file);

//       const filename = await saveFileLocally(file);
//       if (type === "profile") {
//         handleInputChange("profilePictureName", filename);
//         setProfileFile(file);
//       } else if (type === "front") {
//         handleInputChange("idFrontImageName", filename);
//         setFrontFile(file);
//       } else {
//         handleInputChange("idBackImageName", filename);
//         setBackFile(file);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.idFrontImageName || !formData.idBackImageName) {
//       toast.error("Please upload both sides of your ID document");
//       return;
//     }

//     if (!formData.profilePictureName) {
//       toast.error("Please upload a profile picture");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters long");
//       return;
//     }

//     if (formData.idType !== "schoolletter") {
//       if (!formData.idCardNumber) {
//         toast.error("Please enter your ID Card Number");
//         return;
//       }
//     }

//     setIsLoading(true);

//     try {
//       try {
//         const fontImg = await imageUpload(frontFile);
//         tempFrontName = fontImg.filename;
//         console.log("tempFrontName1:", tempFrontName);

//         const backImg = await imageUpload(backFile);
//         tempBackName = backImg.filename;
//         console.log("tempBackName1:", tempBackName);

//         if (profileFile) {
//           const profileImg = await imageUpload(profileFile);
//           tempProfileName = profileImg.filename;
//           console.log("tempProfileName1:", tempProfileName);
//         }
//       } catch (error) {
//         toast.error(
//           error instanceof Error
//             ? error.message
//             : "An error occurred. Please try again."
//         );
//       }

//       console.log("Nutsss:", formData);

//       const result = await registerUser(
//         formData,
//         tempFrontName,
//         tempBackName,
//         tempProfileName
//       );
//       console.log("Registration result:", result);

//       if (result.success) {
//         resetForm();
//         navigate("/signin");
//       } else {
//         toast.error(result.message || "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "An error occurred. Please try again."
//       );
//     } finally {
//       console.log("Form Data:", formData);
//       console.log("Previews:", previews);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen sports-gradient py-12 px-4">
//       <div className="container mx-auto max-w-8xl">
//         <Card className="">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">
//               Create Account
//             </CardTitle>
//             {/* <CardDescription className="text-center">
//               Join our sports platform community
//             </CardDescription> */}
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="flex">
//                 <div className="w-1/2 mr-6">
//                   {/* Profile Picture Upload */}
//                   <div className="space-y-2">
//                    <h3 className="text-xl font-semibold text-gray-800">
//                       Personal Information
//                     </h3>
//                     <div className="flex items-center gap-4">
//                       <div className="relative">
//                         {previews.profile ? (
//                           <img
//                             src={previews.profile}
//                             alt="Profile preview"
//                             className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
//                           />
//                         ) : (
//                           <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
//                             <span className="text-gray-500">No image</span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1">
//                         <input
//                           type="file"
//                           ref={profileFileRef}
//                           onChange={(e) => handleFileChange("profile", e)}
//                           // onChange={(e) => setFile(e.target.files?.[0] || null)}
//                           accept="image/*"
//                           className="hidden"
//                           id="profilePicture"
//                         />
//                         <Label
//                           htmlFor="profilePicture"
//                           className="cursor-pointer"
//                         >
//                           <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => profileFileRef.current?.click()}
//                           >
//                             {previews.profile ? "Change Image" : "Upload Image"}
//                           </Button>
//                         </Label>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Recommended size: 200x200 pixels, Max 2MB
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Personal Information */}
//                   <div className="space-y-2 mt-2">
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="fullName">Full Name</Label>
//                         <Input
//                           id="fullName"
//                           placeholder="Enter full name"
//                           value={formData.fullName}
//                           onChange={(e) =>
//                             handleInputChange("fullName", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="firstName">First Name</Label>
//                         <Input
//                           id="firstName"
//                           placeholder="Enter first name"
//                           value={formData.firstName}
//                           onChange={(e) =>
//                             handleInputChange("firstName", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="lastName">Last Name</Label>
//                         <Input
//                           id="lastName"
//                           placeholder="Enter last name"
//                           value={formData.lastName}
//                           onChange={(e) =>
//                             handleInputChange("lastName", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="space-y-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="gengerTypes">Gender</Label>
//                           <Select
//                             value={formData.gender}
//                             onValueChange={(value) =>
//                               handleInputChange("gender", value)
//                             }
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select gender" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {gengerTypes.map((type) => (
//                                 <SelectItem key={type.value} value={type.value}>
//                                   {type.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="dateOfBirth">Date of Birth</Label>
//                         <Input
//                           id="dateOfBirth"
//                           type="date"
//                           value={formData.dateOfBirth}
//                           onChange={(e) =>
//                             handleInputChange("dateOfBirth", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="district">District</Label>
//                         <Select
//                           value={formData.district}
//                           onValueChange={(value) =>
//                             handleInputChange("district", value)
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select district" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {districts.map((district) => (
//                               <SelectItem key={district} value={district}>
//                                 {district}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="weight">Weight (kg)</Label>
//                         <Input
//                           id="weight"
//                           type="number"
//                           placeholder="Enter weight"
//                           value={formData.weight}
//                           onChange={(e) =>
//                             handleInputChange("weight", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="height">Height (cm)</Label>
//                         <Input
//                           id="height"
//                           type="number"
//                           placeholder="Enter height"
//                           value={formData.height}
//                           onChange={(e) =>
//                             handleInputChange("height", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="w-1/2">
//                   {/* Contact & Identification */}
//                   <div className="space-y-4">
//                     <h3 className="text-xl font-semibold text-gray-800">
//                       Contact & Identification
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="idCardNumber">NIC Number</Label>
//                         <Input
//                           id="idCardNumber"
//                           placeholder="Enter ID card number"
//                           value={formData.idCardNumber}
//                           onChange={(e) =>
//                             handleInputChange("idCardNumber", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="email">Email</Label>
//                         <Input
//                           id="email"
//                           type="email"
//                           placeholder="Enter email address"
//                           value={formData.email}
//                           onChange={(e) =>
//                             handleInputChange("email", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="contactNumber">Contact Number</Label>
//                         <Input
//                           id="contactNumber"
//                           placeholder="Enter phone number"
//                           value={formData.contactNumber}
//                           onChange={(e) =>
//                             handleInputChange("contactNumber", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Password */}
//                   <div className="space-y-4 mt-6">
//                     <h3 className="text-xl font-semibold text-gray-800">
//                       Account Security
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="password">Password</Label>
//                         <Input
//                           id="password"
//                           type="password"
//                           placeholder="Enter password"
//                           value={formData.password}
//                           onChange={(e) =>
//                             handleInputChange("password", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="confirmPassword">
//                           Confirm Password
//                         </Label>
//                         <Input
//                           id="confirmPassword"
//                           type="password"
//                           placeholder="Confirm password"
//                           value={formData.confirmPassword}
//                           onChange={(e) =>
//                             handleInputChange("confirmPassword", e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <section
//                 id="document-submission"
//                 className="p-6 bg-gray-50 rounded-lg border border-red-800"
//               >
//                 <p className="text-gray-700 mb-4">
//                   🔴If you do not have a National Identity Card (NIC), Passport,
//                   or Driver's License, please upload a{" "}
//                   <strong className="font-semibold">
//                     letter from your school
//                   </strong>{" "}
//                   certified by the{" "}
//                   <strong className="font-semibold">Principal</strong> or{" "}
//                   <strong className="font-semibold">Vice Principal</strong>.🔴
//                 </p>
//                 <p className="text-gray-700 mb-4">
//                   The letter should include the following details:
//                 </p>
//                 <ul className="list-disc pl-6 text-gray-700 mb-4">
//                   <li>School letterhead</li>
//                   <li>Full name as per the Birth Certificate</li>
//                   <li>Address</li>
//                   <li>Date of birth</li>
//                   <li>District</li>
//                   <li>Student verification from the school</li>
//                 </ul>
//                 <p className="text-gray-700 font-semibold">
//                   <strong>
//                     Please choose "School Letter" as the document type when
//                     uploading.
//                   </strong>
//                 </p>
//               </section>

//               {/* ID Document Upload Section */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Identity Verification
//                 </h3>

//                 <div className="space-y-2">
//                   <Label htmlFor="idType">ID Document Type</Label>
//                   <Select
//                     value={formData.idType}
//                     onValueChange={(value) =>
//                       handleInputChange("idType", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select document type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {idTypes.map((type) => (
//                         <SelectItem key={type.value} value={type.value}>
//                           {type.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Front Side */}
//                   <div className="space-y-2">
//                     <Label>
//                       {formData.idType === "nic"
//                         ? "NIC Front Side"
//                         : formData.idType === "passport"
//                         ? "Passport Bio Page"
//                         : formData.idType === "license"
//                         ? "License Front Side"
//                         : "School Letter Front Side"}
//                     </Label>
//                     <div className="flex items-center gap-4">
//                       <div className="border rounded-md p-2 w-32 h-32 flex items-center justify-center">
//                         {previews.front ? (
//                           <img
//                             src={previews.front}
//                             alt="Front side preview"
//                             className="w-full h-full object-contain"
//                           />
//                         ) : (
//                           <span className="text-gray-500 text-sm">
//                             No image
//                           </span>
//                         )}
//                       </div>
//                       <div>
//                         <input
//                           type="file"
//                           ref={frontFileRef}
//                           onChange={(e) => handleFileChange("front", e)}
//                           accept="image/*"
//                           className="hidden"
//                           id="frontImage"
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => frontFileRef.current?.click()}
//                         >
//                           Upload
//                         </Button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Back Side */}
//                   <div className="space-y-2">
//                     <Label>
//                       {formData.idType === "nic"
//                         ? "NIC Back Side"
//                         : formData.idType === "passport"
//                         ? "Passport Last Page"
//                         : formData.idType === "license"
//                         ? "License Back Side"
//                         : "School Letter Back Side"}
//                     </Label>
//                     <div className="flex items-center gap-4">
//                       <div className="border rounded-md p-2 w-32 h-32 flex items-center justify-center">
//                         {previews.back ? (
//                           <img
//                             src={previews.back}
//                             alt="Back side preview"
//                             className="w-full h-full object-contain"
//                           />
//                         ) : (
//                           <span className="text-gray-500 text-sm">
//                             No image
//                           </span>
//                         )}
//                       </div>
//                       <div>
//                         <input
//                           type="file"
//                           ref={backFileRef}
//                           onChange={(e) => handleFileChange("back", e)}
//                           accept="image/*"
//                           className="hidden"
//                           id="backImage"
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => backFileRef.current?.click()}
//                         >
//                           Upload
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   Upload clear images of both sides of your{" "}
//                   {formData.idType === "nic"
//                     ? "NIC"
//                     : formData.idType === "passport"
//                     ? "passport"
//                     : "driver's license"}
//                   . Max 2MB per image.
//                 </p>
//               </div>

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Creating Account..." : "Create Account"}
//               </Button>

//               <div className="text-center text-sm">
//                 <p className="text-gray-600">
//                   Already have an account?{" "}
//                   <Link
//                     to="/signin"
//                     className="text-blue-600 hover:underline font-medium"
//                   >
//                     Sign in
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

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
import { registerUser } from "../api/authApi";
import { imageUpload, saveFileLocally } from "../api/fileApi";
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

  const [img, setImg] = useState({
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
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [profilename, setProfileName] = useState(null);
  const [frontname, setFrontName] = useState(null);
  const [backname, setBackName] = useState(null);
  const navigate = useNavigate();

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
  const idTypes = [
    { value: "nic", label: "National Identity Card (NIC)" },
    { value: "passport", label: "Passport" },
    { value: "license", label: "Driver's License" },
    { value: "schoolletter", label: "School Letter" },
  ];
  const gengerTypes = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  let tempFrontName: string | null = null;
  let tempBackName: string | null = null;
  let tempProfileName: string | null = null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (
    type: "front" | "back" | "profile",
    value: string
  ) => {
    setImg((prev) => ({ ...prev, [type]: value }));
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
        handleInputChange("profilePictureName", filename);
        setProfileFile(file);
      } else if (type === "front") {
        handleInputChange("idFrontImageName", filename);
        setFrontFile(file);
      } else {
        handleInputChange("idBackImageName", filename);
        setBackFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idFrontImageName || !formData.idBackImageName) {
      toast.error("Please upload both sides of your ID document");
      return;
    }

    if (!formData.profilePictureName) {
      toast.error("Please upload a profile picture");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.idType !== "schoolletter") {
      if (!formData.idCardNumber) {
        toast.error("Please enter your ID Card Number");
        return;
      }
    }

    setIsLoading(true);

    try {
      try {
        const fontImg = await imageUpload(frontFile);
        tempFrontName = fontImg;
        console.log("tempFrontName1:", tempFrontName);

        const backImg = await imageUpload(backFile);
        tempBackName = backImg;
        console.log("tempBackName1:", tempBackName);

        if (profileFile) {
          const profileImg = await imageUpload(profileFile);
          tempProfileName = profileImg;
          console.log("tempProfileName1:", tempProfileName);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again."
        );
      }

      console.log("Nutsss:", formData);

      const result = await registerUser(
        formData,
        tempFrontName,
        tempBackName,
        tempProfileName
      );
      console.log("Registration result:", result);

      if (result.success) {
        resetForm();
        navigate("/signin");
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
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
    <div className="min-h-screen sports-gradient py-10 sm:py-12 px-4">
      <div className="container mx-auto max-w-8xl">
        <Card className="">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create Account
            </CardTitle>
            {/* <CardDescription className="text-center">
              Join our sports platform community
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ✅ Mobile: column | Desktop: row (your current style) */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                {/* ✅ Mobile full width | Desktop half */}
                <div className="w-full lg:w-1/2">
                  {/* Profile Picture Upload */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Personal Information
                    </h3>

                    {/* ✅ Mobile: stacked | Desktop: inline */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="relative self-start">
                        {previews.profile ? (
                          <img
                            src={previews.profile}
                            alt="Profile preview"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-300"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs sm:text-sm">
                              No image
                            </span>
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
                        <Label
                          htmlFor="profilePicture"
                          className="cursor-pointer"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
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

                  {/* Personal Information */}
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter full name"
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="gengerTypes">Gender</Label>
                          <Select
                            value={formData.gender}
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
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Select
                          value={formData.district}
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
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="Enter weight"
                          value={formData.weight}
                          onChange={(e) =>
                            handleInputChange("weight", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="Enter height"
                          value={formData.height}
                          onChange={(e) =>
                            handleInputChange("height", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ Mobile full width | Desktop half */}
                <div className="w-full lg:w-1/2">
                  {/* Contact & Identification */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Contact & Identification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="idCardNumber">NIC Number</Label>
                        <Input
                          id="idCardNumber"
                          placeholder="Enter ID card number"
                          value={formData.idCardNumber}
                          onChange={(e) =>
                            handleInputChange("idCardNumber", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          placeholder="Enter phone number"
                          value={formData.contactNumber}
                          onChange={(e) =>
                            handleInputChange("contactNumber", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-4 mt-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Account Security
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <section
                id="document-submission"
                className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-red-800"
              >
                <p className="text-gray-700 mb-4">
                  🔴If you do not have a National Identity Card (NIC), Passport,
                  or Driver's License, please upload a{" "}
                  <strong className="font-semibold">
                    letter from your school
                  </strong>{" "}
                  certified by the{" "}
                  <strong className="font-semibold">Principal</strong> or{" "}
                  <strong className="font-semibold">Vice Principal</strong>.🔴
                </p>
                <p className="text-gray-700 mb-4">
                  The letter should include the following details:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>School letterhead</li>
                  <li>Full name as per the Birth Certificate</li>
                  <li>Address</li>
                  <li>Date of birth</li>
                  <li>District</li>
                  <li>Student verification from the school</li>
                </ul>
                <p className="text-gray-700 font-semibold">
                  <strong>
                    Please choose "School Letter" as the document type when
                    uploading.
                  </strong>
                </p>
              </section>

              {/* ID Document Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Identity Verification
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="idType">ID Document Type</Label>
                  <Select
                    value={formData.idType}
                    onValueChange={(value) =>
                      handleInputChange("idType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {idTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Front Side */}
                  <div className="space-y-2">
                    <Label>
                      {formData.idType === "nic"
                        ? "NIC Front Side"
                        : formData.idType === "passport"
                        ? "Passport Bio Page"
                        : formData.idType === "license"
                        ? "License Front Side"
                        : "School Letter Front Side"}
                    </Label>

                    {/* ✅ Mobile: stack preview + button */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="border rounded-md p-2 w-full sm:w-32 h-40 sm:h-32 flex items-center justify-center">
                        {previews.front ? (
                          <img
                            src={previews.front}
                            alt="Front side preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No image
                          </span>
                        )}
                      </div>
                      <div className="w-full sm:w-auto">
                        <input
                          type="file"
                          ref={frontFileRef}
                          onChange={(e) => handleFileChange("front", e)}
                          accept="image/*"
                          className="hidden"
                          id="frontImage"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => frontFileRef.current?.click()}
                        >
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="space-y-2">
                    <Label>
                      {formData.idType === "nic"
                        ? "NIC Back Side"
                        : formData.idType === "passport"
                        ? "Passport Last Page"
                        : formData.idType === "license"
                        ? "License Back Side"
                        : "School Letter Back Side"}
                    </Label>

                    {/* ✅ Mobile: stack preview + button */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="border rounded-md p-2 w-full sm:w-32 h-40 sm:h-32 flex items-center justify-center">
                        {previews.back ? (
                          <img
                            src={previews.back}
                            alt="Back side preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No image
                          </span>
                        )}
                      </div>
                      <div className="w-full sm:w-auto">
                        <input
                          type="file"
                          ref={backFileRef}
                          onChange={(e) => handleFileChange("back", e)}
                          accept="image/*"
                          className="hidden"
                          id="backImage"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => backFileRef.current?.click()}
                        >
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Upload clear images of both sides of your{" "}
                  {formData.idType === "nic"
                    ? "NIC"
                    : formData.idType === "passport"
                    ? "passport"
                    : "driver's license"}
                  . Max 2MB per image.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;

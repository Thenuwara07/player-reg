// // src/pages/Home.tsx
// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Users, TrendingUp } from "lucide-react";
// import PostCard from "@/components/Common/PostCard";
// import { GetPosts } from "@/api/postApi";
// import type { Post } from "@/types/authTypes";

// const IMG_URL =
//   (import.meta.env.VITE_IMG_URL as string) || "http://localhost:3000/uploads";

// const resolveImg = (name?: string) =>
//   name && name.startsWith("http") ? name : name ? `${IMG_URL}/${name}` : "";

// const Home: React.FC = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const result = await GetPosts();
//         // Handle either Post[] or { data: Post[] }
//         const serverPosts: Post[] = Array.isArray(result)
//           ? result
//           : Array.isArray((result as any)?.data)
//           ? (result as any).data
//           : [];

//         const normalized: Post[] = serverPosts.map((p) => ({
//           ...p,
//           imageName: resolveImg(p.imageName), // ensure full URL for PostCard
//         }));

//         setPosts(normalized);
//       } catch (e) {
//         console.error("Failed to load posts", e);
//         setPosts([]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="hero-gradient text-white py-20">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
//             Welcome to SLBFRegistration
//           </h1>
//           <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
//             Register players, manage profiles, and connect through one platform.
//           </p>
//           {/* <div className="flex justify-center space-x-4">
//             <Badge className="bg-white/20 text-white px-4 py-2">
//               <Users className="w-4 h-4 mr-2" />
//               Players
//             </Badge>
//             <Badge className="bg-white/20 text-white px-4 py-2">
//               <TrendingUp className="w-4 h-4 mr-2" />
//               Partner Clubs
//             </Badge>
//           </div> */}
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2">
//             {/* Posts Section */}
//             <div className="mb-12">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-3xl font-bold text-gray-800">Latest News & Updates</h2>
//                 <Badge className="bg-blue-100 text-blue-800">
//                   {posts.length} Posts
//                 </Badge>
//               </div>

//               {/* EXACT structure you asked for */}
//               <div className="space-y-6">
//                 {loading ? (
//                   <Card>
//                     <CardContent className="p-6 text-gray-600">Loading posts…</CardContent>
//                   </Card>
//                 ) : posts.length === 0 ? (
//                   <Card>
//                     <CardContent className="p-6 text-gray-600">No posts found.</CardContent>
//                   </Card>
//                 ) : (
//                   posts.map((post) => <PostCard key={post.id} post={post} />)
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             {/* Advertisement Space */}
//             <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle>Advertisement</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 p-8 rounded-lg text-center min-h-[200px] flex flex-col justify-center">
//                   <div className="text-4xl mb-3">🏆</div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Ad Here</h3>
//                   <p className="text-gray-600 text-sm">Contact us for advertising opportunities</p>
//                   {/* <Button variant="outline" size="sm" className="mt-4">
//                     Learn More
//                   </Button> */}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Platform Stats (placeholders) */}
//             {/* <Card className="mb-6">
//               <CardHeader>
//                 <CardTitle>Platform Stats</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600 flex items-center">
//                       <Users className="w-4 h-4 mr-2" />
//                       Total Players
//                     </span>
//                     <Badge className="bg-blue-100 text-blue-800 font-semibold">—</Badge>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Active Clubs</span>
//                     <Badge className="bg-green-100 text-green-800 font-semibold">—</Badge>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Districts Covered</span>
//                     <Badge className="bg-purple-100 text-purple-800 font-semibold">—</Badge>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Recent Posts</span>
//                     <Badge className="bg-orange-100 text-orange-800 font-semibold">
//                       {posts.length}
//                     </Badge>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card> */}

//             {/* Quick Actions */}
//             {/* <Card>
//               <CardHeader>
//                 <CardTitle>Quick Actions</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <Button className="w-full" size="sm">
//                     Join Tournament
//                   </Button>
//                   <Button variant="outline" className="w-full" size="sm">
//                     Find Clubs
//                   </Button>
//                   <Button variant="outline" className="w-full" size="sm">
//                     Contact Support
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp } from "lucide-react";
import PostCard from "@/components/Common/PostCard";
import { GetdeafaultDetails, GetPosts } from "@/api/postApi";
import type { DefaultDetails, Post } from "@/types/authTypes";
import { useGlobalSettings } from "../contexts/GlobalSettingsContext";

// const IMG_URL =
//   (import.meta.env.VITE_IMG_URL as string);

const API_BASE = (import.meta.env.VITE_API_URL as string)?.replace(/\/+$/, "");

const resolveImg = (name?: string) => {
  if (!name) return "";

  // Cloudinary or any full URL stored in DB
  if (/^https?:\/\//i.test(name)) return name;

  // old local paths are not supported anymore in production
  return "";
};
const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [details, setDetails] = useState<DefaultDetails | null>(null);
  const [loading, setLoading] = useState(true);
  // if (settingsLoading) return <div>Loading Global Settings...</div>;
  // if (!settings) return <div>Error loading settings.</div>;

  useEffect(() => {
    (async () => {
      try {
        const result = await GetPosts();
        const defaultDetails = await GetdeafaultDetails(); // Fetch default details
        // Handle either Post[] or { data: Post[] }
        console.log("posts fetched:", defaultDetails);
        const serverPosts: Post[] = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.data)
            ? (result as any).data
            : [];

        const normalized: Post[] = serverPosts.map((p) => ({
          ...p,
          imageName: resolveImg(p.imageName), // ensure full URL for PostCard
        }));

        setPosts(normalized);
        if (Array.isArray(defaultDetails) && defaultDetails.length > 0) {
          setDetails(defaultDetails[0]);
        } else if (!Array.isArray(defaultDetails)) {
          // If it's already an object (just in case API changes)
          setDetails(defaultDetails as DefaultDetails);
        }
        console.log("default details set in state:", details);
      } catch (e) {
        console.error("Failed to load posts", e);
        setPosts([]);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <div className="hero-gradient text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
            {details?.herotitle}
          </h1>
          <p className="text-base sm:text-lg md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-90 px-2 sm:px-0">
            {details?.herosubtitle}
          </p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-white/20 text-white px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Players
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Partner Clubs
            </Badge>
          </div>
          
        </div>
      </div> */}
      <div
        className="hero-gradient text-white py-12 sm:py-16 lg:py-20 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${details?.imageName || "your-fallback-image.jpg"})`,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
            {details?.herotitle}
          </h1>
          <p className="text-base sm:text-lg md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-90 px-2 sm:px-0">
            {details?.herosubtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Posts Section */}
            <div className="mb-10 sm:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                  Latest News & Updates
                </h2>
                <Badge className="bg-blue-100 text-blue-800 w-fit">
                  {posts.length} Posts
                </Badge>
              </div>

              {/* EXACT structure you asked for */}
              <div className="space-y-4 sm:space-y-6">
                {loading ? (
                  <Card>
                    <CardContent className="p-4 sm:p-6 text-gray-600">
                      Loading posts…
                    </CardContent>
                  </Card>
                ) : posts.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 sm:p-6 text-gray-600">
                      No posts found.
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    // ✅ This wrapper makes images smaller ONLY on mobile,
                    // without editing PostCard.
                    <div
                      key={post.id}
                      className="
                        post-mobile-img
                        [&_img]:h-36 [&_img]:w-full [&_img]:object-cover
                        sm:[&_img]:h-auto
                      "
                    >
                      <PostCard post={post} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Advertisement Space */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Advertisement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 p-6 sm:p-8 rounded-lg text-center min-h-[180px] sm:min-h-[200px] flex flex-col justify-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Your Ad Here
                  </h3>
                  <p className="text-gray-600 text-sm px-2 sm:px-0">
                    Contact us for advertising opportunities
                  </p>
                  {/* <Button variant="outline" size="sm" className="mt-4">
                    Learn More
                  </Button> */}
                </div>
              </CardContent>
            </Card>

            {/* Platform Stats (placeholders) */}
            {/* <Card className="mb-6">
              <CardHeader>
                <CardTitle>Platform Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Total Players
                    </span>
                    <Badge className="bg-blue-100 text-blue-800 font-semibold">—</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Clubs</span>
                    <Badge className="bg-green-100 text-green-800 font-semibold">—</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Districts Covered</span>
                    <Badge className="bg-purple-100 text-purple-800 font-semibold">—</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Recent Posts</span>
                    <Badge className="bg-orange-100 text-orange-800 font-semibold">
                      {posts.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Quick Actions */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" size="sm">
                    Join Tournament
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Find Clubs
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

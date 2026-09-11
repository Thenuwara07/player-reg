import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserDashboard from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Players from "./pages/Players";
import Test from "./pages/Test";
import Guestplayer from "./pages/Guestplayer";
import PlayerAdminView from "./pages/PlayerAdminView";
import AllPosts from "@/pages/AllPosts";
import PostCreateEdit from "@/pages/PostCreateEdit";
import PublicRoute from "@/routes/PublicRoute";
import Settings  from "@/pages/Settings";

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { isLoading } = useAuth();
  const user = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData")!)
    : null;
  console.log("ProtectedRoute user:", user);
  // if (isLoading) {
  //   return <div className="flex items-center justify-center h-screen">Loading...</div>;
  // }
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>

          <Route
            path="/signin"
            element={
              <PublicRoute redirectTo="/">
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute redirectTo="/">
                <SignUp />
              </PublicRoute>
            }
          />


          <Route path="/" element={<Home />} />
          {/* <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/players" element={<Players />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/test" element={<Test />} />
          <Route path="/player" element={<Guestplayer />} />
          <Route path="/" element={<Navigate to="/allPosts" replace />} />
          
          

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allPlayers"
            element={
              <ProtectedRoute adminOnly={true}>
                <PlayerAdminView />
              </ProtectedRoute>
            }
          />
          <Route path="/allPosts" element={ <ProtectedRoute adminOnly={true}>
                <AllPosts />
              </ProtectedRoute> } />
          <Route path="/posts/new" element={<ProtectedRoute adminOnly={true}>
                <PostCreateEdit/>
              </ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute adminOnly={true}>
                <Settings />
              </ProtectedRoute>} />
          {/* <Route path="/posts/:id" element={<PostDetails />} /> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

// App.tsx or your router configuration file------------------------------
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthContext";
// import ProtectedRoute from "./components/ProtectedROute";
// import Home from "./pages/Home";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import UserDashboard from "./pages/Profile";
// import AdminDashboard from "./pages/AdminDashboard";
// import NotFound from "./pages/NotFound";
// import Players from "./pages/Players";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import Header from "@/components/Layout/Header";
// import Footer from "@/components/Layout/Footer";

// const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <AuthProvider>
//             <Header />
//             <Routes>
//               {/* Public routes */}
//               <Route path="/signin" element={<SignIn />} />
//               <Route path="/unauthorized" element={<NotFound />} />
//               <Route path="/admin" element={<AdminDashboard />} />

//               {/* Protected routes */}
//               <Route
//                 element={
//                   <ProtectedRoute
//                     allowedRoles={["player", "admin", "superadmin"]}
//                   />
//                 }
//               >
//                 <Route path="/dashboard" element={<UserDashboard />} />
//               </Route>

//               <Route
//                 element={
//                   <ProtectedRoute allowedRoles={["admin", "superadmin"]} />
//                 }
//               >
//                 {/* <Route path="/admin" element={<AdminDashboard />} /> */}
//               </Route>

//               {/* <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
//             <Route path="/superadmin" element={<SuperAdminDashboard />} />
//           </Route> */}

//               {/* Default redirect */}
//               <Route path="/" element={<Navigate to="/dashboard" replace />} />
//             </Routes>
//             <Footer />
//           </AuthProvider>
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;

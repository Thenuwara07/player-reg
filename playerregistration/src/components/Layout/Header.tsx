// import React from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";
// import { Menu, X } from "lucide-react";

// const Header = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully");
//     navigate("/");
//   };

//   return (
//     <header className="bg-white shadow-lg border-b">
//       <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//         <Link to="/" className="flex items-center space-x-2">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
//             <span className="text-white font-bold text-lg">S</span>
//           </div>
//           <span className="text-2xl font-bold text-gray-800">
//             SLBFRegistrations
//           </span>
//         </Link>

//         <div className="flex items-center space-x-20">
//           <nav className="hidden md:flex items-center space-x-12">
//             {user?.role == "player" ? (
//               <>
//                 {location.pathname === "/players" ? (
//                   <>
//                     <Link
//                       to="/"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Home
//                     </Link>

//                     <Link
//                       to="/dashboard"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Profile
//                     </Link>
//                   </>
//                 ) : location.pathname === "/" ? (
//                   <>
//                     <Link
//                       to="/players"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Players
//                     </Link>

//                     <Link
//                       to="/dashboard"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Profile
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link
//                       to="/"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Home
//                     </Link>

//                     <Link
//                       to="/players"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Players
//                     </Link>
//                   </>
//                 )}
//               </>
//             ) : user?.role == "admin" ? (
//               <>
//                 {location.pathname === "/players" ? (
//                   <>
//                   <Link
//                     to="/"
//                     className="text-gray-600 hover:text-blue-600 transition-colors"
//                   >
//                     Home
//                   </Link>
//                   <Link
//                       to="/admin"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Dashboard
//                     </Link>
//                   </>
//                 ) : location.pathname === "/" ? (
//                   <>
//                     <Link
//                       to="/admin"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Dashboard
//                     </Link>

//                     <Link
//                       to="/players"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Players
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link
//                       to="/"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Home
//                     </Link>

//                     <Link
//                       to="/players"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Players
//                     </Link>
//                     <Link
//                       to="/admin"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Dashboard
//                     </Link>
//                   </>
//                 )}
//               </>
//             ) : (
//               <>
//                 {location.pathname === "/players" ? (
//                   <Link
//                     to="/"
//                     className="text-gray-600 hover:text-blue-600 transition-colors"
//                   >
//                     Home
//                   </Link>
//                 ) : location.pathname === "/" ? (
//                   <Link
//                     to="/players"
//                     className="text-gray-600 hover:text-blue-600 transition-colors"
//                   >
//                     Players
//                   </Link>
//                 ) : (
//                   <>
//                     <Link
//                       to="/"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Home
//                     </Link>

//                     <Link
//                       to="/players"
//                       className="text-gray-600 hover:text-blue-600 transition-colors"
//                     >
//                       Players
//                     </Link>
//                   </>
//                 )}
//               </>
//             )}
//           </nav>
//           <div className="flex items-center space-x-4">
//             {user ? (
//               <div className="flex items-center space-x-10">
//                 <span className="text-gray-600">
//                   Welcome, {user.firstname}
//                   {user.firstName} !
//                 </span>
//                 <Button variant="outline" onClick={handleLogout}>
//                   Logout
//                 </Button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Button variant="outline" asChild>
//                   <Link  to="/signin">Sign In</Link>
//                 </Button>
//                 <Button asChild>
//                   <Link to="/signup">Sign Up</Link>
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React, { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ you were using location without defining it
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setMobileOpen(false);
    navigate("/");
  };

  const closeMobile = () => setMobileOpen(false);

  // ✅ Build links once, based on role + current path (keeps your logic but simpler)
  const navLinks = useMemo(() => {
    const path = location.pathname;

    const common = {
      home: { to: "/", label: "Home" },
      players: { to: "/players", label: "Players" },
      profile: { to: "/dashboard", label: "Profile" },
      admin: { to: "/admin", label: "Dashboard" },
    };

    // Guest
    if (!user) {
      if (path === "/") return [common.players];
      if (path === "/players") return [common.home];
      return [common.home, common.players];
    }

    // Player
    if (user?.role === "player") {
      if (path === "/players") return [common.home, common.profile];
      if (path === "/") return [common.players, common.profile];
      return [common.home, common.players];
    }

    // Admin
    if (user?.role === "admin") {
      if (path === "/players") return [common.home, common.admin];
      if (path === "/") return [common.admin, common.players];
      return [common.home, common.players, common.admin];
    }

    // Default logged-in role (fallback)
    if (path === "/") return [common.players];
    if (path === "/players") return [common.home];
    return [common.home, common.players];
  }, [user, location.pathname]);

  const userName =
    user?.firstName || user?.firstname || user?.name || "User"; // ✅ fixes firstname/firstName duplication

  return (
    <header  className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div id="header" className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={closeMobile} className="flex items-center space-x-2">
          {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div> */}
          <span className="text-xl md:text-2xl font-bold text-gray-800">
            SLBFRegistrations
          </span>
        </Link>

        {/* Desktop Nav + Auth */}
        <div className="hidden md:flex items-center space-x-10">
          <nav className="flex items-center space-x-8">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {userName}!</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 border text-gray-700 hover:bg-gray-100"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-3">
            <nav className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={closeMobile}
                  className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="text-gray-600 px-3">Welcome, {userName}!</div>
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="w-full" onClick={closeMobile}>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full" onClick={closeMobile}>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

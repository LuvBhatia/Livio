import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false, hoverSidebar = false }) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  if (hoverSidebar) {
    return (
      <div className="min-h-screen">
        <div className="flex relative">
          {/* Hover zone on the left edge */}
          <div
            className="fixed left-0 top-0 w-8 h-full z-40"
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
          />

          {/* Sidebar that appears on hover and adjusts layout */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isSidebarHovered ? "w-64" : "w-0"
            }`}
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
          >
            <div className="w-64 h-screen">
              <Sidebar />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            <Navbar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
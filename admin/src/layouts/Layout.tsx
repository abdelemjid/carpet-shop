import React from "react";
import Footer from "../components/layout/Footer";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <Navbar />
      <Toaster richColors position="bottom-center" />
      <div className="container flex-1 my-10">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;

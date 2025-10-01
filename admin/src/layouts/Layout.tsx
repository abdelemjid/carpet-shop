import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "sonner";

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

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="container flex-1 my-10">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;

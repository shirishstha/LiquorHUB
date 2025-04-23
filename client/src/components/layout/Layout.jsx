import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Layout = ({ children, description, keywords, author, title }) => {

  //to insure that the scroll is set to top when navigating to different route
  const location = useLocation();
  
  useEffect(()=>{
    window.scrollTo(0,0);
  },[location.pathname]);

  return (
    <div>
      <Helmet>
        <meta charset="UTF-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      {/* header component */}
      <Header/>

      {/* all other child components */}
      <main className="pt-18 min-h-[100vh]">{children}</main>
      <Toaster/>

      {/* footer component */}
      <Footer />
    </div>
  );
};

export default Layout;

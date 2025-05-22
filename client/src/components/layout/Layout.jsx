import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/context/theme";

const Layout = ({ children, description, keywords, author, title }) => {

  //to insure that the scroll is set to top when navigating to different route
  const location = useLocation();

  const [theme] = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      <Header />

      {/* all other child components */}
      <main className={`pt-18 min-h-[100vh] dark:bg-[#0d1117] `}>{children}</main>
      <Toaster
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#1f2937',
          },
        }}
      />

      {/* footer component */}
      <Footer />
    </div>
  );
};

export default Layout;

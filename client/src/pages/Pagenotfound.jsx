import Layout from "@/components/layout/Layout";
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PageNotFoundPage = () => {
  return (
    <div>
      <Layout title="Page Not Found">
        <div className="flex flex-col  items-center h-[70vh] justify-center">
          <h1 className="text-7xl font-medium mb-2">404</h1>
          <h2 className="text-2xl mb-2">Oops ! Page Not Found</h2>
          <Button className='dark:bg-[#161b22] hover:dark:bg-[#1c2128] dark:text-white'>
            <Link to="/">Go back</Link>
          </Button>
        </div>
      </Layout>
    </div>
  );
};

export default PageNotFoundPage;

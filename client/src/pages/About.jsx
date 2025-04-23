import Layout from "@/components/layout/Layout";
import React from "react";

const AboutPage = () => {
  return (
    <div>
      <Layout title="LiquorHub-about">
        <div className="flex w-full h-[80vh] ">
          <div className="w-1/2 flex items-center ">
            <img
              src="https://img02.mockplus.com/image/2024-09-21/cd712190-77c9-11ef-aec5-e56592e51743.png"
              alt="img_here"
              className=""
            />
          </div>

          <div className=" w-1/2 mt-16">
            <div className="w-[80%] ml-8 mt-5">
              <h1 className="flex justify-center text-3xl bg-gray-800 text-white  p-2">
                About Us
              </h1>
              <p className="py-5">
                <span className="text-gray-900 text-2xl font-serif">Liquor Hub</span> is responsible for offering various kinds of liquor 
                products. We offer delivery service all over kathmandu valley . 
                Liquor Hub is a online platform offering numerous numbers and variaties
                of liquor from all over the world.Cheers Mate!

              </p>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AboutPage;

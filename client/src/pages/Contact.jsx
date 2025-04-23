import Layout from "@/components/layout/Layout";
import React from "react";
import { FaPhoneVolume } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { TfiHeadphoneAlt } from "react-icons/tfi";

const ContactPage = () => {
  return (
    <div>
      <Layout title="LiquorHub-contact">
        <div className="flex w-full h-[80vh]">
          <div className="w-1/2 flex items-center justify-end ">
            <img
              src="https://plus.unsplash.com/premium_photo-1661764559869-f6052a14b4c9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="contact_img"
              className="w-[90%] "
            />
          </div>
          <div className="w-1/2 mt-16  ">
            <div className="w-[80%] ml-16">
              <h1 className="flex justify-center bg-gray-900 text-white text-3xl p-2 mb-2">
                Contact
              </h1>
              <h3>
                If you face any queries you can contact easily through the given
                details.Thankyou !
              </h3>
              <div className="  mt-8 text-lg space-y-5">
                <p className="flex items-center">
                  <FaPhoneVolume /> <span className="px-2">9854544544</span>
                </p>
                <p className="flex items-center">
                  <MdOutlineEmail />
                  <span className="px-2">liquorhub@support.com</span>
                </p>
                <p className="flex items-center">
                  <TfiHeadphoneAlt />
                  <span className="px-2">011 05555512 2155 (toll free)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ContactPage;

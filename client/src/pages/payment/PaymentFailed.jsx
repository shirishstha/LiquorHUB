import Layout from '@/components/layout/Layout';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom';

const PaymentFailed = () => {
  const params = useParams();
  const {oid} = params;

  useEffect(()=>{
    if(!sessionStorage.getItem(`toast_${oid}`)){
      toast.error("Payment Failed");
      sessionStorage.setItem(`toast_${oid}`,"true");
    }
  },[oid]);
    
  return (
    <Layout>
      <SidebarLayout>
        <div className='h-[100%] w-full'>
          <div className='flex h-[80%] items-center p-5'>
            <div className='flex flex-col w-[30%] space-y-3'>
              <h1 className='text-3xl font-bold'>PAYMENT FAILED</h1>
              <hr />
              <h3>Your payment has been canceled or failed due to some reasons.Would you like to try again?</h3>
              <Link to="/cart"><Button className='dark:text-white dark:bg-[#161b22] hover:dark:bg-[#1c2128]'>Try again</Button></Link>
            </div>
            <div className=' w-[70%] h-[100%]'>
            <img src="/payment_error.png" alt="payment error"  />
            </div>

          </div>
          
        </div>



      </SidebarLayout>
    </Layout>
  )
}

export default PaymentFailed

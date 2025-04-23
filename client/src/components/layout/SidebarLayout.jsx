import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "../AdminSidebar";
import { UserSidebar } from "../UserSidebar";
import { useAuth } from "@/context/auth";

export default function SidebarLayout({ children }) {
    const [auth] = useAuth();
  return (
    <SidebarProvider>
     {auth?.user?.role === 1? <AdminSidebar/> : <UserSidebar/>}
      <main className="flex w-full  ">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}



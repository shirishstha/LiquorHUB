import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { useAuth } from "@/context/auth";
import toast from "react-hot-toast";
import SearchForm from "../SearchForm";
import { Button } from "../ui/button";
import { Command, CommandItem, CommandList } from "../ui/command";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import useCategory from "@/hooks/useCategory";
import { useCart } from "@/context/cart";

const Header = () => {
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const categories = useCategory();
  const [cart] = useCart();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout successfully");
  };
  return (
    <>
      <div className="fixed w-screen flex justify-between px-4 py-2.5 shadow-sm bg-white z-10 ">
        <h1 className=" flex space-x-2 items-center text-2xl bold">
          <span className="mt-0.5 mr-1 text-3xl">
            <CiShoppingCart />
          </span>
          Liquor
          <span className="bg-gray-800 text-white rounded-md text-sm p-0.5  ml-1 mb-0=">
            HUB
          </span>
        </h1>
        <div className="flex ml-7  items-center w-full justify-center ">
          <SearchForm />
        </div>
        <NavigationMenu className="flex ">
          <NavigationMenuList className="space-x-1">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`text-md ${
                  location.pathname === "/" ? "bg-gray-100" : "opacity-95"
                }`}
              >
                <Link to="/">Home </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {!auth.user ? (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`text-md ${
                      location.pathname === "/register"
                        ? "bg-gray-100"
                        : "opacity-95"
                    }`}
                  >
                    <Link to="/register">Register </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`text-md ${
                      location.pathname === "/login"
                        ? "bg-gray-100"
                        : "opacity-95"
                    }`}
                  >
                    <Link to="/login">Login </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <HoverCard openDelay={40} closeDelay={40}>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="outline"
                        className=" flex font-normal text-md"
                      >
                        {auth?.user?.name}
                        <ChevronDown />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-35 p-1">
                      <Command>
                        <CommandList className="p-1.5">
                          <CommandItem>
                            <Link
                              to={`/dashboard${
                                auth?.user?.role === 1 ? "/admin" : "/user"
                              }`}
                              className="flex space-x-2"
                            >
                              <LayoutDashboard className="text-black/80 items-center mt-0.5" />
                              <span>Dashboard</span>
                            </Link>
                          </CommandItem>
                          <CommandItem>
                            <Link
                              to="/login"
                              onClick={handleLogout}
                              className="flex space-x-2"
                            >
                              <LogOut className="text-black/80 items-center mt-0.5" />{" "}
                              <span>Logout</span>
                            </Link>
                          </CommandItem>
                        </CommandList>
                      </Command>
                    </HoverCardContent>
                  </HoverCard>
                </NavigationMenuItem>
              </>
            )}

            <NavigationMenuItem>
              <HoverCard openDelay={40} closeDelay={40}>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" className=" flex font-normal text-md">
                    Category
                    <ChevronDown />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="p-2 rounded w-[45vw]">
                  <Command>
                    <CommandList className="p-2 max-h-[70vh]">
                      <div className="flex flex-row gap-4 pb-2  w-full flex-wrap">
                        <Link to="/categories">
                          <CommandItem className="block p-4 space-y-1 cursor-pointer w-[250px]">
                            <h1 className="font-medium">All Categories</h1>
                            <h3 className="text-gray-500 text-sm">
                              Explore all categories through which you can
                              select your favourite spirit
                            </h3>
                          </CommandItem>
                        </Link>
                        {categories?.map((cat) => (
                          <Link
                            to={`/category/${cat.slug}`}
                            key={cat._id}
                            className="flex-shrink-0"
                          >
                            <CommandItem className="block p-4 space-y-1 cursor-pointer w-[250px]">
                              <h1 className="font-medium">{cat.name}</h1>
                              <h3 className="text-gray-500 text-sm">
                                {cat.description
                                  ? cat.description
                                  : "Feel the taste of spirit"}
                              </h3>
                            </CommandItem>
                          </Link>
                        ))}
                      </div>
                    </CommandList>
                  </Command>
                </HoverCardContent>
              </HoverCard>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`text-md ${
                  location.pathname === "/cart" ? "bg-gray-100" : "opacity-95"
                }`}
              >
                <Link to="/cart">
                  <span className="flex pr-5 h-[100%]">
                    Cart
                    <span className="bg-black text-white text-xs h-4 w-3 flex justify-center items-center rounded-full p-2 ml-1">
                      {cart.length}
                    </span>
                  </span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};

export default Header;

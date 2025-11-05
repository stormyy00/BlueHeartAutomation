"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FC, ReactNode } from "react";
import Image from "next/image";
import LOGO from "@/public/temporarylogo.png";
import { signOut, useSession } from "@/utils/auth-client";
import { LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const Navigation = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogOut = () => {
    signOut();
    router.push("/");
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
  };

  return (
    <motion.nav className="fixed top-0 left-0 w-full z-50 px-6 backdrop-blur-md bg-ttickles-white/90 py-4 border-b border-ttickles-blue shadow-lg shadow-ttickles-lightblue/20">
      <div className="mx-auto flex items-center justify-between px-6 max-w-8xl">
        <Link
          href="/"
          className="flex items-center text-3xl tracking-wide font-bold text-ttickles-blue hover:opacity-80 transition"
        >
          <Image
            src={LOGO}
            alt="TTickle Logo"
            className="h-12 w-12"
            priority
            quality={100}
          />
          <span className="-ml-1.5">ickle</span>
        </Link>

        <div className="flex gap-x-6 items-center">
          <NavLink href="/about">About Us</NavLink>

          {session ? (
            <>
              <Link
                href="/user"
                className="relative text-ttickles-darkblue text-lg font-bold group"
              >
                Dashboard
                <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-ttickles-darkblue transition-all duration-300 group-hover:w-full" />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 border-2 border-ttickles-blue">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback className="bg-ttickles-blue text-white font-bold">
                      {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 rounded-lg">
                  <DropdownMenuLabel className="p-3">
                    <div className="font-medium leading-snug">
                      {session?.user?.name || "User"}
                    </div>
                    {session?.user?.email && (
                      <div className="text-xs text-ttickles-darkblue/90">
                        {session.user.email}
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              href="/signin"
              className="bg-ttickles-darkblue/80 backdrop-blur-sm border border-ttickles-white/30 px-2.5 py-1 text-white font-bold hover:bg-ttickles-darkblue/60 transition-all duration-300 rounded-full"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink: FC<NavLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="relative text-ttickles-darkblue text-lg font-bold group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-ttickles-darkblue transition-all duration-300 group-hover:w-full" />
  </Link>
);

export default Navigation;

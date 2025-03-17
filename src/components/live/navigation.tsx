"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FC, ReactNode } from "react";

const Navigation: FC = () => {
  const { data: session } = useSession();

  return (
    <motion.nav
      className="opacity- fixed top-0 left-0 w-full bg-gradient-to-r from-[#4A9085] to-[#657787] z-50 px-6 py-3 flex justify-between items-center"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-semibold text-white hover:opacity-80 transition"
      >
        TTickle
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-x-6 items-center">
        <NavLink href="/about">About Us</NavLink>

        {session ? (
          <NavLink href="/orgs/test/newsletter">Dashboard</NavLink>
        ) : (
          <motion.button
            className="px-4 py-2 bg-white text-[#4A9085] font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-transform duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Join Us
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

/** TypeScript Props for NavLink */
interface NavLinkProps {
  href: string;
  children: ReactNode;
}

/** Reusable NavLink Component with Hover Underline Effect **/
const NavLink: FC<NavLinkProps> = ({ href, children }) => (
  <Link href={href} className="relative text-white text-lg font-medium group">
    {children}
    <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

export default Navigation;

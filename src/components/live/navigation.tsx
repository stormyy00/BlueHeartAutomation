"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FC, ReactNode } from "react";
import Image from "next/image";
import LOGO from "@/public/temporarylogo.png";

const Navigation: FC = () => {
  const { data: session } = useSession();

  return (
    <motion.nav
      className=" fixed top-0 left-0 w-full  z-50 px-6 backdrop-blur-md bg-ttickles-white/90 py-4 border-b border-ttickles-blue shadow-lg shadow-ttickles-lightblue/20"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
    >
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
                href="/orgs/test/newsletter"
                className="relative text-ttickles-darkblue text-lg font-bold group"
              >
                Dashboard
                <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-ttickles-darkblue transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <button
                className="bg-ttickles-darkblue/80 backdrop-blur-sm border border-ttickles-white/30 px-2.5 py-1 text-white font-bold hover:bg-ttickles-darkblue/60 transition-all duration-300 rounded-full"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
              {/* <UserButton /> */}
            </>
          ) : (
            <button
              className="bg-ttickles-lightblue/20 backdrop-blur-sm border border-ttickles-white/30 px-2.5 py-1 text-white/80 font-bold hover:bg-ttickles-darkblue/40 transition-all duration-300 rounded-full"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Join Us
            </button>
          )}
        </div>
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
  <Link
    href={href}
    className="relative text-ttickles-darkblue text-lg font-bold group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-ttickles-darkblue transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

export default Navigation;

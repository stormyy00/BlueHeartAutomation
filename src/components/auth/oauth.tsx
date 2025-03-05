"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

export const Oauth = () => {
  return (
    <button
      className="text-blue-600 font-bold text-lg border border-black p-1"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      Continue with Google
    </button>
  );
};

export default Oauth;

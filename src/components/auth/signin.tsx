"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import SignInProvider from "@/utils/signIn";
import { signIn } from "@/utils/auth-client";
import type { ErrorContext } from "better-auth/react";

type Mode = "password" | "magic";

const SignIn = () => {
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!validateEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (mode === "password" && !password.trim()) {
      setFormError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "magic") {
        await signIn.magicLink({
          email,
          name: undefined,
          callbackURL: "/",
          newUserCallbackURL: "/welcome",
          errorCallbackURL: "/error",
        });
        setSuccessMessage("Magic link sent! Check your email.");
        toast.success("Magic link sent to your email");
        return;
      }

      await signIn.email(
        { email, password, callbackURL: "http://localhost:3000/user" },
        {
          onSuccess: async () => {
            setLoading(false);
            setSuccessMessage("Successfully signed in!");
            toast.success("Welcome back!");
            // Redirect will be handled by Better Auth
          },
          onError: (ctx: ErrorContext) => {
            setLoading(false);
            const errorMsg =
              ctx.error.message || "Invalid credentials. Please try again.";
            setFormError(errorMsg);
            toast.error(errorMsg);
          },
        },
      );
    } catch (error) {
      setLoading(false);
      const errorMsg = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        console.error("SignIn error:", error);
      }
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-ttickles-white p-6 sm:p-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_-10%,_rgba(80,71,163,0.06),_transparent_60%)]" />

      <div className="w-full max-w-md">
        <Image
          src="/temporarylogo.png"
          alt="Tt logo"
          width={120}
          height={120}
          priority
          className="mx-auto mb-6 sm:mb-8"
        />

        <Card className="border border-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl leading-6 font-bold text-ttickles-blue">
              Sign In
            </CardTitle>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Welcome back!
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ttickles-gray" />
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="pl-10 bg-ttickles-white text-black border border-ttickles-lightblue/60 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                />
              </div>
              {mode === "password" && (
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ttickles-gray" />
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="pl-10 pr-10 bg-ttickles-white text-black border border-ttickles-lightblue/60 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}

              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ttickles-darkblue text-white hover:bg-ttickles-darkblue/90 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : mode === "magic" ? (
                    "Send magic link"
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() =>
                    setMode((m) => (m === "password" ? "magic" : "password"))
                  }
                  className="mx-auto block text-sm text-ttickles-blue underline-offset-2 hover:underline"
                >
                  {mode === "password"
                    ? "Use magic link instead"
                    : "Use password instead"}
                </button>
                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-ttickles-blue underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="text-center text-sm">
                Don{"'"}t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-ttickles-blue underline-offset-2 hover:underline"
                >
                  Sign up
                </Link>
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-gray-400">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => SignInProvider("google")}
                  className="w-full justify-center gap-2 border-gray-200 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                >
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    width={18}
                    height={18}
                  />
                  <span>Google</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => SignInProvider("facebook")}
                  className="w-full justify-center gap-2 border-gray-200 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                >
                  <Image
                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                    alt="Facebook"
                    width={18}
                    height={18}
                  />
                  <span>Facebook</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;

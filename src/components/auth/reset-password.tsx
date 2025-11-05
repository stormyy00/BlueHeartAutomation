"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { requestPasswordReset } from "@/utils/auth-client";
import type { ErrorContext } from "better-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
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

    setLoading(true);
    await requestPasswordReset(
      { email, redirectTo: "/reset-password" },
      {
        onRequest: () => {
          setFormError(null);
          setSuccessMessage(null);
        },
        onSuccess: async () => {
          setLoading(false);
          setSuccessMessage("Password reset email sent!");
          // toast.success("Password reset email sent!");
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
        <Card className="border border-white/40 shadow-sm transition-shadow duration-300 hover:shadow-md">
          {successMessage ? (
            <CardContent className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <CheckCircle className="h-10 w-10 text-photo-green-300" />
              <h2 className="text-xl font-semibold text-photo-green-300">
                Check your email
              </h2>
              <p className="text-sm text-photo-stone-600 max-w-sm">
                We’ve sent password reset instructions to{" "}
                <span className="font-medium">{email}</span>. Follow the link in
                your inbox to reset your password.
              </p>
              <Button
                onClick={() => router.push("/signin")}
                className="bg-photo-green-300 text-photo-white-100 hover:bg-photo-green-400"
              >
                Return to Login
              </Button>
            </CardContent>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-center text-2xl font-semibold text-photo-green-300">
                  Reset your password
                </CardTitle>
                <p className="text-center text-sm text-muted-foreground">
                  Enter your email to receive password reset instructions.
                </p>
              </CardHeader>

              <CardContent className="space-y-5">
                <form
                  onSubmit={onSubmit}
                  className="space-y-4"
                  aria-busy={loading}
                >
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-photo-stone-400" />
                    <Input
                      id="email"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      className="pl-10 pr-10 bg-ttickles-white text-black border border-ttickles-lightblue/60 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                    />
                  </div>

                  {formError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-ttickles-darkblue text-white hover:bg-ttickles-darkblue/90 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send Password Reset Email"
                    )}
                  </Button>

                  {!successMessage && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-xs text-ttickles-blue underline-offset-2 hover:underline"
                      >
                        Back
                      </button>
                    </div>
                  )}
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;

"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  ShieldCheck,
  ImageIcon,
  RefreshCcw,
  MonitorSmartphone,
  Laptop,
  Globe,
  LogOut,
  Lock,
} from "lucide-react";
import { requestPasswordReset, signOut } from "@/utils/auth-client";
import { updateUserProfile } from "@/lib/actions/organizations";
import { Session, User } from "better-auth";

const Profile = ({
  session,
  orgs,
}: {
  session: { session: Session; user: User } | null;
  orgs: { id: string; name: string; role: string }[];
}) => {
  const user = session?.user;
  const [name, setName] = useState(user?.name ?? "");
  const [image, setImage] = useState(user?.image ?? "");
  const [saving, setSaving] = useState(false);

  const email = user?.email ?? "";
  const emailVerified = user?.emailVerified ?? false;

  const initials = useMemo(() => {
    const base = name || email || "U";
    return base
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join("");
  }, [name, email]);

  const fmt = (date?: Date) =>
    date
      ? new Date(date).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Unknown";

  const onSave = useCallback(async () => {
    try {
      setSaving(true);
      await updateUserProfile({ name, image });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }, [name, image]);

  const onSignOutAll = async () => {
    try {
      await fetch("/api/auth/signout-all", { method: "POST" });
      toast.success("All sessions have been signed out.");
    } catch {
      toast.error("Failed to sign out all sessions.");
    }
  };

  const onResetPassword = async () => {
    return await requestPasswordReset(
      { email, redirectTo: "/reset-password" },
      {
        onSuccess: () => {
          toast.success("Password reset link sent to your email.");
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-start w-11/12 m-8 gap-8">
      <div className="flex items-center justify-between w-full">
        <Label className="font-semibold text-3xl tracking-tight">Profile</Label>
        <Button onClick={() => signOut()} variant="outline">
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>

      <div className="flex w-full justify-between">
        <Card className="w-full shadow-sm border border-gray-100">
          <CardHeader>
            <CardTitle className="text-ttickles-blue">
              Identity
              <div className="flex justify-end w-full">
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="bg-ttickles-darkblue text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-[auto,1fr] gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20 ring-2 ring-ttickles-lightblue/50">
                <AvatarImage src={image || undefined} alt={name || "User"} />
                <AvatarFallback className="bg-ttickles-lightblue/20 text-ttickles-darkblue">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-2">
                <label
                  htmlFor="avatar"
                  className="cursor-pointer border rounded px-3 py-1 text-xs text-ttickles-darkblue border-ttickles-lightblue/60 hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    Change
                  </span>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        const resp = await fetch("/api/upload", {
                          method: "POST",
                          headers: {
                            "content-type": f.type,
                            "x-vercel-filename": f.name,
                          },
                          body: f,
                        });
                        if (!resp.ok) throw new Error("Upload failed");
                        const { url } = await resp.json();
                        setImage(url);
                        toast.success("Image uploaded!");
                      } catch {
                        toast.error("Failed to upload image.");
                      }
                    }}
                  />
                </label>
                <Button variant="ghost" size="sm" onClick={() => setImage("")}>
                  Remove
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    value={email}
                    readOnly
                    className="pl-10 bg-gray-50 text-gray-700"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  {emailVerified ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-orange-600 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 rotate-45" />
                      Not verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-sm border border-gray-100">
          <CardHeader>
            <CardTitle className="text-ttickles-blue">Organizations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {orgs.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                You are not part of any organization.
              </p>
            ) : (
              orgs.map(({ id, name, role }) => (
                <div
                  key={id}
                  className="flex justify-between items-center border border-ttickles-lightblue/60 rounded-md px-3 py-2 bg-gray-50/30"
                >
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-[11px] text-gray-500">ID: {id}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-600">
                    {role}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="w-full shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-ttickles-blue flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Reset your password</p>
            <p className="text-xs text-gray-500">
              Send a reset link to your registered email.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center"
            onClick={onResetPassword}
          >
            <RefreshCcw className="h-4 w-4 mr-2" /> Send reset link
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-ttickles-blue flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4" />
            Your Devices & Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Current session */}
          <div className="flex justify-between items-center rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <Laptop className="h-5 w-5 text-ttickles-blue" />
              <div>
                <p className="text-sm font-medium">This device</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {session?.session.ipAddress ?? "IP unknown"} • Active now
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>

          <div className="flex justify-between items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <MonitorSmartphone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">MacBook Pro • Chrome</p>
                <p className="text-xs text-gray-500">
                  Last active {fmt(session?.session?.updatedAt)}
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Revoke
            </Button>
          </div>

          <Separator />
          <div className="flex justify-end">
            <Button variant="destructive" size="sm" onClick={onSignOutAll}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out all sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

"use client";

import React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Recipients from "./newsletter/recipients/recipient-list";
import { OrganizationType } from "@/db/schema";

type Member = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
};

type ContactsProps = {
  members: Member[];
  organizationName: string;
  org: OrganizationType | null;
};

const Contacts = ({ members, organizationName, org }: ContactsProps) => {
  const [includeName, setIncludeName] = useState(true);
  const [includeEmail, setIncludeEmail] = useState(true);
  const [includeRole, setIncludeRole] = useState(false);
  const [includeOrganization, setIncludeOrganization] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [separator, setSeparator] = useState<string>(", ");

  const checkboxOptions = [
    {
      id: "name",
      label: "Name",
      checked: includeName,
      onChange: (v: unknown) => setIncludeName(Boolean(v)),
    },
    {
      id: "email",
      label: "Email",
      checked: includeEmail,
      onChange: (v: unknown) => setIncludeEmail(Boolean(v)),
    },
    {
      id: "organization",
      label: "Organization",
      checked: includeOrganization,
      onChange: (v: unknown) => setIncludeOrganization(Boolean(v)),
    },
    {
      id: "role",
      label: "Org Role",
      checked: includeRole,
      onChange: (v: unknown) => setIncludeRole(Boolean(v)),
    },
  ];

  const separatorOptions = [
    { value: ", ", label: "Comma" },
    { value: "\n", label: "New line" },
    { value: "; ", label: "Semicolon" },
    { value: " ", label: "Space" },
  ];

  const roles = useMemo(() => {
    const s = new Set<string>();
    members.forEach((m) => m.role && s.add(m.role));
    return Array.from(s.values());
  }, [members]);

  const filtered = useMemo(() => {
    return roleFilter === "all"
      ? members
      : members.filter(
          (m) => (m.role || "").toLowerCase() === roleFilter.toLowerCase(),
        );
  }, [members, roleFilter]);

  const formatted = useMemo(() => {
    return filtered
      .map((m) => {
        const parts: string[] = [];
        if (includeName && m.name) parts.push(m.name);
        if (includeEmail && m.email) parts.push(m.email);
        if (includeOrganization && organizationName)
          parts.push(organizationName);
        if (includeRole && m.role) parts.push(m.role);
        return parts.join(" ");
      })
      .filter(Boolean)
      .join(separator);
  }, [
    filtered,
    includeEmail,
    includeName,
    includeOrganization,
    includeRole,
    organizationName,
    separator,
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
    } catch {
      // Fallback for older browsers
      const temp = document.createElement("textarea");
      temp.value = formatted;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Label className="font-extrabold text-3xl">Contacts</Label>
      <div className="flex justify-between gap-4 w-full items-center p-4">
        {checkboxOptions.map(({ id, label, checked, onChange }) => (
          <div key={id} className="flex items-center gap-2">
            <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
            <Label htmlFor={id}>{label}</Label>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <Label>Filter by role</Label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Separator</Label>
          <Select value={separator} onValueChange={setSeparator}>
            <SelectTrigger>
              <SelectValue placeholder=", " />
            </SelectTrigger>
            <SelectContent>
              {separatorOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-end">
          <Button className="w-full" onClick={handleCopy} disabled={!formatted}>
            Copy to clipboard ({filtered.length})
          </Button>
        </div>
      </div>
      <Recipients org={org} />
    </div>
  );
};

export default Contacts;

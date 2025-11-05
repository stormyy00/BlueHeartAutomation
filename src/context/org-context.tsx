"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type OrgContextValue = {
  orgId: string | null;
  orgName: string | null;
  ready: boolean;
};

const OrgContext = createContext<OrgContextValue>({
  orgId: null,
  orgName: null,
  ready: false,
});

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function OrgProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolveOrg() {
      try {
        // Try sessionStorage mapping first
        if (typeof window !== "undefined") {
          const mapped = window.sessionStorage.getItem(`org-slug-${slug}`);
          if (mapped) {
            setOrgId(mapped);
          }
        }

        // Fetch user's organizations and resolve by slug or mapping
        const res = await fetch("/api/organizations");
        if (!res.ok) throw new Error("Failed to load organizations");
        const orgs = (await res.json()) as Array<{ id: string; name: string }>;

        // Prefer mapping match if present
        let found = orgs.find(
          (o) =>
            o.id ===
            (typeof window !== "undefined"
              ? window.sessionStorage.getItem(`org-slug-${slug}`)
              : ""),
        );
        if (!found) {
          found = orgs.find((o) => nameToSlug(o.name) === slug);
        }

        if (!cancelled) {
          if (found) {
            setOrgId(found.id);
            setOrgName(found.name);
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(`org-slug-${slug}`, found.id);
            }
          } else {
            setOrgId(null);
            setOrgName(null);
          }
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setOrgId(null);
          setOrgName(null);
          setReady(true);
        }
      }
    }

    resolveOrg();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const value = useMemo(
    () => ({ orgId, orgName, ready }),
    [orgId, orgName, ready],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  return useContext(OrgContext);
}

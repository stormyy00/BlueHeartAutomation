import {
  Users,
  Link,
  Mail,
  Users2,
  Clock,
  ChartArea,
  PictureInPicture,
  User2,
  Building2,
  Home,
  MailQuestion,
  MailPlus,
  Contact,
} from "lucide-react";

interface Tab {
  name: string;
  link: string;
  icon: JSX.Element;
  requiresOrg?: boolean;
  requiresOwner?: boolean;
  requiresAdmin?: boolean;
  requiresMember?: boolean;
  subtabs?: Tab[];
}

interface Section {
  label: string;
  tabs: Tab[];
}

interface Collapsible {
  expand: boolean;
  sections: Section[];
}

type Tabs = Record<string, Collapsible>;

// Function to generate navigation tabs with organization slug
export function getNavigationTabs(orgSlug: string): Tabs {
  return {
    user: {
      expand: true,
      sections: [
        {
          label: "Main",
          tabs: [
            {
              name: "Dashboard",
              link: `/user/${orgSlug}/`,
              icon: <Home />,
            },
            {
              name: "Campaigns",
              link: `/user/${orgSlug}/campaigns`,
              icon: <MailQuestion />,
            },
            {
              name: "Documents",
              link: `/user/${orgSlug}/documents`,
              icon: <Mail />,
            },
            {
              name: "Images",
              link: `/user/${orgSlug}/images`,
              icon: <PictureInPicture />,
              requiresOwner: true,
            },
            {
              name: "History",
              link: `/user/${orgSlug}/history`,
              icon: <Clock />,
            },
          ],
        },
        {
          label: "About",
          tabs: [
            {
              name: "My Organization",
              link: `/user/${orgSlug}/myorg`,
              icon: <Users2 />,
              requiresOrg: true,
              requiresMember: true,
            },
            {
              name: "Contacts",
              link: `/user/${orgSlug}/contacts`,
              icon: <Contact />,
              requiresMember: true,
            },
            // {
            //   name: "My Profile",
            //   link: `/user/${orgSlug}/profile`,
            //   icon: <ChartArea />,
            // },
          ],
        },
      ],
    },
    orgs: {
      expand: true,
      sections: [
        {
          label: "Management",
          tabs: [
            {
              name: "Dashboard",
              link: `/orgs/${orgSlug}/dashboard`,
              icon: <Home />,
            },
            {
              name: "Manage",
              link: `/orgs/${orgSlug}/manage`,
              icon: <Link />,
              requiresAdmin: true,
              requiresMember: true,
            },
            {
              name: "Members",
              link: `/orgs/${orgSlug}/members`,
              icon: <User2 />,
              requiresAdmin: true,
              requiresMember: true,
            },
            {
              name: "Invitations",
              link: `/orgs/${orgSlug}/invitations`,
              icon: <MailPlus />,
              requiresOwner: true,
              requiresAdmin: true,
              requiresMember: true,
            },
          ],
        },
        {
          label: "Tools",
          tabs: [
            {
              name: "Contacts",
              link: `/orgs/${orgSlug}/contacts`,
              icon: <Users size={20} />,
              requiresMember: true,
            },
            {
              name: "Email",
              link: `/orgs/${orgSlug}/email`,
              icon: <Mail />,
              requiresMember: true,
            },
          ],
        },
        {
          label: "About",
          tabs: [
            {
              name: "Profile",
              link: `/orgs/${orgSlug}/profile`,
              icon: <Building2 />,
              requiresMember: true,
            },
          ],
        },
      ],
    },
    admin: {
      expand: true,
      sections: [
        {
          label: "Management",
          tabs: [
            {
              name: "Manage",
              link: `/admin/${orgSlug}/manage`,
              icon: <Link />,
              requiresAdmin: true,
              requiresMember: true,
            },
          ],
        },
        {
          label: "Tools",
          tabs: [
            {
              name: "Newsletter",
              link: `/admin/${orgSlug}/newsletter`,
              icon: <Mail />,
              requiresAdmin: true,
              requiresMember: true,
            },
          ],
        },
        {
          label: "Reports",
          tabs: [
            {
              name: "Reports",
              link: `/admin/${orgSlug}/reports`,
              icon: <ChartArea />,
              requiresAdmin: true,
              requiresMember: true,
            },
          ],
        },
        {
          label: "About",
          tabs: [
            {
              name: "Profile",
              link: `/admin/${orgSlug}/profile`,
              icon: <Building2 />,
              requiresMember: true,
            },
          ],
        },
      ],
    },
  };
}

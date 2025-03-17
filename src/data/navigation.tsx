import {
  Users,
  Link,
  Mail,
  Users2,
  User,
  Building2,
  Clock,
  ChartArea,
} from "lucide-react";
interface Tab {
  name: string;
  link: string;
  icon: JSX.Element;
  requiresOrg?: boolean;
  requiresOwner?: boolean;
  subtabs?: Tab[];
}

interface Collapsible {
  expand: boolean;
  tabs: Tab[];
}
type Tabs = Record<string, Collapsible>;

export const TABS: Tabs = {
  admin: {
    expand: true,
    tabs: [
      //TODO: Needs to be updated
      {
        name: "Organizations",
        link: "/admin/orgs",
        icon: <Building2 />,
      },
      {
        name: "Users",
        link: "/admin/users",
        icon: <Users />,
      },
    ],
  },
  user: {
    expand: true,
    tabs: [
      {
        name: "Profile",
        link: "/user/profile",
        icon: <User />,
      },
      {
        name: "My Organization",
        link: "/orgs/@mine",
        icon: <Users2 />,
        requiresOrg: true,
      },
    ],
  },
  orgs: {
    expand: true,
    tabs: [
      {
        name: "Manage",
        link: "/orgs/@mine/manage",
        icon: <Link />,
        requiresOwner: true,
      },
      {
        name: "Newsletter",
        link: "/orgs/@mine/newsletter",
        icon: <Mail />,
        subtabs: [
          {
            name: "Recipients",
            link: "/orgs/@mine/newsletter/recipients",
            icon: <Users size={20} />,
          },
        ],
      },
      {
        name: "History",
        link: "/orgs/@mine/history",
        icon: <Clock />,
      },
      {
        name: "Analytics",
        link: "/orgs/@mine/analytics",
        icon: <ChartArea />,
      },
    ],
  },
};

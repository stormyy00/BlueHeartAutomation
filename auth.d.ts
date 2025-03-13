import { Role } from "@/data/types";
import "next-auth";
declare module "next-auth" {
  export interface User {
    uuid: string;
    id: string;
    email: string;
    role: Role;
    orgId: string;
  }

  export interface Session {
    user: User;
  }
}

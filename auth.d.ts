import "next-auth";
import { Role } from "shared";
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

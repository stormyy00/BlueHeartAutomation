// Note: User operations are handled by Better Auth session management
// This file is kept for compatibility but user data comes from the session

// export interface UserMetadata {
//   id: string;
//   email: string;
//   name?: string;
//   image?: string;
//   organizationId?: string;
//   role?: any;
// }

// User data is retrieved from Better Auth session, not from Express server
// export const getUser = async (
//   id: string,
// ): Promise<UserMetadata | undefined> => {
//   // User data comes from Better Auth session, not from Express server
//   console.warn(
//     "getUser: User data should be retrieved from Better Auth session",
//   );
//   return undefined;
// };

// User updates are handled by Better Auth, not through Express server
// export const updateUser = async (metadata: UserMetadata) => {
//   // User updates are handled by Better Auth session management
//   console.warn("updateUser: User updates should be handled by Better Auth");
//   return false;
// };

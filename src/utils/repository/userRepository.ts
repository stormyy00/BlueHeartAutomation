import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { User as UserMetadata } from "next-auth";
import { db } from "../firebase";

export const getUser = async (
  id: string,
): Promise<UserMetadata | undefined> => {
  const result = await getDoc(doc(collection(db, "users"), id));
  if (!result.data()) return undefined;
  return result.data() as unknown as UserMetadata;
};

// should not need this anymore since next-auth auto creates

// export const createUser = async (userId: string) => {
//   const session = await getServerSession(options)
//   if (!session || !session.user) return false;
//   if (await getUser(userId)) return false;
//   const uuid = crypto.randomUUID();
//   const metadata = {
//     email: user.,
//     id: uuid,
//     clerkId: user.id,
//     name: user.username ?? "",
//     role: "user",
//     orgId: "",
//     icon: user.imageUrl,
//   };
//   await setDoc(doc(collection(db, "users"), uuid), metadata);
//   await clerk.users.updateUser(userId, {
//     publicMetadata: metadata,
//   });
//   return true;
// };

export const updateUser = async (metadata: UserMetadata) => {
  if (!(await getUser(metadata.id))) return false;
  await updateDoc(doc(collection(db, "users"), metadata.id), { ...metadata });
  return true;
};

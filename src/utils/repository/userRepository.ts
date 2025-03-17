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

export const updateUser = async (metadata: UserMetadata) => {
  if (!(await getUser(metadata.id))) return false;
  await updateDoc(doc(collection(db, "users"), metadata.id), { ...metadata });
  return true;
};

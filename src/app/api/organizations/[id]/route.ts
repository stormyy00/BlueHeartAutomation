// import { NextRequest, NextResponse } from "next/server";
// import { authenticate } from "@/utils/auth";
// import { db } from "@/db";
// import { organizations, organizationMembers } from "@/db/schema";
// import { eq, and } from "drizzle-orm";

export const GET = async () => {};
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const { uid, message, auth } = await authenticate();
//     if (auth !== 200 || !uid) {
//       return NextResponse.json(
//         { error: message || "Unauthorized" },
//         { status: 401 },
//       );
//     }

//     // Check if user is member of organization
//     const member = await db
//       .select()
//       .from(organizationMembers)
//       .where(
//         and(
//           eq(organizationMembers.organizationId, params.id),
//           eq(organizationMembers.userId, uid),
//         ),
//       )
//       .limit(1);

//     if (member.length === 0) {
//       return NextResponse.json(
//         { error: "Unauthorized to access this organization" },
//         { status: 403 },
//       );
//     }

//     const [org] = await db
//       .select()
//       .from(organizations)
//       .where(eq(organizations.id, params.id))
//       .limit(1);

//     if (!org) {
//       return NextResponse.json(
//         { error: "Organization not found" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(org);
//   } catch (error) {
//     console.error("Error fetching organization:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch organization" },
//       { status: 500 },
//     );
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const { uid, message, auth } = await authenticate();
//     if (auth !== 200 || !uid) {
//       return NextResponse.json(
//         { error: message || "Unauthorized" },
//         { status: 401 },
//       );
//     }

//     const body = await request.json();
//     const { name, description, icon } = body;

//     // Check if user is admin
//     const member = await db
//       .select()
//       .from(organizationMembers)
//       .where(
//         and(
//           eq(organizationMembers.organizationId, params.id),
//           eq(organizationMembers.userId, uid),
//         ),
//       )
//       .limit(1);

//     if (member.length === 0 || member[0].role !== "admin") {
//       return NextResponse.json(
//         { error: "Unauthorized to update this organization" },
//         { status: 403 },
//       );
//     }

//     const [updatedOrg] = await db
//       .update(organizations)
//       .set({
//         name,
//         description,
//         logo: icon,
//         updatedAt: new Date(),
//       })
//       .where(eq(organizations.id, params.id))
//       .returning();

//     return NextResponse.json(updatedOrg);
//   } catch (error) {
//     console.error("Error updating organization:", error);
//     return NextResponse.json(
//       { error: "Failed to update organization" },
//       { status: 500 },
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   const { uid, message, auth } = await authenticate();
//   if (auth !== 200 || !uid) {
//     return NextResponse.json(
//       { error: message || "Unauthorized" },
//       { status: 401 },
//     );
//   }
//   try {
//     // Check if user is owner
//     const [org] = await db
//       .select()
//       .from(organizations)
//       .where(eq(organizations.id, params.id))
//       .limit(1);

//     if (!org) {
//       return NextResponse.json(
//         { error: "Organization not found" },
//         { status: 404 },
//       );
//     }

//     if (org.ownerId !== uid) {
//       return NextResponse.json(
//         { error: "Only the owner can delete the organization" },
//         { status: 403 },
//       );
//     }

//     await db.delete(organizations).where(eq(organizations.id, params.id));

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting organization:", error);
//     return NextResponse.json(
//       { error: "Failed to delete organization" },
//       { status: 500 },
//     );
//   }
// }

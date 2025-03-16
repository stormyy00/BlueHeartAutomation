import type { FileRouter } from "uploadthing/next";
import { createRouteHandler, createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  editorUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    text: { maxFileSize: "1MB", maxFileCount: 1 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
    audio: { maxFileSize: "8MB", maxFileCount: 1 },
    blob: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // You can add authentication checks here
      // For now, we're allowing unauthenticated uploads
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file);

      // Return the file data needed by client
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        key: file.key,
        url: file.url,
        // Add any additional metadata you need here
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createRouteHandler } from "uploadthing/next";

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
      return {}; // Authentication logic if needed
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file);
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        key: file.key,
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

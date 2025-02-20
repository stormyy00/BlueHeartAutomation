import type { FileRouter } from "uploadthing/next";

import { createRouteHandler, createUploadthing } from "uploadthing/next";

const f = createUploadthing();

const ourFileRouter = {
  editorUploader: f(["image", "text", "blob", "pdf", "video", "audio"])
    .middleware((): Record<string, never> => {
      return {}; // Explicitly typed empty object
    })
    .onUploadComplete(({ file }) => {
      console.log("Upload complete:", file);

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        key: file.key,
        customId: file.customId,
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

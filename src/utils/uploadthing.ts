// import { uploadFiles } from "./uploadfile";

// // This is the uploadFn that Novel needs - it handles both image drag/drop and paste
// export const uploadFn = async (file: File) => {
//   // Create a blob URL for immediate preview (useful for development or if upload fails)
//   const previewUrl = URL.createObjectURL(file);

//   try {
//     // Use the uploadFiles function from uploadthing
//     const [res] = await uploadFiles("editorUploader", {
//       files: [file],
//       onUploadProgress: ({ progress }) => {
//         console.log(`Upload progress: ${Math.min(progress, 100)}%`);
//       },
//     });

//     // Return the object in the format Novel expects
//     return {
//       src: res.url,
//       alt: file.name || "Uploaded image",
//     };
//   } catch (error) {
//     console.error("Upload failed:", error);

//     // For development or fallback, return the blob URL
//     // In production, you might want to show an error instead
//     return {
//       src: previewUrl,
//       alt: file.name || "Local image (upload failed)",
//     };
//   }
// };

// // Helper to get file type from file object
// export const getFileType = (
//   file: File,
// ): "image" | "pdf" | "video" | "audio" | "other" => {
//   if (file.type.startsWith("image/")) return "image";
//   if (file.type === "application/pdf") return "pdf";
//   if (file.type.startsWith("video/")) return "video";
//   if (file.type.startsWith("audio/")) return "audio";
//   return "other";
// };

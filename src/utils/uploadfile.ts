import * as React from "react";
import type { OurFileRouter } from "@/app/api/uploadthing/route";
import type {
  ClientUploadedFileData,
  UploadFilesOptions,
} from "uploadthing/types";
import { generateReactHelpers } from "@uploadthing/react";
import { toast } from "sonner";
import { z } from "zod";
// eslint-disable-next-line  @typescript-eslint/no-empty-object-type
export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}
interface UseUploadFileProps
  extends Pick<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    UploadFilesOptions<any>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export const { uploadFiles, useUploadThing } =
  generateReactHelpers<OurFileRouter>();

export function useUploadFile(
  {
    onUploadComplete,
    onUploadError,
    ...props
  }: UseUploadFileProps = {} as UseUploadFileProps,
) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadThing(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      const res = await uploadFiles("editorUploader", {
        ...props,
        files: [file],
        onUploadProgress: ({ progress }) => {
          setProgress(Math.min(progress, 100));
          props.onUploadProgress?.({
            file,
            progress,
            loaded: 0, // Replace with actual loaded value if available
            delta: 0, // Replace with actual delta value if available
            totalLoaded: 0, // Replace with actual totalLoaded value if available
            totalProgress: progress, // Replace with actual totalProgress value if available
          });
        },
      });

      setUploadedFile(res[0]);
      onUploadComplete?.(res[0]);
      return res[0];
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      const message =
        errorMessage.length > 0
          ? errorMessage
          : "Something went wrong, please try again later.";

      toast.error(message);
      onUploadError?.(error);

      // Mock upload for development or when authentication fails
      console.warn("Upload failed, using local file as fallback");
      const mockUploadedFile = {
        key: `mock-key-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      } as UploadedFile;

      // Simulate upload progress for better UX
      let progress = 0;
      const simulateProgress = async () => {
        while (progress < 100) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          progress += 5;
          setProgress(Math.min(progress, 100));
        }
      };

      await simulateProgress();
      setUploadedFile(mockUploadedFile);
      return mockUploadedFile;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile: uploadThing,
    uploadingFile,
  };
}

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}

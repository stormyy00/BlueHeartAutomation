// "use client";

// import { useChat } from "@ai-sdk/react";

// export default function Page() {
//   const { messages, input, handleInputChange, handleSubmit } = useChat(
//     { api: "/api/ai/command",
//         onFinish: (message, { usage, finishReason }) => {
//           console.log('Finished streaming message:', message);
//           console.log('Token usage:', usage);
//           console.log('Finish reason:', finishReason);
//         },
//        }
//   );

//   return (
//     <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
//       {messages.length > 0
//         ? messages.map((m) => (
//             <div key={m.id} className="whitespace-pre-wrap">
//               {m.role === "user" ? "User: " : "Assistant: "}
//               {m.content}
//             </div>
//           ))
//         : null}

//       <form onSubmit={handleSubmit}>
//         <input
//           className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
//           value={input}
//           placeholder="Say something..."
//           onChange={handleInputChange}
//         />
//       </form>
//     </div>
//   );
// }

// import EditorNovel from "../../components/novel/editror";

// const handleChange = (value: string) => {
//   console.log("Updated", value);
// };

// "use client";

// import { UploadButton } from "@uploadthing/react";
// import { useState } from "react";
export default function page() {
  // const [uploadedFiles, setUploadedFiles] = useState([]);

  return (
    <div className="flex justify-center py-10 bg-black">
      {/* <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Upload Files</h1>

          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              setUploadedFiles(res);
              alert("Upload Completed");
            }}
            onUploadError={(error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Uploaded Files:</h2>
              <ul className="space-y-2">
                {uploadedFiles.map((file) => (
                  <li key={file.fileKey} className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>{file.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main> */}
    </div>
  );
}

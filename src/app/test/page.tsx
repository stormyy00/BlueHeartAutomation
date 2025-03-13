"use client";

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

import EditorNovel from "../../components/novel/editror";

// const handleChange = (value: string) => {
//   console.log("Updated", value);
// };

export default function page() {
  return (
    <div className="flex justify-center py-10 bg-black">
      <EditorNovel
        onChange={(updatedData) =>
          console.log("Editor updated FRRRRRR:", updatedData)
        }
        data={"hello bums"}
      />
    </div>
  );
}

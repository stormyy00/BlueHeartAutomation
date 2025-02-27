import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";
import { readFileSync } from 'fs';


// ollama run llama3.2
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log(body);

    const trainingData = readFileSync('../../../data/training.txt', 'utf-8');
    const response = await ollama.chat({
      model: "llama3.2",
      messages: [
        {
          role: "system",
          content:
            `You are an editor and you are tasked to to compile all these events into a newsletter in order to inform the user in an automated email provide only the newsletter response. Seperate newsletters are seperated by END OF NEWSLETTER. Newsletters on either side of this statement are seperate.",
             Here are some examples of past newsletters:

            ${trainingData}

            generate a newsletter in the same style as these examples only return newsletter content. Start each newsletter with the greeting Dear Bluehearts Subscribers,.
           
            `

        },
        { role: "user", content: JSON.stringify(body) },
      ],
    });
    console.log(response.message.content);

    console.log("test", response.message);
    const content = response.message.content;

    return NextResponse.json({ items: content }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

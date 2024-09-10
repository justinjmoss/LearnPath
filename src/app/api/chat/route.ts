import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    // Log the received messages (optional)
    console.log("Received messages:", messages);

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
    });

    // Use OpenAIStream to handle the streaming response
    const stream = OpenAIStream(response);

    // Return a StreamingTextResponse, which is compatible with the AI SDK
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("API route error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
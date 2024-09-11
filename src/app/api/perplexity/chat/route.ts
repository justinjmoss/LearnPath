import { NextResponse } from 'next/server';
import { StreamingTextResponse, Message } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const perplexityApiKey = process.env.PERPLEXITY_API_KEY;

  if (!perplexityApiKey) {
    return NextResponse.json({ error: 'Perplexity API key is not set' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${perplexityApiKey}`,
      },
      body: JSON.stringify({
        model: 'pplx-7b-online',
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    // Convert the response to a ReadableStream
    const stream = response.body;
    return new StreamingTextResponse(stream as ReadableStream);
  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
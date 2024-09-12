import { NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';

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
        model: 'llama-3-sonar-large-32k-online',
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    // Create a ReadableStream to parse the response data
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonData = line.slice(6);
              if (jsonData === '[DONE]') {
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(jsonData);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  controller.enqueue(content);
                }
              } catch (error) {
                console.error('Error parsing JSON:', error, 'Raw data:', jsonData);
              }
            }
          }
        }

        controller.close();
      },
    });

    // Return a StreamingTextResponse
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
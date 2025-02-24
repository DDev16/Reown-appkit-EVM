// app/lib/openai.ts
import OpenAI from 'openai';

// Define ContentSection type and export it
export interface ContentSection {
  title: string;
  content: string;
}

// Define ChatMessage type
type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Explicitly use NEXT_PUBLIC_OPENAI_API_KEY
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY?.trim();

// Create a function that returns the OpenAI instance or null
function createOpenAIClient(): OpenAI | null {
  if (!apiKey) {
    console.error('CRITICAL: OpenAI API key is missing from NEXT_PUBLIC_OPENAI_API_KEY');
    return null;
  }
  return new OpenAI({ apiKey });
}

// Create the OpenAI client
const openaiClient = createOpenAIClient();

export async function summarizeContent(content: string): Promise<string> {
  // Check if client exists
  if (!openaiClient) {
    return "OpenAI client not initialized due to missing API key.";
  }

  try {
    // Additional check for content length
    if (content.length < 10) {
      return "Content is too short to summarize.";
    }

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        {
          role: "system",
          content: "You are a content summarizer. Create a clear, informative summary of the provided text, maintaining the key information and main points."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return completion.choices[0].message.content || "Unable to summarize content.";
  } catch (error) {
    console.error('Summarization error:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    return "Content summarization failed.";
  }
}

// Export the generateResponse function
export async function generateResponse(
  messages: ChatMessage[], 
  websiteContent: ContentSection[]
): Promise<string> {
  // Check if client exists
  if (!openaiClient) {
    return "OpenAI client not initialized. Unable to generate response.";
  }

  try {
    // Create a context from the website content
    const contextContent = websiteContent
      .map(section => `${section.title}:\n${section.content}`)
      .join('\n\n');

    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are a precise AI assistant for DeFi Bull World. 
      
      Key Guidelines:
      - Provide exact information from the context
      - If specific details are missing, clearly state that
      - Be concise and direct
      - Prioritize accuracy over elaboration

      Available Context:
      ${contextContent}

      When answering questions:
      - Quote exact values and details from the context
      - If a specific detail is not in the context, say "Specific information not found"
      - Format your response clearly and professionally`
    };

    const combinedMessages = [systemMessage, ...messages];

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: combinedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.3,
      max_tokens: 500,
    });

    return completion.choices[0].message.content || "I apologize, but I was unable to generate a precise response.";
  } catch (error) {
    console.error('Response generation error:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    return "Unable to retrieve the specific information at this time.";
  }
}

// Export the client creation function
export const openai = {
  client: openaiClient,
  createClient: createOpenAIClient
};
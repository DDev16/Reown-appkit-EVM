// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateResponse, type ContentSection } from '@/lib/openai';
import { getWebsiteContent, getChatSession, createChatSession, addMessage } from '@/lib/db';
import type { WebsiteContent, ChatSession, Message as DBMessage } from '@/lib/types';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  messages: ChatMessage[];
  sessionId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest;
    const { messages, sessionId: existingSessionId } = body;

    // Get or create chat session
    const sessionId: string = existingSessionId ?? (await createChatSession()).id;

    // Get website content
    const websiteContent: WebsiteContent[] = await getWebsiteContent();
    
    // Format content for OpenAI
    const formattedContent: ContentSection[] = websiteContent.map((content: WebsiteContent) => ({
      title: content.title,
      content: content.content
    }));

    // Generate response
    const userMessage = messages[messages.length - 1].content;
    await addMessage(sessionId, userMessage, 'user');

    const aiResponse = await generateResponse(messages, formattedContent);
    await addMessage(sessionId, aiResponse, 'assistant');

    // Get updated chat history
    const session = await getChatSession(sessionId);

    return NextResponse.json({ 
      message: aiResponse,
      role: 'assistant',
      sessionId,
      history: session?.messages || []
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// app/lib/types.ts
export type WebsiteContent = {
    id: string;
    title: string;
    content: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type ChatSession = {
    id: string;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
  };
  
  export type Message = {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt: Date;
    sessionId: string;
  };
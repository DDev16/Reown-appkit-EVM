// app/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getWebsiteContent() {
  return prisma.websiteContent.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

export async function updateWebsiteContent(content: { title: string; content: string; url: string }[]) {
  // First, delete all existing content
  await prisma.websiteContent.deleteMany();
  
  // Then insert new content
  return prisma.websiteContent.createMany({
    data: content
  });
}

export async function createChatSession() {
  return prisma.chatSession.create({
    data: {}
  });
}

export async function getChatSession(sessionId: string) {
  return prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

export async function addMessage(sessionId: string, content: string, role: 'user' | 'assistant') {
  return prisma.message.create({
    data: {
      content,
      role,
      sessionId
    }
  });
}


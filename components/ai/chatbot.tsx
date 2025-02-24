// app/components/ai/chatbot.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, X } from 'lucide-react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Welcome to DeFi Bull World! How can I assist you today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Try to restore session from localStorage
        const savedSessionId = localStorage.getItem('chatSessionId');
        if (savedSessionId) {
            setSessionId(savedSessionId);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    sessionId
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            // Save session ID
            if (data.sessionId && !sessionId) {
                setSessionId(data.sessionId);
                localStorage.setItem('chatSessionId', data.sessionId);
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {/* Chat Icon */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 animate-pulse"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-96 h-[600px] bg-black/90 backdrop-blur-sm rounded-lg shadow-xl flex flex-col border border-red-500/20">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-red-500/20">
                        <h2 className="text-white font-bold">DeFi Bull World Chat</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-red-500"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-2 flex flex-col">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex items-start mb-2 ${message.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                    }`}
                            >
                                {message.role === 'assistant' && (
                                    <Bot className="w-6 h-6 mr-2 text-red-500 flex-shrink-0" />
                                )}
                                <div
                                    className={`p-3 rounded-lg max-w-[80%] ${message.role === 'user'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-800 text-white'
                                        }`}
                                >
                                    {message.content}
                                </div>
                                {message.role === 'user' && (
                                    <User className="w-6 h-6 ml-2 text-gray-400 flex-shrink-0" />
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-red-500/20 flex items-center">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-grow bg-gray-800 text-white p-2 rounded-lg mr-2 resize-none"
                            placeholder="Type your message..."
                            rows={2}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
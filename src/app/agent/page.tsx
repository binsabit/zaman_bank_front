'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/navigation/Header';
import BottomNav from '@/components/navigation/BottomNav';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { Message, MessageType } from '@/types/chat';
import { chatApi } from '@/lib/chatApi';

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialText, setInitialText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Initialize with default message if loading fails
        initializeChat();
      }
    } else {
      // Initialize with default message if no history exists
      initializeChat();
    }
  }, []);

  // Check for pre-fill text from URL parameters
  useEffect(() => {
    const textParam = searchParams.get('text');
    if (textParam) {
      setInitialText(textParam);
    }
  }, [searchParams]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const initializeChat = () => {
    const initialMessage: Message = {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your financial assistant. How can I help you today?',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  };

  const resetChat = () => {
    localStorage.removeItem('chat-messages');
    localStorage.removeItem('chat-files');
    initializeChat();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, type: MessageType = 'text', file?: File) => {
    try {
      // Validate input
      if (!content.trim() && !file) {
        console.warn('No content or file provided');
        return;
      }

      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: content || (file ? `📎 ${file.name}` : ''),
        messageType: type,
        file,
        timestamp: new Date(),
      };

      // Add user message to chat
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      // Prepare content for API call
      let processedContent = content;
      const fileToSend = file;

      // Handle different input types
      switch (type) {
        case 'audio':
          if (file) {
            try {
              const transcribedText = await chatApi.transcribeAudio(file);
              processedContent = transcribedText || 'Voice message received';

              // Update user message with transcribed content
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === userMessage.id
                    ? { ...msg, content: `🎤 ${transcribedText || 'Voice message'}` }
                    : msg
                )
              );
            } catch (transcriptionError) {
              console.error('Audio transcription failed:', transcriptionError);
              processedContent = 'Voice message (transcription unavailable)';
            }
          }
          break;

        case 'file':
          if (file) {
            const fileTypeIcon = file.type.startsWith('image/') ? '🖼️' :
                                file.type === 'application/pdf' ? '📄' : '📁';
            processedContent = content || `${fileTypeIcon} ${file.name}`;
          }
          break;

        case 'text':
        default:
          // Text is already processed
          break;
      }

      // Send to remote API
      const response = await chatApi.sendMessage(processedContent, type, fileToSend);

      // Create AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content || 'I received your message but couldn\'t generate a response.',
        messageType: response.type || 'text',
        image: response.image,
        actions: response.actions,
        timestamp: new Date(),
      };

      // Add AI response to chat
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);

      // Create error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the problem persists.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        title="AI Assistant"
        showNotifications={false}
        showReset={true}
        onReset={resetChat}
      />

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onActionClick={(action) => handleSendMessage(action, 'text')}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 max-w-xs shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#2D9A86] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#2D9A86] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#2D9A86] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-20 bg-gray-50 pt-2 pb-2">
        <div className="max-w-md mx-auto px-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            initialText={initialText}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
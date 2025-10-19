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
      content: 'Привет! Я ваш финансовый помощник. Как я могу вам помочь сегодня?',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  };

  const resetChat = async () => {
    console.log('Reset button clicked');

    try {
      // Call backend reset endpoint
      console.log('Calling chatApi.resetChat()...');
      await chatApi.resetChat();
      console.log('Backend reset successful');

      // Set initial message after successful reset
      const initialMessage: Message = {
        id: '1',
        type: 'ai',
        content: 'Привет! Я ваш финансовый помощник. Как я могу вам помочь сегодня?',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      console.log('Reset completed successfully');
    } catch (error) {
      console.error('Error resetting chat in agent page:', error);

      // Fallback to local reset if backend fails
      console.log('Falling back to local reset...');
      localStorage.removeItem('chat-messages');
      localStorage.removeItem('chat-files');
      const initialMessage: Message = {
        id: '1',
        type: 'ai',
        content: 'Привет! Я ваш финансовый помощник. Как я могу вам помочь сегодня?',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      console.log('Local reset completed');
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Try multiple methods to ensure scrolling works
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });

      // Also try scrolling the parent container
      const chatContainer = messagesEndRef.current.closest('.chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages]);

  useEffect(() => {
    // Scroll when loading state changes
    if (!isLoading) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [isLoading]);

  // Force scroll after async operations
  const forceScrollToBottom = () => {
    // Multiple attempts to ensure scrolling works with large content
    requestAnimationFrame(() => {
      scrollToBottom();
    });
    setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }, 100);
    setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }, 300);
    setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }, 500);
  };

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
      console.log('Setting isLoading to true');
      setIsLoading(true);

      // Force scroll after adding user message
      forceScrollToBottom();

      // Prepare content for API call
      let processedContent = content;
      const fileToSend = file;

      // Handle different input types
      switch (type) {
        case 'audio':
          if (file) {
            try {
              // For audio, we'll let the backend handle transcription
              // Just update the display content for now
              processedContent = 'Голосовое сообщение отправлено';

              // Update user message with audio indicator
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === userMessage.id
                    ? { ...msg, content: `🎤 Голосовое сообщение` }
                    : msg
                )
              );

              // Force scroll after audio message update
              forceScrollToBottom();
            } catch (audioError) {
              console.error('Audio processing failed:', audioError);
              processedContent = 'Голосовое сообщение (обработка недоступна)';
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
      function utf8ToBase64(str: string): string  {
        // 1. Encode the UTF-8 string to a percent-encoded string
        const utf8EncodedStr = encodeURIComponent(str);

        // 2. Escape/unescape to create a "binary string"
        // (where each character's code point is a byte value)
        let binaryString = unescape(utf8EncodedStr);

        // 3. Use btoa() to convert the binary string to Base64
        return btoa(binaryString);
      }

      // Force scroll after AI response
      forceScrollToBottom();

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

      // Force scroll after error message
      forceScrollToBottom();
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen h-dvh flex flex-col" style={{background: 'var(--background)'}}>
      <div className="flex-shrink-0 sticky top-0 z-50" style={{background: 'var(--background)'}}>
        <Header
          title="ИИ Помощник"
          showNotifications={false}
          showReset={true}
          onReset={resetChat}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent min-h-0 chat-container" style={{
          maxHeight: 'calc(100vh - 200px)',
          height: '100%'
        }}>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onActionClick={(action) => handleSendMessage(action, 'text')}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 max-w-xs shadow-lg"
                   style={{
                     background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
                     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                   }}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full animate-bounce"
                       style={{background: 'var(--primary)'}}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce"
                       style={{background: 'var(--primary)', animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce"
                       style={{background: 'var(--primary)', animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed left-0 right-0 z-20"
           style={{background: 'var(--background)', bottom: '72px'}}>
        <div className="w-full">
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
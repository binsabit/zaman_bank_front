'use client';

import { Message } from '@/types/chat';
import { Bot, User, FileImage, FileText, Mic, Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  onActionClick?: (action: string) => void;
}

export default function ChatMessage({ message, onActionClick }: ChatMessageProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isUser = message.type === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const renderFilePreview = () => {
    if (!message.file || !message.file.type) return null;

    const isImage = message.file.type.startsWith('image/');

    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          {isImage ? (
            <FileImage className="w-4 h-4 text-gray-500" />
          ) : (
            <FileText className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-sm text-gray-600 truncate">
            {message.file.name}
          </span>
        </div>
        {isImage && (
          <img
            src={URL.createObjectURL(message.file)}
            alt="Uploaded"
            className="mt-2 max-w-full h-auto rounded-lg max-h-48 object-cover"
          />
        )}
      </div>
    );
  };

  // Audio playback handlers
  const handleAudioPlay = async () => {
    if (!audioRef.current || !message.file) return;

    try {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        // Create audio URL from file if not already created
        if (!audioRef.current.src && message.file) {
          const audioUrl = URL.createObjectURL(message.file);
          audioRef.current.src = audioUrl;
        }

        await audioRef.current.play();
        setIsAudioPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsAudioPlaying(false);
      setAudioCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [message.file]);

  const renderAudioMessage = () => {
    if (message.messageType !== 'audio') return null;

    const progress = audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0;

    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg"
           style={{background: 'var(--border)'}}>
        <button
          onClick={handleAudioPlay}
          className="p-2 text-white rounded-full transition-all duration-200 hover:scale-110"
          style={{background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'}}
        >
          {isAudioPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
        <div className="flex-1">
          <div className="w-full h-2 rounded-full cursor-pointer" style={{background: 'var(--border)'}}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'
              }}
            ></div>
          </div>
        </div>
        <span className="text-sm" style={{color: 'var(--text-secondary)'}}>
          {formatAudioTime(audioDuration)}
        </span>
        <audio ref={audioRef} />
      </div>
    );
  };

  const renderImageContent = () => {
    if (!message.image) return null;

    return (
      <div className="mt-2">
        <img
          src={message.image}
          alt="AI Response"
          className="max-w-full h-auto rounded-lg max-h-64 object-cover"
        />
      </div>
    );
  };

  const renderActions = () => {
    if (!message.actions || message.actions.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {message.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => onActionClick?.(action)}
              className="px-3 py-1 text-sm rounded-full transition-all duration-200 hover:scale-105"
              style={{
                background: 'var(--accent)',
                color: 'var(--background)'
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderHighlightedText = (text: string) => {
    // Simple highlighting for numbers that look like amounts
    const highlightedText = text.replace(
      /\$[\d,]+\.?\d*/g,
      '<span style="background: var(--accent); color: var(--background); padding: 2px 4px; border-radius: 4px; font-weight: 600;">$&</span>'
    );

    return (
      <div
        dangerouslySetInnerHTML={{ __html: highlightedText }}
        className="whitespace-pre-wrap break-words chat-content"
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          wordBreak: 'break-word'
        }}
      />
    );
  };

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex space-x-2 w-full max-w-[85%]", isUser ? "flex-row-reverse space-x-reverse" : "")}>
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser
            ? ""
            : ""
        )}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'
            : 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
          color: 'white',
          border: isUser ? 'none' : '1px solid var(--border)'
        }}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <div className={cn(
            "rounded-2xl px-4 py-3 shadow-lg break-words overflow-hidden",
            isUser ? "" : ""
          )}
          style={{
            background: isUser
              ? 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'
              : 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
            color: isUser ? 'white' : 'var(--foreground)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto'
          }}>
            {message.messageType === 'audio' ? (
              renderAudioMessage()
            ) : (
              <div className="text-sm break-words overflow-wrap-anywhere word-break-break-all chat-content" style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>
                {isUser ? (
                  <span className="whitespace-pre-wrap break-words">{message.content}</span>
                ) : (
                  renderHighlightedText(message.content)
                )}
              </div>
            )}

            {renderFilePreview()}
            {renderImageContent()}
            {!isUser && renderActions()}
          </div>

          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-1",
            isUser ? "text-right" : "text-left"
          )}
          style={{color: 'var(--text-secondary)'}}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}
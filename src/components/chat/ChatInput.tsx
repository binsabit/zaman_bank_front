'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { MessageType } from '@/types/chat';

interface ChatInputProps {
  onSendMessage: (content: string, type: MessageType, file?: File) => void;
  disabled?: boolean;
  initialText?: string;
}

export default function ChatInput({ onSendMessage, disabled, initialText }: ChatInputProps) {
  const [message, setMessage] = useState(initialText || '');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update message when initialText changes
  useEffect(() => {
    if (initialText) {
      setMessage(initialText);
      // Focus on input and position cursor at the end
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(initialText.length, initialText.length);
      }
    }
  }, [initialText]);

  // No auto-resize needed for input
  // useEffect(() => {
  //   const input = inputRef.current;
  //   if (textarea) {
  //     textarea.style.height = 'auto';
  //     textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  //   }
  // }, [message]);

  const handleSend = () => {
    if ((!message.trim() && !attachedFile) || disabled) return;

    if (attachedFile) {
      onSendMessage(message || `Attached: ${attachedFile.name}`, 'file', attachedFile);
      setAttachedFile(null);
    } else {
      onSendMessage(message, 'text');
    }

    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, {
          type: 'audio/wav'
        });
        onSendMessage('Voice message', 'audio', audioFile);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setAttachedFile(file);
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [isHoldingRecord, setIsHoldingRecord] = useState(false);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hold-to-record functionality
  const handleMouseDown = async () => {
    if (disabled) return;
    setIsHoldingRecord(true);
    recordingTimeoutRef.current = setTimeout(async () => {
      await startRecording();
    }, 200); // Small delay to distinguish from tap
  };

  const handleMouseUp = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    if (isHoldingRecord) {
      setIsHoldingRecord(false);
      if (isRecording) {
        stopRecording();
      } else if ((!message.trim() && !attachedFile)) {
        // Do nothing if no message
      } else {
        // Send message if there's content
        handleSend();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  };

  return (
    <div className="px-4 py-3"
         style={{
           background: 'var(--card-bg)',
           borderTop: '1px solid var(--border)'
         }}>
      {/* File preview and recording status (if any) in a single horizontal line */}
      {(attachedFile || isRecording) && (
        <div className="mb-3 flex items-center justify-between p-3 rounded-lg"
             style={{
               background: isRecording
                 ? 'rgba(239, 68, 68, 0.1)'
                 : 'var(--border)',
               border: isRecording ? '1px solid rgba(239, 68, 68, 0.3)' : 'none'
             }}>
          {attachedFile && !isRecording && (
            <>
              <div className="flex items-center space-x-2">
                {attachedFile.type.startsWith('image/') ? (
                  <ImageIcon className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
                ) : (
                  <Paperclip className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
                )}
                <span className="text-sm truncate max-w-48" style={{color: 'var(--foreground)'}}>
                  {attachedFile.name}
                </span>
                <span className="text-xs" style={{color: 'var(--text-secondary)'}}>
                  ({(attachedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                onClick={removeAttachedFile}
                className="p-1 rounded-full transition-colors hover:scale-110"
                style={{background: 'var(--border)'}}
              >
                <X className="w-4 h-4" style={{color: 'var(--text-secondary)'}} />
              </button>
            </>
          )}

          {isRecording && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-400">Recording...</span>
              </div>
              <span className="text-sm text-red-400 font-mono">
                {formatRecordingTime(recordingTime)}
              </span>
            </>
          )}
        </div>
      )}

      {/* Single horizontal input line */}
      <div className="flex items-center space-x-3">
        {/* File Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isRecording}
          title="Attach file"
          className="p-3 rounded-lg transition-all duration-200 hover:scale-105 w-12 h-12 flex items-center justify-center shadow-sm hover:shadow-md flex-shrink-0"
          style={{
            background: disabled || isRecording
              ? 'var(--border)'
              : 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)',
            color: disabled || isRecording ? 'var(--text-secondary)' : 'white'
          }}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "🎤 Recording..." : "💬 Type a message..."}
            disabled={disabled || isRecording}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200"
            style={{
              height: '48px',
              background: 'var(--card-bg)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              textAlign: message.trim() ? 'left' : 'center'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 15px rgba(255, 107, 53, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Send/Record Button */}
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={disabled}
          title={isRecording ? "Release to send" : message.trim() || attachedFile ? "Send message" : "Hold to record"}
          className="p-3 rounded-lg transition-all duration-200 hover:scale-105 w-12 h-12 flex items-center justify-center shadow-md hover:shadow-lg flex-shrink-0"
          style={{
            background: isRecording
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
              : (message.trim() || attachedFile)
              ? 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'
              : 'linear-gradient(135deg, var(--primary-blue) 0%, #60A5FA 100%)',
            color: 'white'
          }}
        >
          {isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (message.trim() || attachedFile) ? (
            <Send className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.txt,.csv"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update message when initialText changes
  useEffect(() => {
    if (initialText) {
      setMessage(initialText);
      // Focus on textarea and position cursor at the end
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(initialText.length, initialText.length);
      }
    }
  }, [initialText]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

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

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {/* Attached File Preview */}
      {attachedFile && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {attachedFile.type.startsWith('image/') ? (
              <ImageIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <Paperclip className="w-5 h-5 text-gray-500" />
            )}
            <span className="text-sm text-gray-700 truncate max-w-48">
              {attachedFile.name}
            </span>
            <span className="text-xs text-gray-500">
              ({(attachedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            onClick={removeAttachedFile}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="mb-3 p-3 bg-red-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-700">Recording...</span>
          </div>
          <span className="text-sm text-red-700 font-mono">
            {formatRecordingTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-2">
        {/* File Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isRecording}
          title="Attach file"
          className={cn(
            "p-3 rounded-full transition-all duration-200 hover:scale-105 w-12 h-12 flex items-center justify-center self-end",
            disabled || isRecording
              ? "text-gray-400 cursor-not-allowed bg-gray-100"
              : "text-[#2D9A86] hover:bg-[#2D9A86] hover:text-white shadow-sm hover:shadow-md"
          )}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "🎤 Recording..." : "💬 Type a message..."}
            disabled={disabled || isRecording}
            rows={1}
            className={cn(
              "w-full px-4 py-3 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-[#2D9A86] focus:ring-2 focus:ring-[#2D9A86]/20 transition-all duration-200 overflow-hidden",
              (disabled || isRecording) && "bg-gray-50 cursor-not-allowed",
              !disabled && !isRecording && "hover:border-[#2D9A86]/50"
            )}
            style={{
              minHeight: '48px',
              lineHeight: '1.5'
            }}
          />
        </div>

        {/* Voice Recording Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          title={isRecording ? "Stop recording" : "Start voice recording"}
          className={cn(
            "p-3 rounded-full transition-all duration-200 hover:scale-105 w-12 h-12 flex items-center justify-center self-end",
            isRecording
              ? "bg-red-500 text-white hover:bg-red-600 shadow-md animate-pulse"
              : disabled
              ? "text-gray-400 cursor-not-allowed bg-gray-100"
              : "text-[#2D9A86] hover:bg-[#2D9A86] hover:text-white shadow-sm hover:shadow-md"
          )}
        >
          {isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && !attachedFile) || disabled || isRecording}
          title="Send message"
          className={cn(
            "p-3 rounded-full transition-all duration-200 hover:scale-105 w-12 h-12 flex items-center justify-center self-end",
            (!message.trim() && !attachedFile) || disabled || isRecording
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#2D9A86] text-white hover:bg-[#1e6b5c] shadow-md hover:shadow-lg"
          )}
        >
          <Send className="w-5 h-5" />
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
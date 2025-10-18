export type MessageType = 'text' | 'audio' | 'image' | 'file';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  messageType?: MessageType;
  file?: File;
  image?: string;
  actions?: string[];
  timestamp: Date;
}

export interface ChatResponse {
  content: string;
  type?: MessageType;
  image?: string;
  actions?: string[];
}
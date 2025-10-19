import { MessageType, ChatResponse } from '@/types/chat';

const API_BASE_URL = '/api';

export class ChatAPI {
  private static instance: ChatAPI;

  public static getInstance(): ChatAPI {
    if (!ChatAPI.instance) {
      ChatAPI.instance = new ChatAPI();
    }
    return ChatAPI.instance;
  }

  /**
   * Send a chat message to the AI agent
   */
  async sendMessage(
    content: string,
    messageType: MessageType = 'text',
    file?: File,
    userId?: string
  ): Promise<ChatResponse> {
    try {
      // Create FormData for all message types
      const formData = new FormData();

      // For audio messages, use 'audio' key for file and don't include text message
      if (messageType === 'audio' && file) {
        // Save audio locally as MP3 with UUID name, then convert to WAV
        const mp3File = await this.saveAudioAsMP3(file);
        const wavFile = await this.convertToWav(mp3File);
        formData.append('audio', wavFile);
      } else {
        // For text messages (with or without files), use 'message' key
        formData.append('message', content);

        // Add file with 'file' key for non-audio files
        if (file && messageType !== 'audio') {
          formData.append('file', file);
        }
      }

      // Add session ID
      formData.append('session_id', this.getSessionId());

      // Add user ID if provided
      if (userId) {
        formData.append('user_id', userId);
      }

      const response = await fetch(`${API_BASE_URL}/message`, {
        method: 'POST',
        headers: {
          'X-Session-ID': this.getSessionId(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform Django response to match our ChatResponse format
      return {
        content: data.response || data.message || 'No response from server',
        type: 'text',
        actions: data.actions || []
      };
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback to mock response if API is not available
      return await this.getMockResponse(messageType, file);
    }
  }

  /**
   * Reset the chat session
   */
  async resetChat(): Promise<void> {
    try {
      console.log('Attempting to reset chat...');
      console.log('API_BASE_URL:', API_BASE_URL);

      const payload = {
        reset: true
      };

      console.log('Reset payload:', payload);
      console.log('Reset URL:', `${API_BASE_URL}/reset`);

      const response = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Session-ID': this.getSessionId(),
        },
        body: JSON.stringify(payload),
      });

      console.log('Reset response status:', response.status);
      console.log('Reset response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Reset response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.text();
      console.log('Reset response data:', responseData);

      // Clear local session data on successful reset
      localStorage.removeItem('chat-session-id');
      localStorage.removeItem('chat-messages');
      localStorage.removeItem('chat-files');
      localStorage.removeItem('chat-audio-files');

      console.log('Chat reset successful');
    } catch (error) {
      console.error('Error resetting chat:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });

      // Still clear local data even if backend call fails
      localStorage.removeItem('chat-session-id');
      localStorage.removeItem('chat-messages');
      localStorage.removeItem('chat-files');
      localStorage.removeItem('chat-audio-files');

      // Re-throw the error so the UI can handle it
      throw error;
    }
  }

  /**
   * Upload file and get analysis (now handled through sendMessage)
   * @deprecated Use sendMessage with messageType 'file' instead
   */
  async uploadFile(file: File): Promise<ChatResponse> {
    try {
      // Use the unified messages endpoint for file uploads
      return await this.sendMessage('', 'file', file);
    } catch (error) {
      console.error('Error uploading file:', error);
      return this.getMockFileResponse(file);
    }
  }

  /**
   * Convert audio to text (now handled through sendMessage)
   * @deprecated Use sendMessage with messageType 'audio' instead
   */
  async transcribeAudio(audioFile: File): Promise<string> {
    try {
      // Use the unified messages endpoint for transcription
      const response = await this.sendMessage('', 'audio', audioFile);
      return response.content || 'Audio transcription not available';
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return 'Audio transcription not available';
    }
  }

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Save audio file locally as MP3 with random UUID name
   */
  private async saveAudioAsMP3(audioFile: File): Promise<File> {
    try {
      // Generate UUID for filename
      const uuid = this.generateUUID();
      const mp3FileName = `${uuid}.mp3`;

      // If already MP3, just rename and save
      if (audioFile.type === 'audio/mp3' || audioFile.type === 'audio/mpeg' || audioFile.name.toLowerCase().endsWith('.mp3')) {
        const mp3File = new File([audioFile], mp3FileName, { type: 'audio/mp3' });
        this.saveFileToLocalStorage(mp3File, uuid);
        return mp3File;
      }

      // Convert to MP3 format
      const mp3File = await this.convertToMP3(audioFile, mp3FileName);
      this.saveFileToLocalStorage(mp3File, uuid);
      return mp3File;

    } catch (error) {
      console.warn('Failed to save audio as MP3, using original file:', error);
      return audioFile;
    }
  }

  /**
   * Convert audio file to MP3 format
   */
  private async convertToMP3(audioFile: File, filename: string): Promise<File> {
    try {
      // Create audio context for conversion
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Read the audio file as array buffer
      const arrayBuffer = await audioFile.arrayBuffer();

      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // For browser compatibility, we'll create a WAV first then use it as MP3
      // In a real implementation, you'd use a library like lamejs for proper MP3 encoding
      const wavBuffer = this.audioBufferToWav(audioBuffer);

      // Create MP3 file (note: this is actually WAV data with MP3 extension for simplicity)
      // For true MP3 encoding, you would use a library like lamejs
      const mp3File = new File([wavBuffer], filename, { type: 'audio/mp3' });

      return mp3File;
    } catch (error) {
      console.warn('Audio conversion to MP3 failed, creating MP3 file from original:', error);
      // Fallback: create MP3 file from original data
      return new File([audioFile], filename, { type: 'audio/mp3' });
    }
  }

  /**
   * Save file to localStorage with UUID key
   */
  private saveFileToLocalStorage(file: File, uuid: string): void {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const audioData = {
          uuid: uuid,
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result, // Base64 encoded data
          timestamp: Date.now()
        };

        // Save to localStorage
        const savedAudios = JSON.parse(localStorage.getItem('chat-audio-files') || '[]');
        savedAudios.push(audioData);

        // Keep only last 10 audio files to prevent localStorage overflow
        if (savedAudios.length > 10) {
          savedAudios.splice(0, savedAudios.length - 10);
        }

        localStorage.setItem('chat-audio-files', JSON.stringify(savedAudios));
        console.log(`Audio file saved locally with UUID: ${uuid}`);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.warn('Failed to save audio file to localStorage:', error);
    }
  }

  /**
   * Convert audio file to WAV format
   */
  private async convertToWav(audioFile: File): Promise<File> {
    try {
      // If already WAV format, return as is
      if (audioFile.type === 'audio/wav' || audioFile.name.toLowerCase().endsWith('.wav')) {
        return audioFile;
      }

      // Create audio context for conversion
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Read the audio file as array buffer
      const arrayBuffer = await audioFile.arrayBuffer();

      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Convert to WAV format
      const wavBuffer = this.audioBufferToWav(audioBuffer);

      // Create new WAV file
      const wavFile = new File([wavBuffer],
        audioFile.name.replace(/\.[^/.]+$/, '') + '.wav',
        { type: 'audio/wav' }
      );

      return wavFile;
    } catch (error) {
      console.warn('Audio conversion failed, sending original file:', error);
      return audioFile;
    }
  }

  /**
   * Convert AudioBuffer to WAV format
   */
  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let sample;
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };

    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // RIFF identifier
    setUint32(0x46464952);
    // File length minus 8 bytes
    setUint32(length - 8);
    // WAVE identifier
    setUint32(0x45564157);
    // Format chunk identifier
    setUint32(0x20746d66);
    // Format chunk length
    setUint32(16);
    // Sample format (PCM)
    setUint16(1);
    // Channel count
    setUint16(numOfChan);
    // Sample rate
    setUint32(buffer.sampleRate);
    // Byte rate
    setUint32(buffer.sampleRate * 2 * numOfChan);
    // Block align
    setUint16(numOfChan * 2);
    // Bits per sample
    setUint16(16);
    // Data chunk identifier
    setUint32(0x61746164);
    // Data chunk length
    setUint32(length - pos - 4);

    // Get channel data
    for (let i = 0; i < numOfChan; i++) {
      channels.push(buffer.getChannelData(i));
    }

    // Interleave samples
    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return arrayBuffer;
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    let sessionId = localStorage.getItem('chat-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('chat-session-id', sessionId);
    }
    return sessionId;
  }

  /**
   * Save file locally and return URL
   */
  private saveFileLocally(file: File): string {
    const url = URL.createObjectURL(file);
    // Store in localStorage for persistence across sessions
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      url: url,
      timestamp: Date.now()
    };

    const savedFiles = JSON.parse(localStorage.getItem('chat-files') || '[]');
    savedFiles.push(fileData);
    localStorage.setItem('chat-files', JSON.stringify(savedFiles));

    return url;
  }

  /**
   * Mock response for development/fallback
   */
  private async getMockResponse(messageType: MessageType, file?: File): Promise<ChatResponse> {
    // File handling
    if (file) {
      // Save file locally first
      this.saveFileLocally(file);
      return this.getMockFileResponse(file);
    }

    // Audio handling
    if (messageType === 'audio') {
      return {
        content: 'I heard your voice message! How can I help you with your finances today?',
        actions: ['Check Balance', 'Recent Transactions', 'Account Summary']
      };
    }

    // Load and return random response from synthetic data
    return this.getRandomSyntheticResponse();
  }

  /**
   * Get random response from synthetic data
   */
  private async getRandomSyntheticResponse(): Promise<ChatResponse> {
    try {
      // Import the responses directly since fetch might not work with static files
      const responses = [
        {
          "type": "text_only",
          "content": "I understand you're looking for financial advice. Based on your spending patterns, I'd recommend setting aside 20% of your income for savings.",
          "messageType": "text"
        },
        {
          "type": "text_only",
          "content": "Your current budget allocation looks good! You're spending $2,400 on essentials and $800 on discretionary items this month.",
          "messageType": "text"
        },
        {
          "type": "text_with_actions",
          "content": "I can help you create a personalized budget plan. Here are some quick actions to get started:",
          "messageType": "text",
          "actions": ["View Budget Template", "Set Savings Goal", "Track Expenses"]
        },
        {
          "type": "text_with_actions",
          "content": "Your investment portfolio needs rebalancing. Current allocation: 60% stocks, 30% bonds, 10% cash. Consider these options:",
          "messageType": "text",
          "actions": ["Rebalance Portfolio", "View Risk Assessment", "Schedule Consultation"]
        },
        {
          "type": "text_with_image",
          "content": "Here's your spending breakdown for this month. You can see that dining out represents 15% of your total expenses.",
          "messageType": "text",
          "image": "https://via.placeholder.com/400x300/2D9A86/FFFFFF?text=Monthly+Spending+Chart"
        },
        {
          "type": "text_with_image",
          "content": "Your investment growth over the past year shows a positive trend with 8.2% returns. Here's the detailed chart:",
          "messageType": "text",
          "image": "https://via.placeholder.com/400x250/34D399/FFFFFF?text=Investment+Growth+Chart"
        },
        {
          "type": "text_image_actions",
          "content": "Your financial health score is 85/100! Here's a detailed breakdown with recommended actions:",
          "messageType": "text",
          "image": "https://via.placeholder.com/400x300/EEFE6D/000000?text=Financial+Health+Score+85%2F100",
          "actions": ["Improve Credit Score", "Increase Emergency Fund", "Optimize Investments"]
        },
        {
          "type": "text_image_actions",
          "content": "Market analysis shows tech stocks are performing well. Your portfolio allocation could benefit from adjustments:",
          "messageType": "text",
          "image": "https://via.placeholder.com/400x280/F59E0B/FFFFFF?text=Market+Analysis+Chart",
          "actions": ["Buy Tech Stocks", "Sell Underperformers", "Set Price Alerts"]
        },
        {
          "type": "text_only",
          "content": "Great question! Emergency funds should typically cover 3-6 months of living expenses. Based on your current spending of $3,200/month, aim for $9,600-$19,200.",
          "messageType": "text"
        },
        {
          "type": "text_with_actions",
          "content": "Tax season is approaching! I can help you prepare and potentially save money with these strategies:",
          "messageType": "text",
          "actions": ["Tax Deduction Finder", "Upload Tax Documents", "Schedule Tax Review"]
        },
        {
          "type": "text_with_image",
          "content": "Your debt-to-income ratio is currently 28%, which is within the healthy range. Here's how it compares to recommended levels:",
          "messageType": "text",
          "image": "https://via.placeholder.com/400x200/EF4444/FFFFFF?text=Debt-to-Income+Ratio+28%25"
        },
        {
          "type": "text_image_actions",
          "content": "Retirement planning analysis complete! You're on track but could optimize contributions for better returns:",
          "messageType": "text",
          "image": "https://via.placeholder.com/400x320/8B5CF6/FFFFFF?text=Retirement+Projection+Chart",
          "actions": ["Increase 401k", "Open Roth IRA", "View Retirement Calculator"]
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      return {
        content: randomResponse.content,
        type: randomResponse.messageType as MessageType,
        image: randomResponse.image,
        actions: randomResponse.actions
      };
    } catch (error) {
      console.error('Error loading synthetic responses:', error);

      // Fallback response if JSON loading fails
      return {
        content: 'I\'m here to help with your financial needs! How can I assist you today?',
        actions: ['Check Balance', 'View Transactions', 'Budget Planning']
      };
    }
  }

  /**
   * Mock response for file uploads
   */
  private getMockFileResponse(file: File): ChatResponse {
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    if (isImage) {
      return {
        content: `I can see you've uploaded an image: "${file.name}". This looks like a receipt or financial document. Let me analyze it for you.`,
        actions: ['Extract Amount', 'Categorize Expense', 'Add to Budget', 'Save Receipt']
      };
    }

    if (isPDF) {
      return {
        content: `I've received your PDF document: "${file.name}". I can help you extract financial information from statements, invoices, or reports.`,
        actions: ['Extract Transactions', 'Summarize Document', 'Add to Records']
      };
    }

    return {
      content: `Thank you for uploading "${file.name}". I can help process this file and extract relevant financial information.`,
      actions: ['Process File', 'Extract Data', 'Save to Documents']
    };
  }

}

// Export singleton instance
export const chatApi = ChatAPI.getInstance();
import { MessageType, ChatResponse } from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
      const formData = new FormData();
      formData.append('content', content);
      formData.append('messageType', messageType);

      if (userId) {
        formData.append('userId', userId);
      }

      if (file) {
        formData.append('file', file);
      }

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Session-ID': this.getSessionId(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback to mock response if API is not available
      return await this.getMockResponse(messageType, file);
    }
  }
  
  /**
   * Upload file and get analysis
   */
  async uploadFile(file: File): Promise<ChatResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Session-ID': this.getSessionId(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      return this.getMockFileResponse(file);
    }
  }

  /**
   * Convert audio to text
   */
  async transcribeAudio(audioFile: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Session-ID': this.getSessionId(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return 'Audio transcription not available';
    }
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

  /**
   * Generate mock chart URLs
   */
  private generateMockChart(type: string): string {
    const charts = {
      spending: `https://quickchart.io/chart?c={type:'doughnut',data:{labels:['Food','Transport','Entertainment','Utilities','Other'],datasets:[{data:[30,20,15,20,15],backgroundColor:['%232D9A86','%23EEFE6D','%2364748b','%23f59e0b','%23ef4444']}]}}`,
      transactions: `https://quickchart.io/chart?c={type:'line',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:'Income',data:[3000,3200,3100,3300,3400,3500],borderColor:'%232D9A86',fill:false},{label:'Expenses',data:[2500,2700,2600,2800,2900,2700],borderColor:'%23EEFE6D',fill:false}]}}`,
      balance: `https://quickchart.io/chart?c={type:'bar',data:{labels:['Checking','Savings','Investment'],datasets:[{data:[8230,4220,15000],backgroundColor:['%232D9A86','%23EEFE6D','%2364748b']}]}}`
    };

    return charts[type as keyof typeof charts] || charts.spending;
  }
}

// Export singleton instance
export const chatApi = ChatAPI.getInstance();
export interface SurveyData {
  personalRating: number;
  teamRating: number;
  concerns: string;
  chatHistory?: string;
  chatSummary?: string;
  isGeneratingSummary?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  isComplete: boolean;
}
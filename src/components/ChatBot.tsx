'use client'

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, SurveyData } from '@/types';

interface ChatBotProps {
  surveyData: SurveyData;
  onComplete: (chatHistory: string, summary: string) => void;
}

export default function ChatBot({ surveyData, onComplete }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize conversation
    const initMessage: ChatMessage = {
      role: 'assistant',
      content: `จากคะแนนที่คุณให้ (ความต้องการส่วนตัว: ${surveyData.personalRating}/5, ความพร้อมของทีม: ${surveyData.teamRating}/5) ผมอยากเข้าใจความกังวลของคุณเพิ่มเติม อะไรที่ทำให้คุณรู้สึกกังวลเกี่ยวกับการเปลี่ยนแปลงนี้?`
    };
    setMessages([initMessage]);
  }, [surveyData]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          surveyData,
          exchangeCount: exchangeCount + 1
        })
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = { role: 'assistant', content: data.message };
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      setExchangeCount(prev => prev + 1);

      // Note: onComplete is now only called when Pass button is clicked
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateChatHistory = (messages: ChatMessage[]): string => {
    return messages.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`).join('\n\n');
  };

  const generateSummary = async (messages: ChatMessage[]): Promise<string> => {
    setIsSummarizing(true);
    
    try {
      // Skip the initial AI greeting message
      const conversationMessages = messages.slice(1);
      
      if (conversationMessages.length === 0) {
        return "มีความกังวลเรื่อง Slack แต่ยังไม่ได้เล่าละเอียด";
      }

      // Try to generate AI summary with full conversation context
      try {
        console.log('Sending conversation to summarize API:', conversationMessages);
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversation: conversationMessages })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Received summary:', data.summary);
          return data.summary;
        } else {
          console.log('API response not ok:', response.status);
        }
      } catch (error) {
        console.log('AI summary failed, using fallback:', error);
      }

      // Fallback: Create manual summary from user messages only
      const userMessages = conversationMessages.filter(m => m.role === 'user').map(m => m.content);
      if (userMessages.length === 1) {
        return `กังวลเรื่อง: ${userMessages[0]}`;
      }
      
      return `กังวลหลายเรื่อง เช่น: ${userMessages.join(', ')}`;
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          พูดคุยเรื่องความกังวล
        </h3>
        <p className="text-lg md:text-xl text-gray-600 font-semibold">
          แบ่งปันความคิดของคุณ
        </p>
      </div>
      
      <div className="bg-gray-50 rounded-3xl p-6 md:p-8 min-h-96 max-h-[28rem] md:max-h-[32rem] overflow-y-auto">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-sm md:max-w-md px-6 py-4 md:px-8 md:py-5 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-orange-400 text-white shadow-lg'
                    : 'bg-white text-gray-700 shadow-md border border-gray-100'
                }`}
              >
                <p className="text-base md:text-lg leading-relaxed font-medium">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-6 py-4 md:px-8 md:py-5 rounded-2xl shadow-md border border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 px-6 py-4 md:px-8 md:py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 text-base md:text-lg font-medium"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="w-14 h-14 md:w-16 md:h-16 bg-orange-400 text-white rounded-full hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-6 md:h-6">
              <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${
                  exchangeCount >= step ? 'bg-orange-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {exchangeCount >= 3 && (
            <button
              onClick={async () => {
                const chatHistory = generateChatHistory(messages);
                const summary = await generateSummary(messages);
                onComplete(chatHistory, summary);
              }}
              disabled={isSummarizing}
              className="px-12 py-4 md:px-16 md:py-5 bg-gray-200 text-gray-700 rounded-full text-lg md:text-xl font-bold hover:bg-gray-300 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSummarizing ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span>กำลังสรุป...</span>
                </div>
              ) : (
                'เสร็จสิ้น'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
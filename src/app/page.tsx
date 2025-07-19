'use client'

import { useState } from 'react';
import RatingScale from '@/components/RatingScale';
import ChatBot from '@/components/ChatBot';
import { SurveyData } from '@/types';

export default function Home() {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    personalRating: 0,
    teamRating: 0,
    concerns: ''
  });
  const [currentStep, setCurrentStep] = useState<'survey' | 'chat' | 'complete'>('survey');
  const [showSubmit, setShowSubmit] = useState(false);

  const handleConcernsClick = () => {
    if (surveyData.personalRating > 0 && surveyData.teamRating > 0) {
      setCurrentStep('chat');
    }
  };

  const handleChatComplete = async (chatHistory: string, summary: string) => {
    // Set loading state first
    setSurveyData(prev => ({ 
      ...prev, 
      concerns: chatHistory,
      isGeneratingSummary: true
    }));
    setCurrentStep('survey');
    
    // Generate summary (this will update the preview)
    setSurveyData(prev => ({ 
      ...prev, 
      chatSummary: summary,
      isGeneratingSummary: false
    }));
    setShowSubmit(true);
  };


  const submitToGoogleForms = async () => {
    const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSehVs7xAVEYRYy2jX0klWY-22Pc7M0sN14vPzr3SolT5H0O2A/formResponse';
    
    const formData = new FormData();
    formData.append('entry.621446036', surveyData.personalRating.toString());
    formData.append('entry.1650073458', surveyData.teamRating.toString());
    formData.append('entry.674544202', surveyData.concerns);
    formData.append('entry.1902844599', surveyData.chatSummary || '');

    try {
      // Submit to Google Forms in background
      await fetch(baseUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
    } catch (error) {
      console.log('Form submitted (CORS expected)');
    }
    
    // Stay in our UI and show completion
    setCurrentStep('complete');
  };

  const canProceedToChat = surveyData.personalRating > 0 && surveyData.teamRating > 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-6 py-12">
        
        {currentStep === 'survey' && (
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-light text-gray-900">
                การเปลี่ยนไปใช้ Slack
              </h1>
              <p className="text-gray-500 text-sm">
                ความคิดเห็นของคุณมีความสำคัญ
              </p>
            </div>

            <RatingScale
              question="คุณต้องการเปลี่ยนจาก Line มาใช้ Slack หรือไม่?"
              value={surveyData.personalRating}
              onChange={(value) => setSurveyData(prev => ({ ...prev, personalRating: value }))}
            />
            
            <RatingScale
              question="ทีมของคุณพร้อมสำหรับการเปลี่ยนแปลงนี้แค่ไหน?"
              value={surveyData.teamRating}
              onChange={(value) => setSurveyData(prev => ({ ...prev, teamRating: value }))}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-light text-gray-900 text-center">
                ข้อกังวลหรือคำถาม
              </h3>
              <div
                onClick={handleConcernsClick}
                className={`w-full p-6 border rounded-3xl transition-all duration-300 ${
                  canProceedToChat 
                    ? 'border-orange-200 bg-orange-50 cursor-pointer hover:border-orange-300 hover:bg-orange-100' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <p className={`text-center text-sm ${
                  canProceedToChat ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  {canProceedToChat 
                    ? "คลิกเพื่อพูดคุย" 
                    : "กรุณาตอบคำถามข้างต้นก่อน"}
                </p>
              </div>
            </div>

            {surveyData.chatHistory && (
              <div className="space-y-4">
                <h3 className="text-lg font-light text-gray-900 text-center">
                  สรุปความกังวล
                </h3>
                <div className="w-full p-6 border border-gray-200 rounded-3xl bg-gray-50">
                  {surveyData.isGeneratingSummary ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <p className="text-sm text-gray-500">กำลังสรุปให้...</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {surveyData.chatSummary || "ยังไม่มีสรุป"}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {showSubmit && (
              <div className="text-center mt-8">
                <button
                  onClick={submitToGoogleForms}
                  className="px-12 py-4 bg-orange-400 text-white rounded-full font-light hover:bg-orange-500 transition-colors"
                >
                  ส่งแบบสำรวจ
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'chat' && (
          <div className="space-y-8">
            <ChatBot
              surveyData={surveyData}
              onComplete={handleChatComplete}
            />
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="text-green-600 text-3xl">✓</div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-gray-900">
                ขอบคุณ
              </h2>
              <p className="text-gray-500 text-sm">
                ได้รับข้อมูลเรียบร้อยแล้ว
              </p>
            </div>
          </div>
        )}

        {currentStep !== 'complete' && (
          <div className="text-center mt-12">
            <div className="flex justify-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${currentStep === 'survey' ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
              <div className={`w-2 h-2 rounded-full ${currentStep === 'chat' ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
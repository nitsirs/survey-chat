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
      <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
        
        {currentStep === 'survey' && (
          <div className="space-y-16">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                การเปลี่ยนไปใช้ Slack
              </h1>
              <p className="text-gray-600 text-xl md:text-2xl font-semibold">
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

            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
                ข้อกังวลหรือคำถาม
              </h3>
              <div
                onClick={handleConcernsClick}
                className={`w-full p-8 md:p-10 border-2 rounded-3xl transition-all duration-300 ${
                  canProceedToChat 
                    ? 'border-orange-300 bg-orange-50 cursor-pointer hover:border-orange-400 hover:bg-orange-100' 
                    : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <p className={`text-center text-xl md:text-2xl font-bold ${
                  canProceedToChat ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  {canProceedToChat 
                    ? "คลิกเพื่อพูดคุย" 
                    : "กรุณาตอบคำถามข้างต้นก่อน"}
                </p>
              </div>
            </div>

            {surveyData.chatHistory && (
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
                  สรุปความกังวล
                </h3>
                <div className="w-full p-8 md:p-10 border-2 border-gray-300 rounded-3xl bg-gray-50">
                  {surveyData.isGeneratingSummary ? (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex space-x-2">
                        <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <p className="text-lg md:text-xl font-semibold text-gray-600">กำลังสรุปให้...</p>
                    </div>
                  ) : (
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                      {surveyData.chatSummary || "ยังไม่มีสรุป"}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {showSubmit && (
              <div className="text-center mt-12">
                <button
                  onClick={submitToGoogleForms}
                  className="px-16 py-6 md:px-20 md:py-8 bg-orange-400 text-white rounded-full text-xl md:text-2xl font-bold hover:bg-orange-500 transition-colors shadow-lg"
                >
                  ส่งแบบสำรวจ
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'chat' && (
          <div className="space-y-8">
            <div className="text-center mb-4">
              <button
                onClick={() => setCurrentStep('survey')}
                className="text-gray-500 hover:text-gray-700 text-lg font-semibold"
              >
                ← กลับ
              </button>
            </div>
            <ChatBot
              surveyData={surveyData}
              onComplete={handleChatComplete}
            />
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center space-y-12">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="text-green-600 text-6xl md:text-7xl font-bold">✓</div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                ขอบคุณ
              </h2>
              <p className="text-gray-600 text-xl md:text-2xl font-semibold">
                ได้รับข้อมูลเรียบร้อยแล้ว
              </p>
            </div>
          </div>
        )}

        {currentStep !== 'complete' && (
          <div className="text-center mt-16">
            <div className="flex justify-center space-x-4">
              <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${currentStep === 'survey' ? 'bg-orange-400' : 'bg-gray-300'}`}></div>
              <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${currentStep === 'chat' ? 'bg-orange-400' : 'bg-gray-300'}`}></div>
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-300"></div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
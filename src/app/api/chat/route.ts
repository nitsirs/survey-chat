import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  let exchangeCount = 1; // Default fallback
  
  try {
    const { messages, surveyData, exchangeCount: reqExchangeCount } = await request.json();
    exchangeCount = reqExchangeCount;

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key_here')) {
      // Fallback responses when OpenAI is not configured
      const fallbackResponses = [
        "เข้าใจความกังวลของคุณ คุณสามารถอธิบายเพิ่มเติมได้ไหมว่าอะไรที่ทำให้คุณรู้สึกแบบนี้?",
        "นั่นเป็นความกังวลที่เข้าใจได้ คุณคิดว่าจะส่งผลกระทบต่อการทำงานอย่างไร?",
        "ขอบคุณที่แบ่งปันความคิดเห็น มีอะไรอื่นที่คุณต้องการพูดคุยเพิ่มเติมหรือไม่? [COMPLETE]"
      ];
      
      const responseIndex = Math.min(exchangeCount - 1, fallbackResponses.length - 1);
      const message = fallbackResponses[responseIndex];
      const isComplete = message.includes('[COMPLETE]') || exchangeCount >= 3;
      
      return NextResponse.json({
        message: message.replace('[COMPLETE]', '').trim(),
        isComplete
      });
    }

    const systemPrompt = `คุณเป็นนักจิตวิทยาองค์กรที่รับฟังเรื่องการเปลี่ยนจาก Line ไป Slack

คะแนนของผู้ใช้: ความต้องการ ${surveyData.personalRating}/5, ความพร้อมทีม ${surveyData.teamRating}/5

วิธีการสนทนา:
- ตอบสั้นๆ กระชับ (1-2 ประโยค)
- ถามคำถามติดตามเพื่อเข้าใจเหตุผล
- แสดงความเข้าใจ รับฟังอย่างตั้งใจ
- ใช้ภาษาไทยแบบมืออาชีพ
- นี่คือครั้งที่ ${exchangeCount}/3

หากครบ 3 ครั้งให้จบด้วย "[COMPLETE]"`;

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-5) // Keep last 5 messages for context
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages as any,
      max_tokens: 200,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'เข้าใจ คุณสามารถอธิบายเพิ่มเติมได้ไหม?';
    const isComplete = assistantMessage.includes('[COMPLETE]') || exchangeCount >= 3;
    
    // Remove the completion marker from the message
    const cleanMessage = assistantMessage.replace('[COMPLETE]', '').trim();

    return NextResponse.json({
      message: cleanMessage,
      isComplete
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Fallback response on any error
    const fallbackMessage = exchangeCount >= 3 
      ? "ขอบคุณที่แบ่งปันความคิดเห็น"
      : "เข้าใจ คุณสามารถอธิบายเพิ่มเติมได้ไหม?";
    
    return NextResponse.json({
      message: fallbackMessage,
      isComplete: exchangeCount >= 3
    });
  }
}
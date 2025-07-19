import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { conversation, concerns } = await request.json();
    console.log('Summarize API received:', { conversation, concerns });

    // Handle both old format (concerns) and new format (conversation)
    const isOldFormat = concerns && !conversation;
    console.log('Using old format:', isOldFormat);
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key_here')) {
      // Fallback summary when OpenAI is not configured
      if (isOldFormat) {
        return NextResponse.json({
          summary: concerns.length === 1 
            ? `ความกังวลหลัก: ${concerns[0]}`
            : `ผู้ใช้แสดงความกังวลหลายประการเกี่ยวกับการเปลี่ยนจาก Line ไป Slack: ${concerns.join(', ')}`
        });
      }
      
      const userMessages = conversation.filter((m: any) => m.role === 'user').map((m: any) => m.content);
      return NextResponse.json({
        summary: `ผู้ใช้แสดงความกังวลเกี่ยวกับการเปลี่ยนจาก Line ไป Slack: ${userMessages.join(', ')}`
      });
    }

    let prompt: string;

    if (isOldFormat) {
      // Old format - just concerns
      prompt = `สรุปประเด็นความกังวลเกี่ยวกับการเปลี่ยนจาก Line มาใช้ Slack ให้เป็น 1-2 ประโยคที่ครอบคลุมประเด็นสำคัญ:

ความกังวลที่แสดงออกมา:
${concerns.map((concern: string, index: number) => `${index + 1}. ${concern}`).join('\n')}

กรุณาสรุปให้ครอบคลุมประเด็นหลักทั้งหมด ใช้ภาษาไทยระดับมืออาชีพ`;
    } else {
      // New format - full conversation
      const conversationText = conversation.map((msg: any) => 
        `${msg.role === 'user' ? 'ผู้ใช้' : 'AI'}: ${msg.content}`
      ).join('\n\n');

      prompt = `จากบทสนทนาเรื่องการเปลี่ยนจาก Line มาใช้ Slack ให้สรุปประเด็นความกังวลหลักให้เป็น 1-2 ประโยคที่ครอบคลุมประเด็นสำคัญ:

บทสนทนา:
${conversationText}

สรุปเฉพาะประเด็นความกังวลหลักและเหตุผลที่สำคัญ ใช้ภาษาไทยระดับมืออาชีพ`;
    }

    console.log('Prompt being sent to OpenAI:', prompt);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content || 'ผู้ใช้แสดงความกังวลเกี่ยวกับการเปลี่ยนจาก Line ไป Slack';
    console.log('OpenAI response:', summary);

    return NextResponse.json({
      summary: summary.trim()
    });

  } catch (error) {
    console.error('Error in summarize API:', error);
    
    // Fallback response on any error
    try {
      const { conversation, concerns } = await request.json();
      const isOldFormat = concerns && !conversation;
      
      let fallbackSummary: string;
      if (isOldFormat) {
        fallbackSummary = concerns.length === 1 
          ? `ความกังวลหลัก: ${concerns[0]}`
          : `ผู้ใช้แสดงความกังวลหลายประการเกี่ยวกับการเปลี่ยนจาก Line ไป Slack รวมถึง: ${concerns.slice(0, 2).join(' และ ')}`;
      } else {
        const userMessages = conversation.filter((m: any) => m.role === 'user').map((m: any) => m.content);
        fallbackSummary = `ผู้ใช้แสดงความกังวลเกี่ยวกับการเปลี่ยนจาก Line ไป Slack: ${userMessages.slice(0, 2).join(' และ ')}`;
      }
      
      return NextResponse.json({
        summary: fallbackSummary
      });
    } catch (parseError) {
      return NextResponse.json({
        summary: 'ผู้ใช้แสดงความกังวลเกี่ยวกับการเปลี่ยนจาก Line ไป Slack'
      });
    }
  }
}
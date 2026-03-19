interface Env {
  OPENAI_API_KEY: string;
}

interface RequestBody {
  image: string;
  height: string;
  weight: string;
  faceFeatures?: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const { image, height, weight, faceFeatures } = await request.json();
      
      // Log key presence for debugging (don't log full key!)
      console.log('API Key loaded:', env.OPENAI_API_KEY ? `Yes (starts with ${env.OPENAI_API_KEY.slice(0, 5)}...)` : 'No');

      if (!image || !height || !weight) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const base64Image = image.split(',')[1];

      // Using Chat Completions API as it's more stable/widely available
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `당신은 전문 퍼스널 스타일리스트입니다.
사용자의 사진과 신체 정보를 분석하여 맞춤형 스타일 컨설팅 보고서를 작성해주세요.
보고서에는 다음 내용을 포함해주세요.
1. 체형 분석
2. 퍼스널 컬러 추천
3. 어울리는 스타일 및 패션 아이템 추천
4. 피해야 할 스타일
5. 코디 팁
친절하고 전문적인 톤으로 작성해주세요. 한국어로 답변해주세요.`,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `사용자 신체 정보:\n키: ${height}cm\n몸무게: ${weight}kg${faceFeatures ? `\n얼굴 특징: ${faceFeatures}` : ''}\n이 정보를 바탕으로 첨부된 사진 속 인물을 위한 상세 스타일 보고서를 작성해 주세요.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI Error:', response.status, errorText);
        return new Response(JSON.stringify({ error: `OpenAI API error: ${response.status}` }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify({ error: data.error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const report = data.choices[0].message.content;

      return new Response(JSON.stringify({ report }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Server Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
};
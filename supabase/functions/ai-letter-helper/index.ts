import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "intro") {
      systemPrompt = `당신은 교도소에 수감된 가족에게 편지를 쓰는 것을 돕는 따뜻한 조력자입니다.
편지의 서론(인사, 안부)을 작성해주세요.
한국어로 응답하세요. 친근하고 따뜻한 톤을 유지하세요.
2-3문장 정도로 자연스럽게 작성해주세요.`;
      
      const userHint = context?.userInput || "따뜻한 인사와 안부";
      userPrompt = `다음 내용으로 편지 서론을 작성해주세요: "${userHint}"

${context?.currentContent ? `현재 편지 내용: "${context.currentContent}"` : '새로운 편지입니다.'}

자연스럽고 진심어린 서론을 2-3문장으로 작성해주세요.
JSON 형식으로 응답: {"intro": "작성된 서론 내용"}`;
    } else if (type === "suggestions") {
      systemPrompt = `당신은 교도소에 수감된 가족에게 편지를 쓰는 것을 돕는 따뜻한 조력자입니다.
사용자가 편지를 쓰기 시작할 때 사용할 수 있는 다양한 문장 시작 예시를 제공합니다.
한국어로 응답하세요. 친근하고 따뜻한 톤을 유지하세요.`;
      
      userPrompt = `교도소에 있는 ${context?.relation || '가족'}에게 편지를 쓰려고 합니다.
편지 시작에 사용할 수 있는 따뜻하고 진심어린 문장 4개를 제안해주세요.
각 문장은 한 줄로 짧게, 다양한 분위기로 작성해주세요.
JSON 형식으로 응답하세요: {"suggestions": ["문장1", "문장2", "문장3", "문장4"]}`;
    } else if (type === "continue") {
      systemPrompt = `당신은 교도소에 수감된 가족에게 편지를 쓰는 것을 돕는 따뜻한 조력자입니다.
사용자가 작성한 내용을 바탕으로 자연스럽게 이어질 문장을 제안합니다.
한국어로 응답하세요. 친근하고 따뜻한 톤을 유지하세요.`;
      
      userPrompt = `현재 작성 중인 편지 내용:
"${context?.content || ''}"

이 편지에 이어질 수 있는 자연스러운 문장 3개를 제안해주세요.
각 문장은 편지의 톤과 맥락에 맞게 작성해주세요.
JSON 형식으로 응답하세요: {"suggestions": ["문장1", "문장2", "문장3"]}`;
    } else if (type === "improve") {
      systemPrompt = `당신은 편지 작성을 돕는 문장 개선 전문가입니다.
사용자가 제공한 문장을 더 감동적이고 진심어린 표현으로 개선합니다.
한국어로 응답하세요.`;
      
      userPrompt = `다음 문장을 더 따뜻하고 감동적으로 개선해주세요:
"${context?.content || ''}"

개선된 문장 하나만 응답해주세요. JSON 형식: {"improved": "개선된 문장"}`;
    }

    console.log("Request type:", type);
    console.log("Sending request to Lovable AI Gateway");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI 사용량을 초과했습니다." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;
    
    console.log("AI response:", aiContent);

    // Parse JSON response
    let result;
    try {
      // Extract JSON from the response (sometimes wrapped in markdown)
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { error: "Could not parse AI response" };
      }
    } catch (e) {
      console.error("JSON parse error:", e);
      result = { raw: aiContent };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-letter-helper:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
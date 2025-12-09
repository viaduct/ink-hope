import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type WriterType = "intro" | "middle" | "conclusion";

interface AIWriterModalProps {
  type: WriterType;
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  currentContent?: string;
}

const modalConfig = {
  intro: {
    emoji: "👋",
    title: "처음 작성",
    subtitle: "인사와 안부를 전해요",
    question: "어떤 인사/안부를 전하고 싶으세요?",
    placeholder: "예: 오랜만에 연락드려요, 날씨가 추워졌는데 건강은 어떠신지...",
    aiHint: "AI가 처음 부분을 작성해 편지에 추가해요!",
    buttonText: "처음 작성",
    gradientFrom: "from-orange-400",
    gradientVia: "via-orange-500",
    gradientTo: "to-amber-500",
    buttonGradientFrom: "from-orange-500",
    buttonGradientTo: "to-amber-500",
    shadowColor: "shadow-orange-500/25",
    quickOptions: [
      { label: "따뜻한 인사로 시작하기", value: "warm_greeting", icon: "🤗" },
      { label: "안부 묻기", value: "ask_wellbeing", icon: "💝" },
      { label: "편지 쓰게 된 계기", value: "reason", icon: "✉️" },
      { label: "계절 인사", value: "seasonal", icon: "🌸" },
      { label: "오랜만에 연락", value: "long_time", icon: "👋" },
    ],
  },
  middle: {
    emoji: "💬",
    title: "중간 작성",
    subtitle: "하고 싶은 이야기를 전해요",
    question: "어떤 이야기를 전하고 싶으세요?",
    placeholder: "예: 최근 면회 다녀온 후 느낀 점, 가족들 근황, 응원의 말...",
    aiHint: "AI가 중간 부분을 작성해 편지에 추가해요!",
    buttonText: "중간 작성",
    gradientFrom: "from-amber-400",
    gradientVia: "via-yellow-500",
    gradientTo: "to-orange-400",
    buttonGradientFrom: "from-amber-500",
    buttonGradientTo: "to-orange-500",
    shadowColor: "shadow-amber-500/25",
    quickOptions: [
      { label: "근황 전하기", value: "update", icon: "📝" },
      { label: "감사 표현하기", value: "gratitude", icon: "🙏" },
      { label: "보고싶은 마음 전하기", value: "missing", icon: "💕" },
      { label: "응원 메시지", value: "cheer", icon: "💪" },
      { label: "추억 이야기", value: "memory", icon: "📸" },
      { label: "일상 공유", value: "daily", icon: "☀️" },
    ],
  },
  conclusion: {
    emoji: "🌟",
    title: "마무리 작성",
    subtitle: "마무리 인사를 해요",
    question: "어떻게 마무리하고 싶으세요?",
    placeholder: "예: 다음 면회 때 보고 싶다, 건강 챙기시라, 항상 응원한다...",
    aiHint: "AI가 마무리 부분을 작성해 편지에 추가해요!",
    buttonText: "마무리 작성",
    gradientFrom: "from-violet-400",
    gradientVia: "via-purple-500",
    gradientTo: "to-fuchsia-500",
    buttonGradientFrom: "from-violet-500",
    buttonGradientTo: "to-fuchsia-500",
    shadowColor: "shadow-violet-500/25",
    quickOptions: [
      { label: "건강 당부", value: "health", icon: "💖" },
      { label: "다시 만날 약속", value: "promise", icon: "🤝" },
      { label: "사랑 표현", value: "love", icon: "❤️" },
      { label: "응원과 격려", value: "encourage", icon: "✨" },
      { label: "기다리겠다는 말", value: "waiting", icon: "🌙" },
      { label: "희망적인 마무리", value: "hope", icon: "🌈" },
    ],
  },
};

const promptMap: Record<string, Record<string, string>> = {
  intro: {
    warm_greeting: "따뜻하고 다정한 인사로 시작하는 처음",
    ask_wellbeing: "상대방의 안부를 묻는 처음",
    reason: "편지를 쓰게 된 계기를 말하는 처음",
    seasonal: "계절과 날씨를 언급하며 시작하는 처음",
    long_time: "오랜만에 연락한다는 내용의 처음",
  },
  middle: {
    update: "최근 근황을 전하는 본론",
    gratitude: "감사의 마음을 표현하는 본론",
    missing: "보고싶은 마음을 전하는 본론",
    cheer: "응원과 격려의 메시지를 담은 본론",
    memory: "함께했던 추억을 이야기하는 본론",
    daily: "일상을 공유하는 본론",
  },
  conclusion: {
    health: "건강을 당부하는 마무리",
    promise: "다시 만날 약속을 하는 마무리",
    love: "사랑을 표현하는 마무리",
    encourage: "응원과 격려로 마무리",
    waiting: "기다리겠다는 마음을 담은 마무리",
    hope: "희망적인 메시지로 마무리",
  },
};

export function AIWriterModal({ 
  type,
  isOpen, 
  onClose, 
  onInsert,
  currentContent = ""
}: AIWriterModalProps) {
  const [userInput, setUserInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const config = modalConfig[type];

  const handleQuickSelect = (value: string) => {
    setSelectedOption(selectedOption === value ? null : value);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    
    try {
      let prompt = userInput;
      
      if (!prompt && selectedOption) {
        prompt = promptMap[type][selectedOption] || selectedOption;
      }

      const { data, error } = await supabase.functions.invoke('ai-letter-helper', {
        body: { 
          type: type,
          context: { 
            userInput: prompt,
            currentContent 
          }
        }
      });

      if (error) throw error;
      
      if (data.content) {
        onInsert(data.content);
        toast.success(`${config.title.replace(' 작성', '')} 부분이 추가되었습니다!`);
        handleClose();
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error("생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUserInput("");
    setSelectedOption(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        {/* 헤더 - 그라데이션 배경 */}
        <div className={`bg-gradient-to-br ${config.gradientFrom} ${config.gradientVia} ${config.gradientTo} p-6 pb-8`}>
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-2xl">{config.emoji}</span>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {config.title}
                </DialogTitle>
                <DialogDescription className="text-white/80 mt-0.5">
                  {config.subtitle}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 -mt-4 space-y-5">
          {/* 현재 편지 내용 미리보기 */}
          {currentContent && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/40 dark:to-gray-950/40 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-800/30 shadow-sm">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">현재 편지 내용</p>
              <p className="text-foreground text-sm leading-relaxed line-clamp-2">
                {currentContent.substring(0, 100)}{currentContent.length > 100 ? '...' : ''}
              </p>
            </div>
          )}

          {/* 카드 형태의 메인 컨텐츠 */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 space-y-5">
            {/* 사용자 입력 */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-foreground">
                {config.question}
              </label>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={config.placeholder}
                className="min-h-[90px] resize-none bg-muted/40 border-0 focus:ring-2 focus:ring-primary/30 rounded-xl text-sm"
              />
            </div>

            {/* 빠른 선택 */}
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">빠른 선택</p>
              <div className="flex flex-wrap gap-2">
                {config.quickOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleQuickSelect(option.value)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedOption === option.value
                        ? `bg-gradient-to-r ${config.buttonGradientFrom} ${config.buttonGradientTo} text-white shadow-md ${config.shadowColor}`
                        : "bg-muted/60 text-foreground hover:bg-muted border border-transparent hover:border-border"
                    }`}
                  >
                    <span>{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI 안내 */}
          <div className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-xl border border-violet-100/50 dark:border-violet-800/30`}>
            <div className={`w-8 h-8 bg-gradient-to-br ${config.buttonGradientFrom} ${config.buttonGradientTo} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-violet-700 dark:text-violet-300">
              {config.aiHint}
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="flex-1 h-12 text-base font-medium hover:bg-muted"
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || (!userInput && !selectedOption)}
              className={`flex-[2] h-12 text-base font-semibold bg-gradient-to-r ${config.buttonGradientFrom} ${config.buttonGradientTo} hover:opacity-90 text-white border-0 shadow-lg ${config.shadowColor} disabled:opacity-50 disabled:shadow-none`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {config.buttonText}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

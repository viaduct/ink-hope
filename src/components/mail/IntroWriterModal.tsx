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

interface IntroWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  currentContent?: string;
}

const quickOptions = [
  { label: "따뜻한 인사로 시작하기", value: "warm_greeting", icon: "🤗" },
  { label: "안부 묻기", value: "ask_wellbeing", icon: "💝" },
  { label: "편지 쓰게 된 계기", value: "reason", icon: "✉️" },
];

export function IntroWriterModal({ 
  isOpen, 
  onClose, 
  onInsert,
  currentContent = ""
}: IntroWriterModalProps) {
  const [userInput, setUserInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSelect = (value: string) => {
    setSelectedOption(selectedOption === value ? null : value);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    
    try {
      let prompt = userInput;
      
      if (!prompt && selectedOption) {
        switch (selectedOption) {
          case "warm_greeting":
            prompt = "따뜻하고 다정한 인사로 시작하는 처음";
            break;
          case "ask_wellbeing":
            prompt = "상대방의 안부를 묻는 처음";
            break;
          case "reason":
            prompt = "편지를 쓰게 된 계기를 말하는 처음";
            break;
        }
      }

      const { data, error } = await supabase.functions.invoke('ai-letter-helper', {
        body: { 
          type: 'intro',
          context: { 
            userInput: prompt,
            currentContent 
          }
        }
      });

      if (error) throw error;
      
      if (data.intro) {
        onInsert(data.intro);
        toast.success("처음 부분이 추가되었습니다!");
        handleClose();
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error generating intro:', error);
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
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        {/* 헤더 - 그라데이션 배경 */}
        <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 p-6 pb-8">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  처음 작성
                </DialogTitle>
                <DialogDescription className="text-white/80 mt-0.5">
                  인사와 안부를 전해요
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 -mt-4 space-y-5">
          {/* 현재 편지 내용 미리보기 */}
          {currentContent && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl p-4 border border-blue-100/50 dark:border-blue-800/30 shadow-sm">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1.5 uppercase tracking-wide">현재 편지 내용</p>
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
                어떤 인사/안부를 전하고 싶으세요?
              </label>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="예: 오랜만에 연락드려요, 날씨가 추워졌는데 건강은 어떠신지..."
                className="min-h-[90px] resize-none bg-muted/40 border-0 focus:ring-2 focus:ring-primary/30 rounded-xl text-sm"
              />
            </div>

            {/* 빠른 선택 */}
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">빠른 선택</p>
              <div className="flex flex-wrap gap-2">
                {quickOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleQuickSelect(option.value)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedOption === option.value
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
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
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-xl border border-violet-100/50 dark:border-violet-800/30">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-violet-700 dark:text-violet-300">
              AI가 처음 부분을 작성해 편지에 추가해요!
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
              className="flex-[2] h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  처음 작성
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

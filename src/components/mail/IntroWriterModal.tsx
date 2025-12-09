import { useState } from "react";
import { Loader2 } from "lucide-react";
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
  { label: "따뜻한 인사로 시작하기", value: "warm_greeting" },
  { label: "안부 묻기", value: "ask_wellbeing" },
  { label: "편지 쓰게 된 계기", value: "reason" },
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
            prompt = "따뜻하고 다정한 인사로 시작하는 서론";
            break;
          case "ask_wellbeing":
            prompt = "상대방의 안부를 묻는 서론";
            break;
          case "reason":
            prompt = "편지를 쓰게 된 계기를 말하는 서론";
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
        toast.success("서론이 추가되었습니다!");
        handleClose();
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error generating intro:', error);
      toast.error("서론 생성에 실패했습니다. 다시 시도해주세요.");
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
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
        {/* 헤더 */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👋</span>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                서론 작성
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-0.5">
                인사와 안부를 전해요
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* 현재 편지 내용 미리보기 */}
          {currentContent && (
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
              <p className="text-sm text-muted-foreground mb-1">현재 편지 내용</p>
              <p className="text-foreground line-clamp-2">
                {currentContent.substring(0, 100)}{currentContent.length > 100 ? '...' : ''}
              </p>
            </div>
          )}

          {/* 사용자 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              어떤 인사/안부를 전하고 싶으세요?
            </label>
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="예: 오랜만에 연락드려요, 날씨가 추워졌는데 건강은 어떠신지..."
              className="min-h-[100px] resize-none bg-muted/30 border-border focus:ring-primary/20"
            />
          </div>

          {/* 빠른 선택 */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">빠른 선택</p>
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleQuickSelect(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    selectedOption === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI 안내 */}
          <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-900">
            <span className="text-lg">💡</span>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              AI가 서론을 작성해 편지에 추가해요!
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 text-base"
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || (!userInput && !selectedOption)}
              className="flex-1 h-12 text-base bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  서론 작성
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
